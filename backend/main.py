import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.config import settings
from backend.database import init_db, active_db_type
from backend.websocket_manager import ws_manager
from backend.telemetry_service import telemetry_service

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("MLVS.Main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup:
    logger.info("Initializing MLVS Backend Services...")
    init_db()
    loop = asyncio.get_running_loop()
    telemetry_service.set_event_loop(loop)
    telemetry_service.start()
    logger.info(f"Serial Manager targeting {settings.COM_PORT} @ {settings.BAUD_RATE} baud.")
    yield
    # Shutdown:
    logger.info("Shutting down MLVS Backend Services...")
    telemetry_service.stop()

app = FastAPI(
    title="MLVS - Mine Low-Visibility Support Platform API",
    version="1.0.0",
    description="Backend telemetry processing, kinematic TTC, risk evaluation, and hardware downlink service for STM32.",
    lifespan=lifespan
)

# Enable CORS for Vite frontend (typically localhost:5173 or localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class SafetyCommandRequest(BaseModel):
    command: str
    issued_by: Optional[str] = "CONTROL_ROOM_OPERATOR"

class SerialConfigRequest(BaseModel):
    com_port: str
    baud_rate: Optional[int] = 115200

class ScenarioRequest(BaseModel):
    scenario: str

# -------------------------------------------------------------
# REST API Endpoints
# -------------------------------------------------------------

@app.get("/api/health")
def get_health():
    return {
        "status": "HEALTHY",
        "service": "MLVS Telemetry & Risk Engine",
        "version": "1.0.0",
        "database": active_db_type
    }

@app.get("/api/status")
def get_status():
    serial_status = telemetry_service.serial_manager.get_status()
    return {
        "hardware": serial_status,
        "telemetry_count": telemetry_service.preprocessor.packet_count,
        "is_simulating": telemetry_service.is_simulating,
        "active_ws_clients": len(ws_manager.active_connections),
        "database_type": active_db_type
    }

@app.get("/api/telemetry/latest")
def get_latest_telemetry():
    if telemetry_service.latest_telemetry is None:
        return {
            "status": "INITIALIZING_HARDWARE",
            "vehicle": {"vehicle_id": settings.VEHICLE_ID, "speed_kmh": 0.0, "battery_pct": 100.0, "status": "ONLINE"},
            "raw": None,
            "processed": None,
            "ttc": {"ttc_seconds": None, "status": "UNAVAILABLE"},
            "risk": {
                "risk_score": 0.0,
                "risk_level": "LOW",
                "state": "NORMAL",
                "alerts": [],
                "recommended_action": "MAINTAIN_SPEED",
                "safe_path": "CLEAR",
                "confidence": 1.0
            },
            "digital_twin": {
                "vehicle_present": True,
                "vehicle_id": settings.VEHICLE_ID,
                "obstacle_present": False,
                "obstacle_distance_m": None,
                "risk_level": "LOW",
                "visibility": "CLEAR",
                "safe_path": "CLEAR"
            },
            "hardware_connected": telemetry_service.serial_manager.state == "CONNECTED",
            "is_simulated": False
        }
    return telemetry_service.latest_telemetry

@app.get("/api/risk")
def get_risk_assessment():
    latest = telemetry_service.latest_telemetry
    if latest and "risk" in latest:
        return latest["risk"]
    # Fallback default
    return {
        "risk_score": 0.0,
        "risk_level": "LOW",
        "state": "NORMAL",
        "alerts": [],
        "recommended_action": "MAINTAIN_SPEED",
        "safe_path": "CLEAR",
        "confidence": 1.0
    }

@app.get("/api/alerts")
def get_recent_alerts():
    return {
        "alerts": telemetry_service.recent_alerts
    }

@app.get("/api/vehicle")
def get_vehicle_info():
    latest = telemetry_service.latest_telemetry
    return {
        "vehicle_id": settings.VEHICLE_ID,
        "type": "HAUL_TRUCK_PROTOTYPE_1_10",
        "controller": "STM32 NUCLEO-F446RE",
        "com_port": settings.COM_PORT,
        "baud_rate": settings.BAUD_RATE,
        "telemetry": latest.get("vehicle") if latest else None
    }

@app.get("/api/config")
def get_configuration():
    return {
        "com_port": settings.COM_PORT,
        "baud_rate": settings.BAUD_RATE,
        "vehicle_id": settings.VEHICLE_ID,
        "oled_downlink_enabled": settings.OLED_DOWNLINK_ENABLED,
        "thresholds": {
            "critical_dist_cm": settings.CRITICAL_DISTANCE_CM,
            "warning_dist_cm": settings.WARNING_DISTANCE_CM,
            "critical_ttc_sec": settings.CRITICAL_TTC_SEC,
            "warning_ttc_sec": settings.WARNING_TTC_SEC
        }
    }

@app.post("/api/serial/connect")
def connect_serial(req: SerialConfigRequest):
    telemetry_service.serial_manager.update_config(req.com_port, req.baud_rate)
    return {
        "status": "RECONNECTING",
        "com_port": req.com_port,
        "baud_rate": req.baud_rate
    }

@app.post("/api/serial/disconnect")
def disconnect_serial():
    telemetry_service.serial_manager.stop()
    return {"status": "DISCONNECTED"}

@app.post("/api/simulation/start")
def start_simulation():
    telemetry_service.start_simulation()
    return {"status": "SIMULATION_STARTED"}

@app.post("/api/simulation/stop")
def stop_simulation():
    telemetry_service.stop_simulation()
    return {"status": "SIMULATION_STOPPED"}

@app.post("/api/simulation/scenario")
def set_scenario(req: ScenarioRequest):
    telemetry_service.sim_engine.set_scenario(req.scenario)
    if not telemetry_service.is_simulating:
        telemetry_service.start_simulation()
    return {"status": "SCENARIO_SET", "scenario": req.scenario}

@app.post("/api/safety/command")
def post_safety_command(req: SafetyCommandRequest):
    entry = telemetry_service.dispatch_safety_command(req.command, req.issued_by)
    return {"status": "DISPATCHED", "log": entry}

# -------------------------------------------------------------
# WebSocket Endpoint
# -------------------------------------------------------------

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Immediately push the latest available state upon connection
        if telemetry_service.latest_telemetry:
            await websocket.send_json(telemetry_service.latest_telemetry)

        while True:
            # Listen for incoming client messages (e.g. ping/heartbeat or command overrides)
            data = await websocket.receive_text()
            if data == "PING":
                await websocket.send_text("PONG")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.debug(f"WebSocket client loop exception: {e}")
        ws_manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
