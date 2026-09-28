import time
import math
import random
from typing import Dict, Any

class SimulationEngine:
    """
    Generates synthetic telemetry scenarios for testing when physical hardware is offline.
    Never presents simulated data as real hardware data. All packets are explicitly marked simulated=True.
    """

    def __init__(self):
        self.step = 0
        self.active_scenario = "NORMAL_PATROL"
        # Scenarios: "NORMAL_PATROL", "APPROACHING_HAZARD", "FOG_CORRIDOR", "GAS_LEAK", "PERSONNEL_TRIP"

    def set_scenario(self, scenario_name: str):
        self.active_scenario = scenario_name
        self.step = 0

    def generate_packet(self) -> Dict[str, Any]:
        self.step += 1
        t = self.step * 0.1

        # Base defaults
        front_dist_cm = 120.0
        rear_dist_cm = 85.0
        gas_level = "LOW"
        gas_status = "NORMAL"
        pir = "NO MOTION"
        ir_obst = "CLEAR"
        ldr_adc = 450
        ldr_volt_mv = 360
        temperature_c = 26.0
        humidity_pct = 55.0
        pot_adc = 2048
        pot_volt_mv = 1650
        dht_status = "OK"

        if self.active_scenario == "APPROACHING_HAZARD":
            # Distance gradually decreases: 110cm down to 22cm, then resets
            cycle_pos = (self.step % 80) / 80.0
            front_dist_cm = round(max(18.0, 110.0 - cycle_pos * 92.0), 1)
            rear_dist_cm = 45.0
            if front_dist_cm < 35.0:
                ir_obst = "OBSTACLE"

        elif self.active_scenario == "FOG_CORRIDOR":
            # Low visibility, high optical attenuation
            ldr_adc = int(3200 + 400 * math.sin(t))
            ldr_volt_mv = int((ldr_adc / 4095.0) * 3300)
            front_dist_cm = 65.0 + 10.0 * math.sin(t)
            humidity_pct = 88.0

        elif self.active_scenario == "GAS_LEAK":
            gas_level = "HIGH"
            gas_status = "HAZARD"
            front_dist_cm = 80.0

        elif self.active_scenario == "PERSONNEL_TRIP":
            pir = "MOTION"
            front_dist_cm = 42.0

        elif self.active_scenario == "SENSOR_ERROR":
            dht_status = "READ ERROR"
            temperature_c = None
            humidity_pct = None
            front_dist_cm = None  # NO ECHO

        else: # NORMAL_PATROL
            front_dist_cm = round(90.0 + 20.0 * math.sin(t * 0.5) + random.uniform(-1.5, 1.5), 1)
            rear_dist_cm = round(75.0 + 10.0 * math.cos(t * 0.5), 1)

        return {
            "front_distance_cm": front_dist_cm,
            "rear_distance_cm": rear_dist_cm,
            "gas_level": gas_level,
            "gas_status": gas_status,
            "ldr_adc": ldr_adc,
            "ldr_voltage_mv": ldr_volt_mv,
            "pir": pir,
            "ir_obstacle": ir_obst,
            "dht11_status": dht_status,
            "temperature_c": temperature_c,
            "humidity_pct": humidity_pct,
            "pot_adc": pot_adc,
            "pot_voltage_mv": pot_volt_mv,
            "raw_lines": [f"[SIMULATED SCENARIO: {self.active_scenario}]"],
            "timestamp": time.time(),
            "simulated": True
        }
