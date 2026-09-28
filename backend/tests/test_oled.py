import pytest
from backend.oled_controller import OLEDController

def test_oled_downlink_formatting():
    risk_result = {
        "risk_level": "HIGH",
        "recommended_action": "REDUCE_SPEED_50",
        "safe_path": "BEAR_LEFT"
    }
    processed_data = {
        "front_distance_cm": {"value": 420.0}  # 4.2m
    }
    ttc_result = {
        "ttc_seconds": 2.8
    }

    msg = OLEDController.generate_downlink_message(risk_result, processed_data, ttc_result)
    assert msg.startswith("OLED|")
    assert "RISK=HIGH" in msg
    assert "TTC=2.8s" in msg
    assert "DIST=4.2m" in msg
    assert "ACT=SLOW" in msg
    assert "PATH=LEFT" in msg
    assert msg.endswith("\n")

def test_oled_downlink_unavailable_values():
    risk_result = {
        "risk_level": "LOW",
        "recommended_action": "MAINTAIN_SPEED",
        "safe_path": "CLEAR"
    }
    processed_data = {
        "front_distance_cm": {"value": None}
    }
    ttc_result = {
        "ttc_seconds": None
    }

    msg = OLEDController.generate_downlink_message(risk_result, processed_data, ttc_result)
    assert "TTC=--" in msg
    assert "DIST=--" in msg
    assert "RISK=LOW" in msg
    assert "ACT=NORMAL" in msg
