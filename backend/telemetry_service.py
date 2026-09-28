import time
import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

from backend.config import settings
from backend.serial_manager import SerialManager
from backend.preprocessing import PreprocessingService
from backend.ttc import TTCEngine
from backend.risk_engine import RiskEngine
from backend.oled_controller import OLEDController
from backend.websocket_manager import ws_manager
from backend.simulation import SimulationEngine
from backend.database import SessionLocal
from backend.models import TelemetryLog, AlertLog, SafetyCommandLog

logger = logging.getLogger("MLVS.TelemetryService")

class TelemetryService:
    """
    Core orchestrator for sensor data ingestion, algorithmic pipeline execution,
    OLED downlink generation, database persistence, and WebSocket broadcasting.
    """

    def __init__(self):
        self.preprocessor = PreprocessingService()
        self.ttc_engine = TTCEngine()
        self.risk_engine = RiskEngine()
        self.oled_controller = OLEDController()
        self.sim_engine = SimulationEngine()

        self.serial_manager = SerialManager(on_packet_callback=self.on_hardware_packet)
        self.loop: Optional[asyncio.AbstractEventLoop] = None

        self.latest_telemetry: Optional[Dict[str, Any]] = None
        self.recent_alerts: List[Dict[str, Any]] = []
        self.command_log: List[Dict[str, Any]] = []
        
        self.is_simulating: bool = settings.SIMULATION_MODE
        self._sim_task: Optional[asyncio.Task] = None
        self._last_oled_time: float = 0.0

    def set_event_loop(self, loop: asyncio.AbstractEventLoop):
        self.loop = loop

    def start(self):
        """Starts hardware ingestion and simulation runner."""
        self.serial_manager.start()
        if self.is_simulating:
            self.start_simulation()

    def stop(self):
        self.stop_simulation()
        self.serial_manager.stop()

    def start_simulation(self):
        self.is_simulating = True
        if self._sim_task is None or self._sim_task.done():
            if self.loop:
                self._sim_task = self.loop.create_task(self._simulation_loop())
                logger.info("Simulation loop started.")

    def stop_simulation(self):
        self.is_simulating = False
        if self._sim_task and not self._sim_task.done():
            self._sim_task.cancel()
            self._sim_task = None
            logger.info("Simulation loop stopped.")

    async def _simulation_loop(self):
        """Runs periodic synthetic generation when simulation mode is enabled."""
        while self.is_simulating:
            try:
                sim_packet = self.sim_engine.generate_packet()
                await self.process_and_broadcast(sim_packet)
                await asyncio.sleep(0.2)  # 5 Hz simulation rate
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in simulation loop: {e}")
                await asyncio.sleep(1.0)

    def on_hardware_packet(self, packet: Dict[str, Any]):
        """Callback from SerialManager background thread."""
        packet["simulated"] = False
        if self.loop and self.loop.is_running():
            asyncio.run_coroutine_threadsafe(self.process_and_broadcast(packet), self.loop)

    async def process_and_broadcast(self, raw_packet: Dict[str, Any]):
        now = time.time()

        # Step 1: Preprocess raw sensor data
        processed = self.preprocessor.process(raw_packet)

        # Step 2: Calculate Kinematic TTC
        front_dist_cm = processed["front_distance_cm"]["value"]
        ttc = self.ttc_engine.calculate_ttc(front_dist_cm, processed["timestamp"])

        # Step 3: Risk Engine Evaluation
        risk = self.risk_engine.evaluate(processed, ttc)

        # Step 4: Digital Twin State Construction
        front_m = round(front_dist_cm / 100.0, 2) if front_dist_cm is not None else None
        rear_cm = processed["rear_distance_cm"]["value"]
        rear_m = round(rear_cm / 100.0, 2) if rear_cm is not None else None

        digital_twin = {
            "vehicle_present": True,
            "vehicle_id": settings.VEHICLE_ID,
            "obstacle_present": (front_dist_cm is not None and front_dist_cm < 250.0),
            "obstacle_distance_m": front_m,
            "obstacle_rear_distance_m": rear_m,
            "risk_level": risk["risk_level"],
            "risk_score": risk["risk_score"],
            "visibility": processed["visibility_index"]["condition"],
            "visibility_pct": processed["visibility_index"]["value"],
            "safe_path": risk["safe_path"],
            "ir_obstacle": processed["ir_obstacle_present"]["value"],
            "pir_motion": processed["personnel_detected"]["value"],
            "gas_hazard": processed["gas_hazard"]["detected"],
            "vehicle_speed_kmh": processed["vehicle_speed_kmh"]["value"],
            "vehicle_direction": "FORWARD"
        }

        # Step 5: OLED Downlink Generation & Transmission
        oled_msg = self.oled_controller.generate_downlink_message(risk, processed, ttc)
        if settings.OLED_DOWNLINK_ENABLED and (now - self._last_oled_time >= settings.OLED_UPDATE_INTERVAL_SEC):
            self.serial_manager.send_downlink(oled_msg)
            self._last_oled_time = now

        # Step 6: Compile Full Real-time State
        full_payload = {
            "vehicle": {
                "vehicle_id": settings.VEHICLE_ID,
                "speed_kmh": processed["vehicle_speed_kmh"]["value"],
                "battery_pct": 98.0,
                "status": risk["risk_level"]
            },
            "raw": raw_packet,
            "processed": processed,
            "ttc": ttc,
            "risk": risk,
            "digital_twin": digital_twin,
            "oled": {
                "downlink_frame": oled_msg.strip(),
                "active": settings.OLED_DOWNLINK_ENABLED
            },
            "timestamp": now,
            "iso_time": datetime.utcnow().isoformat() + "Z",
            "hardware_connected": self.serial_manager.state == "CONNECTED",
            "is_simulated": raw_packet.get("simulated", False)
        }

        self.latest_telemetry = full_payload

        # Update alerts history
        for alert in risk.get("alerts", []):
            alert_entry = {
                "id": len(self.recent_alerts) + 1,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "alert": alert,
                "risk_level": risk["risk_level"],
                "vehicle_id": settings.VEHICLE_ID
            }
            self.recent_alerts.insert(0, alert_entry)
        if len(self.recent_alerts) > 50:
            self.recent_alerts = self.recent_alerts[:50]

        # Step 7: Asynchronous Database Persistence
        self._persist_to_db(full_payload, raw_packet, processed, ttc, risk)

        # Step 8: WebSocket Broadcast to Connected Control Room Clients
        await ws_manager.broadcast(full_payload)

    def _persist_to_db(self, full_payload, raw_packet, processed, ttc, risk):
        """Saves telemetry log in background without blocking realtime stream."""
        if SessionLocal is None:
            return
        try:
            db = SessionLocal()
            log_record = TelemetryLog(
                vehicle_id=settings.VEHICLE_ID,
                front_distance_cm=processed["front_distance_cm"]["value"],
                rear_distance_cm=processed["rear_distance_cm"]["value"],
                closing_speed_kmh=ttc.get("closing_speed_kmh"),
                ttc_seconds=ttc.get("ttc_seconds"),
                risk_score=risk["risk_score"],
                risk_level=risk["risk_level"],
                recommended_action=risk["recommended_action"],
                safe_path=risk["safe_path"],
                visibility_index=processed["visibility_index"]["value"],
                gas_hazard=processed["gas_hazard"]["detected"],
                personnel_detected=processed["personnel_detected"]["value"],
                ir_obstacle=processed["ir_obstacle_present"]["value"],
                temperature_c=processed["environment"]["temperature_c"],
                humidity_pct=processed["environment"]["humidity_pct"],
                vehicle_speed_kmh=processed["vehicle_speed_kmh"]["value"],
                sensor_health=processed.get("sensor_health"),
                raw_payload=raw_packet,
                is_simulated=raw_packet.get("simulated", False)
            )
            db.add(log_record)
            db.commit()
            db.close()
        except Exception as e:
            logger.debug(f"DB log persist exception: {e}")

    def dispatch_safety_command(self, command: str, issued_by: str = "OPERATOR") -> Dict[str, Any]:
        """Dispatches safety override command down to vehicle and logs it."""
        entry = {
            "id": len(self.command_log) + 1,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "command": command,
            "issued_by": issued_by,
            "status": "DISPATCHED"
        }
        self.command_log.insert(0, entry)

        # Transmit direct hardware override command down to STM32
        cmd_str = f"CMD|ACT={command}\n"
        self.serial_manager.send_downlink(cmd_str)

        # Also persist to DB if available
        if SessionLocal:
            try:
                db = SessionLocal()
                cmd_rec = SafetyCommandLog(
                    vehicle_id=settings.VEHICLE_ID,
                    command=command,
                    issued_by=issued_by,
                    acknowledged=True
                )
                db.add(cmd_rec)
                db.commit()
                db.close()
            except Exception:
                pass

        return entry

telemetry_service = TelemetryService()
