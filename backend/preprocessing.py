import time
from typing import Dict, Any, Optional

class PreprocessingService:
    """
    Validates, cleans, and normalizes raw sensor readings into derived features.
    Maintains a rolling state window for trend detection and delta calculations.
    """

    def __init__(self):
        self.prev_distance_cm: Optional[float] = None
        self.prev_timestamp: Optional[float] = None
        self.packet_count: int = 0

    def process(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        now = time.time()
        self.packet_count += 1

        # 1. Ultrasonic Distance Processing (Front)
        front_dist_cm = raw_data.get("front_distance_cm")
        front_valid = front_dist_cm is not None and 2.0 <= front_dist_cm <= 450.0
        cleaned_front_dist = float(front_dist_cm) if front_valid else None

        # Rear Ultrasonic Distance
        rear_dist_cm = raw_data.get("rear_distance_cm")
        rear_valid = rear_dist_cm is not None and 2.0 <= rear_dist_cm <= 450.0
        cleaned_rear_dist = float(rear_dist_cm) if rear_valid else None

        # Distance Trend & Delta calculation
        dist_delta_cm = 0.0
        dt = 0.0
        distance_trend = "UNAVAILABLE"

        if cleaned_front_dist is not None and self.prev_distance_cm is not None and self.prev_timestamp is not None:
            dt = max(0.01, now - self.prev_timestamp)
            dist_delta_cm = cleaned_front_dist - self.prev_distance_cm

            if dist_delta_cm < -2.0:
                distance_trend = "CLOSING"
            elif dist_delta_cm > 2.0:
                distance_trend = "OPENING"
            else:
                distance_trend = "STABLE"
        elif cleaned_front_dist is not None:
            distance_trend = "STABLE"

        # Update previous distance state if valid
        if cleaned_front_dist is not None:
            self.prev_distance_cm = cleaned_front_dist
            self.prev_timestamp = now

        # 2. LDR & Visibility Index Normalization
        # LDR ADC is 0 to 4095.
        # When light is bright, resistance drops (voltage drops or rises depending on divider).
        # In this circuit: ADC ranges from ~100 to 4095. Higher ADC = higher attenuation / darkness.
        ldr_adc = raw_data.get("ldr_adc")
        if ldr_adc is not None:
            clamped_adc = max(0, min(4095, ldr_adc))
            # Visibility Index: 0% (pitch black / heavy fog) to 100% (crystal clear)
            visibility_pct = round((1.0 - (clamped_adc / 4095.0)) * 100.0, 1)
            if visibility_pct < 25.0:
                light_condition = "HAZARDOUS_FOG_DARKNESS"
            elif visibility_pct < 55.0:
                light_condition = "LOW_VISIBILITY_FOG"
            elif visibility_pct < 80.0:
                light_condition = "MODERATE_LIGHT"
            else:
                light_condition = "EXCELLENT_DAYLIGHT"
        else:
            visibility_pct = 75.0
            light_condition = "DEFAULT_ASSUMED"

        # 3. Gas State Normalization
        # MQ sensor output: "HIGH" typically triggers digital active state when gas/smoke concentration exceeds potentiometer threshold
        gas_level = (raw_data.get("gas_level") or "LOW").upper()
        gas_hazard = (gas_level == "HIGH" or (raw_data.get("gas_status") or "").upper() == "HAZARD")

        # 4. PIR Motion & Human Presence
        pir_val = (raw_data.get("pir") or "NO MOTION").upper()
        personnel_detected = ("MOTION" in pir_val and "NO" not in pir_val)

        # 5. IR Obstacle (Near-field obstacle sensor)
        # Active LOW on standard modules; parsed as "CLEAR" or "OBSTACLE"
        ir_val = (raw_data.get("ir_obstacle") or "CLEAR").upper()
        ir_obstacle_present = ("OBSTACLE" in ir_val)

        # 6. DHT11 Environmental Data
        dht_ok = raw_data.get("dht11_status") == "OK" and raw_data.get("temperature_c") is not None
        temp_c = float(raw_data.get("temperature_c")) if dht_ok else 24.0
        hum_pct = float(raw_data.get("humidity_pct")) if dht_ok else 50.0

        # Acoustical speed of sound compensation (m/s) based on temperature
        speed_of_sound_ms = round(331.3 * (1.0 + temp_c / 273.15) ** 0.5, 1)

        # 7. Speed from Potentiometer (when used as manual vehicle throttle / speed sim input)
        pot_adc = raw_data.get("pot_adc")
        if pot_adc is not None:
            # Scale 0-4095 ADC to 0-30 km/h vehicle speed
            derived_speed_kmh = round((pot_adc / 4095.0) * 30.0, 1)
        else:
            derived_speed_kmh = 12.0

        # 8. Sensor Health Matrix
        sensor_health = {
            "ultrasonic_front": "HEALTHY" if front_valid else "NO_ECHO",
            "ultrasonic_rear": "HEALTHY" if rear_valid else "NO_ECHO",
            "gas_sensor": "HEALTHY" if raw_data.get("gas_level") is not None else "OFFLINE",
            "ldr_sensor": "HEALTHY" if ldr_adc is not None else "OFFLINE",
            "pir_sensor": "HEALTHY" if raw_data.get("pir") is not None else "OFFLINE",
            "ir_sensor": "HEALTHY" if raw_data.get("ir_obstacle") is not None else "OFFLINE",
            "dht11_sensor": "HEALTHY" if dht_ok else "READ_ERROR",
            "oled_display": "HEALTHY" if raw_data.get("oled_hardware_status") == "ACTIVE" else "CHECK_WIRING"
        }

        # Calculate overall sensor confidence (0.0 to 1.0)
        healthy_count = sum(1 for v in sensor_health.values() if v == "HEALTHY")
        confidence = round(healthy_count / len(sensor_health), 2)

        return {
            "timestamp": now,
            "packet_index": self.packet_count,
            "front_distance_cm": {
                "value": cleaned_front_dist,
                "type": "MEASURED" if front_valid else "UNAVAILABLE",
                "unit": "cm"
            },
            "rear_distance_cm": {
                "value": cleaned_rear_dist,
                "type": "MEASURED" if rear_valid else "UNAVAILABLE",
                "unit": "cm"
            },
            "distance_trend": {
                "value": distance_trend,
                "delta_cm": round(dist_delta_cm, 2),
                "dt_sec": round(dt, 3),
                "type": "DERIVED"
            },
            "visibility_index": {
                "value": visibility_pct,
                "condition": light_condition,
                "type": "DERIVED",
                "unit": "%"
            },
            "gas_hazard": {
                "detected": gas_hazard,
                "level": gas_level,
                "type": "MEASURED"
            },
            "personnel_detected": {
                "value": personnel_detected,
                "type": "MEASURED"
            },
            "ir_obstacle_present": {
                "value": ir_obstacle_present,
                "type": "MEASURED"
            },
            "environment": {
                "temperature_c": temp_c,
                "humidity_pct": hum_pct,
                "speed_of_sound_ms": speed_of_sound_ms,
                "type": "MEASURED" if dht_ok else "ESTIMATED"
            },
            "vehicle_speed_kmh": {
                "value": derived_speed_kmh,
                "type": "DERIVED",
                "unit": "km/h"
            },
            "sensor_health": sensor_health,
            "confidence": confidence
        }
