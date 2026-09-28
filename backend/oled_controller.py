from typing import Dict, Any, Optional

class OLEDController:
    """
    Generates concise serial downlink packets from the Risk Engine for STM32 OLED display.
    Protocol format:
    OLED|RISK={LEVEL}|TTC={TTC_SEC}|DIST={DIST_M}|ACT={ACTION}|PATH={PATH}\n
    """

    @staticmethod
    def generate_downlink_message(
        risk_result: Dict[str, Any],
        processed_data: Dict[str, Any],
        ttc_result: Dict[str, Any]
    ) -> str:
        risk_level = risk_result.get("risk_level", "LOW")
        
        # TTC value string (e.g. "2.8" or "--")
        ttc_val = ttc_result.get("ttc_seconds")
        ttc_str = f"{ttc_val:.1f}s" if ttc_val is not None else "--"

        # Distance value in meters (e.g. "4.2m" or "--")
        dist_cm = processed_data.get("front_distance_cm", {}).get("value")
        if dist_cm is not None:
            dist_str = f"{dist_cm / 100.0:.1f}m"
        else:
            dist_str = "--"

        # Action abbreviation
        action = risk_result.get("recommended_action", "MAINTAIN")
        action_map = {
            "EMERGENCY_STOP": "STOP",
            "REDUCE_SPEED_50": "SLOW",
            "CAUTION_ADVISORY": "CAUTION",
            "MAINTAIN_SPEED": "NORMAL",
            "EMERGENCY_EVACUATION": "EVACUATE"
        }
        short_action = action_map.get(action, action[:8])

        # Path abbreviation
        path = risk_result.get("safe_path", "CLEAR")
        path_map = {
            "CLEAR": "CLEAR",
            "STOP": "HALT",
            "BEAR_LEFT": "LEFT",
            "BEAR_RIGHT": "RIGHT",
            "CENTER_CORRIDOR": "CENTER"
        }
        short_path = path_map.get(path, path[:6])

        # Serial protocol packet
        return f"OLED|RISK={risk_level}|TTC={ttc_str}|DIST={dist_str}|ACT={short_action}|PATH={short_path}\n"
