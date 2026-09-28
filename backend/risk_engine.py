from typing import Dict, Any, List, Optional
from backend.safety_rules import (
    DEFAULT_RISK_WEIGHTS,
    DIST_CRITICAL_CM,
    DIST_WARNING_CM,
    DIST_BUFFER_CM,
    TTC_CRITICAL_SEC,
    TTC_WARNING_SEC,
    VISIBILITY_CRITICAL_PCT,
    VISIBILITY_WARNING_PCT
)

class RiskEngine:
    """
    Multi-Factor Explainable Risk Engine for Mine Vehicle Safety (MLVS).
    Fuses ultrasonic proximity, kinematic TTC, near-field IR, MQ gas, PIR personnel detection,
    and optical fog attenuation into a unified risk metric (0-100).
    """

    def __init__(self, weights: Optional[Dict[str, float]] = None):
        self.weights = weights or dict(DEFAULT_RISK_WEIGHTS)

    def evaluate(self, processed_data: Dict[str, Any], ttc_data: Dict[str, Any]) -> Dict[str, Any]:
        alerts: List[str] = []
        factor_scores: Dict[str, float] = {}

        # 1. Proximity Distance Factor (0 - 100)
        front_dist = processed_data["front_distance_cm"]["value"]
        rear_dist = processed_data["rear_distance_cm"]["value"]

        dist_score = 0.0
        # Evaluate front distance primarily, or rear if closer
        effective_dist = None
        if front_dist is not None and rear_dist is not None:
            effective_dist = min(front_dist, rear_dist)
        elif front_dist is not None:
            effective_dist = front_dist
        elif rear_dist is not None:
            effective_dist = rear_dist

        if effective_dist is not None:
            if effective_dist <= DIST_CRITICAL_CM:
                # 0cm -> 100 risk, 30cm -> 80 risk
                dist_score = 80.0 + (1.0 - (max(0.0, effective_dist) / DIST_CRITICAL_CM)) * 20.0
                alerts.append(f"CRITICAL_PROXIMITY_ALERT_{int(effective_dist)}CM")
            elif effective_dist <= DIST_WARNING_CM:
                # 30cm -> 80 risk, 60cm -> 40 risk
                ratio = (DIST_WARNING_CM - effective_dist) / (DIST_WARNING_CM - DIST_CRITICAL_CM)
                dist_score = 40.0 + ratio * 40.0
                alerts.append(f"WARNING_PROXIMITY_{int(effective_dist)}CM")
            elif effective_dist <= DIST_BUFFER_CM:
                # 60cm -> 40 risk, 100cm -> 10 risk
                ratio = (DIST_BUFFER_CM - effective_dist) / (DIST_BUFFER_CM - DIST_WARNING_CM)
                dist_score = 10.0 + ratio * 30.0
            else:
                dist_score = 5.0
        else:
            # If distance sensor has no echo / unavailable, assign baseline caution
            dist_score = 20.0

        factor_scores["distance_risk"] = round(dist_score, 1)

        # 2. Kinematic TTC Factor (0 - 100)
        ttc_sec = ttc_data.get("ttc_seconds")
        ttc_score = 0.0

        if ttc_sec is not None:
            if ttc_sec <= TTC_CRITICAL_SEC:
                # 0s -> 100, 2s -> 80
                ttc_score = 80.0 + (1.0 - max(0.0, ttc_sec) / TTC_CRITICAL_SEC) * 20.0
                alerts.append(f"COLLISION_IMMINENT_TTC_{ttc_sec:.1f}S")
            elif ttc_sec <= TTC_WARNING_SEC:
                # 2s -> 80, 4s -> 40
                ratio = (TTC_WARNING_SEC - ttc_sec) / (TTC_WARNING_SEC - TTC_CRITICAL_SEC)
                ttc_score = 40.0 + ratio * 40.0
                alerts.append(f"TTC_HAZARD_ADVISORY_{ttc_sec:.1f}S")
            else:
                ttc_score = 10.0
        else:
            # TTC is unavailable or vehicle not closing.
            # Scale TTC factor using distance trend if available
            trend = processed_data.get("distance_trend", {}).get("value")
            if trend == "CLOSING":
                ttc_score = 45.0
            else:
                ttc_score = 0.0

        factor_scores["ttc_risk"] = round(ttc_score, 1)

        # 3. Near-Field IR Obstacle Factor (0 - 100)
        ir_active = processed_data["ir_obstacle_present"]["value"]
        ir_score = 85.0 if ir_active else 0.0
        if ir_active:
            alerts.append("NEAR_FIELD_IR_OBSTACLE_DETECTED")
        factor_scores["ir_obstacle_risk"] = round(ir_score, 1)

        # 4. MQ Hazardous Gas Factor (0 - 100)
        gas_active = processed_data["gas_hazard"]["detected"]
        gas_score = 90.0 if gas_active else 0.0
        if gas_active:
            alerts.append("HAZARDOUS_GAS_OR_SMOKE_DETECTED")
        factor_scores["gas_risk"] = round(gas_score, 1)

        # 5. PIR Personnel Detection Factor (0 - 100)
        pir_active = processed_data["personnel_detected"]["value"]
        pir_score = 65.0 if pir_active else 0.0
        if pir_active:
            alerts.append("PERSONNEL_DETECTED_IN_CORRIDOR")
        factor_scores["personnel_risk"] = round(pir_score, 1)

        # 6. Optical Visibility / Fog Attenuation Factor (0 - 100)
        vis_pct = processed_data["visibility_index"]["value"]
        vis_score = 0.0
        if vis_pct <= VISIBILITY_CRITICAL_PCT:
            vis_score = 80.0
            alerts.append("CRITICAL_FOG_OPTICAL_ATTENUATION")
        elif vis_pct <= VISIBILITY_WARNING_PCT:
            vis_score = 45.0
            alerts.append("MONSOON_FOG_CORRIDOR_ELEVATED_RISK")
        else:
            vis_score = 5.0
        factor_scores["visibility_risk"] = round(vis_score, 1)

        # Compute Weighted Risk Score (0 - 100)
        w = self.weights
        composite_score = (
            dist_score * w["distance"] +
            ttc_score * w["ttc"] +
            ir_score * w["ir_obstacle"] +
            gas_score * w["gas"] +
            pir_score * w["personnel"] +
            vis_score * w["visibility"]
        )

        # Immediate overrides: if critical proximity or gas leak or immediate IR obstacle, clamp minimum score
        if ir_active and effective_dist is not None and effective_dist <= DIST_CRITICAL_CM:
            composite_score = max(composite_score, 88.0)
        if gas_active and composite_score < 70.0:
            composite_score = max(composite_score, 70.0)

        risk_score = round(max(0.0, min(100.0, composite_score)), 1)

        # Determine Risk Level
        if risk_score >= 80.0:
            risk_level = "CRITICAL"
        elif risk_score >= 60.0:
            risk_level = "HIGH"
        elif risk_score >= 30.0:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Determine Recommended Operational Action
        if risk_level == "CRITICAL":
            recommended_action = "EMERGENCY_STOP"
        elif risk_level == "HIGH":
            recommended_action = "REDUCE_SPEED_50"
        elif risk_level == "MEDIUM":
            recommended_action = "CAUTION_ADVISORY"
        else:
            recommended_action = "MAINTAIN_SPEED"

        if gas_active:
            recommended_action = "EMERGENCY_EVACUATION"

        # Determine Safe Path Advisory based on sensor clearances
        safe_path = "CLEAR"
        if risk_level in ("CRITICAL", "HIGH"):
            if ir_active:
                # Near obstacle on front-right/front-left
                safe_path = "STOP"
            elif effective_dist is not None and effective_dist <= DIST_CRITICAL_CM:
                safe_path = "STOP"
            else:
                safe_path = "BEAR_LEFT"
        elif risk_level == "MEDIUM":
            safe_path = "CENTER_CORRIDOR"
        else:
            safe_path = "CLEAR"

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "state": risk_level if risk_level != "MEDIUM" else "WARNING",
            "alerts": alerts,
            "recommended_action": recommended_action,
            "safe_path": safe_path,
            "factors": factor_scores,
            "confidence": processed_data.get("confidence", 0.9),
            "thresholds": {
                "critical_dist_cm": DIST_CRITICAL_CM,
                "warning_dist_cm": DIST_WARNING_CM,
                "critical_ttc_sec": TTC_CRITICAL_SEC
            }
        }
