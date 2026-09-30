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

    def calculate_ttc(
        self,
        current_distance_cm: Optional[float],
        current_timestamp: Optional[float] = None,
        ground_speed_kmh: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Calculates TTC in seconds based on ground speed (distance / ground_speed)
        as well as discrete kinematic closing speed (distance / closing_speed).
        """
        now = current_timestamp if current_timestamp is not None else time.time()

        if current_distance_cm is None or current_distance_cm <= 0:
            self.last_valid_dist_m = None
            self.last_valid_timestamp = None
            return {
                "ttc_seconds": None,
                "ttc_ground_speed_sec": None,
                "ground_speed_kmh": ground_speed_kmh or 0.0,
                "closing_speed_mps": None,
                "closing_speed_kmh": None,
                "distance_m": None,
                "status": "UNAVAILABLE",
                "reason": "NO_DISTANCE_MEASUREMENT"
            }

        dist_m = current_distance_cm / 100.0

        # Calculate TTC directly based on vehicle ground speed (throttle input)
        ttc_ground_sec = None
        if ground_speed_kmh is not None and ground_speed_kmh > 0.5:
            ground_speed_mps = ground_speed_kmh / 3.6
            ttc_ground_sec = round(dist_m / ground_speed_mps, 2)

        if self.last_valid_dist_m is None or self.last_valid_timestamp is None:
            self.last_valid_dist_m = dist_m
            self.last_valid_timestamp = now
            return {
                "ttc_seconds": ttc_ground_sec,
                "ttc_ground_speed_sec": ttc_ground_sec,
                "ground_speed_kmh": ground_speed_kmh or 0.0,
                "closing_speed_mps": None,
                "closing_speed_kmh": None,
                "distance_m": round(dist_m, 2),
                "status": "VALID" if ttc_ground_sec is not None else "CALCULATING",
                "reason": "GROUND_SPEED_DERIVATION" if ttc_ground_sec is not None else "INITIALIZING_SAMPLE"
            }

        dt = now - self.last_valid_timestamp

        # Guard against duplicate or too fast calls (< 20ms) or stale calls (> 3s)
        if dt < 0.02:
            return {
                "ttc_seconds": ttc_ground_sec,
                "ttc_ground_speed_sec": ttc_ground_sec,
                "ground_speed_kmh": ground_speed_kmh or 0.0,
                "closing_speed_mps": None,
                "closing_speed_kmh": None,
                "distance_m": round(dist_m, 2),
                "status": "VALID" if ttc_ground_sec is not None else "UNAVAILABLE",
                "reason": "DT_TOO_SMALL"
            }

        if dt > 3.0:
            # Stale gap between packets, reset baseline
            self.last_valid_dist_m = dist_m
            self.last_valid_timestamp = now
            return {
                "ttc_seconds": ttc_ground_sec,
                "ttc_ground_speed_sec": ttc_ground_sec,
                "ground_speed_kmh": ground_speed_kmh or 0.0,
                "closing_speed_mps": None,
                "closing_speed_kmh": None,
                "distance_m": round(dist_m, 2),
                "status": "VALID" if ttc_ground_sec is not None else "UNAVAILABLE",
                "reason": "STALE_SAMPLE_GAP"
            }

        # Closing speed is rate of distance decrease: (d_prev - d_curr) / dt
        delta_m = self.last_valid_dist_m - dist_m
        closing_speed_mps = delta_m / dt

        # Update last valid state
        self.last_valid_dist_m = dist_m
        self.last_valid_timestamp = now

        # Compute relative kinematic TTC if closing
        ttc_kinematic_sec = None
        if closing_speed_mps > self.min_closing_speed_mps:
            ttc_kinematic_sec = round(dist_m / closing_speed_mps, 2)

        # Primary TTC is ground-speed-based if vehicle is moving, otherwise kinematic closing
        primary_ttc = ttc_ground_sec if ttc_ground_sec is not None else ttc_kinematic_sec

        return {
            "ttc_seconds": primary_ttc,
            "ttc_ground_speed_sec": ttc_ground_sec,
            "ground_speed_kmh": ground_speed_kmh or 0.0,
            "closing_speed_mps": round(max(0.0, closing_speed_mps), 2),
            "closing_speed_kmh": round(max(0.0, closing_speed_mps * 3.6), 1),
            "distance_m": round(dist_m, 2),
            "status": "VALID" if primary_ttc is not None else "STABLE_OR_OPENING",
            "reason": "GROUND_SPEED_DERIVATION" if ttc_ground_sec is not None else ("KINEMATIC_DERIVATION" if ttc_kinematic_sec is not None else "NO_HAZARDOUS_CLOSING_VECTOR")
        }
