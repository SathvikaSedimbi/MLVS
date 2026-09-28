import time
from typing import Optional, Dict, Any

class TTCEngine:
    """
    Kinematic Time-to-Collision (TTC) calculator.
    Uses successive real HC-SR04 ultrasonic distance measurements and precise timestamps.
    Never fabricates artificial speeds or TTC values.
    """

    def __init__(self, min_closing_speed_mps: float = 0.05):
        self.min_closing_speed_mps = min_closing_speed_mps
        self.last_valid_dist_m: Optional[float] = None
        self.last_valid_timestamp: Optional[float] = None

    def calculate_ttc(self, current_distance_cm: Optional[float], current_timestamp: Optional[float] = None) -> Dict[str, Any]:
        """
        Calculates TTC in seconds based on real distance decrease over time.
        """
        now = current_timestamp if current_timestamp is not None else time.time()

        if current_distance_cm is None or current_distance_cm <= 0:
            self.last_valid_dist_m = None
            self.last_valid_timestamp = None
            return {
                "ttc_seconds": None,
                "closing_speed_mps": None,
                "closing_speed_kmh": None,
                "status": "UNAVAILABLE",
                "reason": "NO_DISTANCE_MEASUREMENT"
            }

        dist_m = current_distance_cm / 100.0

        if self.last_valid_dist_m is None or self.last_valid_timestamp is None:
            self.last_valid_dist_m = dist_m
            self.last_valid_timestamp = now
            return {
                "ttc_seconds": None,
                "closing_speed_mps": None,
                "closing_speed_kmh": None,
                "status": "CALCULATING",
                "reason": "INITIALIZING_SAMPLE"
            }

        dt = now - self.last_valid_timestamp

        # Guard against duplicate or too fast calls (< 20ms) or stale calls (> 3s)
        if dt < 0.02:
            return {
                "ttc_seconds": None,
                "closing_speed_mps": None,
                "closing_speed_kmh": None,
                "status": "UNAVAILABLE",
                "reason": "DT_TOO_SMALL"
            }

        if dt > 3.0:
            # Stale gap between packets, reset baseline
            self.last_valid_dist_m = dist_m
            self.last_valid_timestamp = now
            return {
                "ttc_seconds": None,
                "closing_speed_mps": None,
                "closing_speed_kmh": None,
                "status": "UNAVAILABLE",
                "reason": "STALE_SAMPLE_GAP"
            }

        # Closing speed is rate of distance decrease: (d_prev - d_curr) / dt
        delta_m = self.last_valid_dist_m - dist_m
        closing_speed_mps = delta_m / dt

        # Update last valid state
        self.last_valid_dist_m = dist_m
        self.last_valid_timestamp = now

        # If obstacle is not closing (moving away or stationary)
        if closing_speed_mps <= self.min_closing_speed_mps:
            return {
                "ttc_seconds": None,
                "closing_speed_mps": round(max(0.0, closing_speed_mps), 2),
                "closing_speed_kmh": round(max(0.0, closing_speed_mps * 3.6), 1),
                "status": "STABLE_OR_OPENING",
                "reason": "NO_HAZARDOUS_CLOSING_VECTOR"
            }

        # TTC = distance / closing_speed
        ttc_sec = dist_m / closing_speed_mps

        return {
            "ttc_seconds": round(ttc_sec, 2),
            "closing_speed_mps": round(closing_speed_mps, 2),
            "closing_speed_kmh": round(closing_speed_mps * 3.6, 1),
            "status": "VALID",
            "reason": "KINEMATIC_DERIVATION"
        }
