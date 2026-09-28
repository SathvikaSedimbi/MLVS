import pytest
from backend.preprocessing import PreprocessingService
from backend.ttc import TTCEngine
from backend.risk_engine import RiskEngine

def test_risk_scaling_with_approaching_obstacle():
    preprocessor = PreprocessingService()
    ttc_engine = TTCEngine()
    risk_engine = RiskEngine()

    # Step 1: Obstacle at 150 cm (Buffer distance, far)
    raw1 = {
        "front_distance_cm": 150.0,
        "rear_distance_cm": 150.0,
        "gas_level": "LOW",
        "pir": "NO MOTION",
        "ir_obstacle": "CLEAR",
        "ldr_adc": 300,
        "dht11_status": "OK",
        "temperature_c": 25.0,
        "humidity_pct": 50.0
    }
    p1 = preprocessor.process(raw1)
    t1 = ttc_engine.calculate_ttc(150.0, current_timestamp=0.0)
    r1 = risk_engine.evaluate(p1, t1)
    assert r1["risk_level"] in ("LOW", "MEDIUM")
    assert r1["risk_score"] < 40.0

    # Step 2: Obstacle closes to 50 cm (Warning zone < 60cm)
    raw2 = dict(raw1, front_distance_cm=50.0)
    p2 = preprocessor.process(raw2)
    t2 = ttc_engine.calculate_ttc(50.0, current_timestamp=1.0)
    r2 = risk_engine.evaluate(p2, t2)
    assert r2["risk_level"] in ("MEDIUM", "HIGH")
    assert r2["risk_score"] > r1["risk_score"]

    # Step 3: Obstacle closes to 20 cm (Critical zone < 30cm) + IR trips
    raw3 = dict(raw1, front_distance_cm=20.0, ir_obstacle="OBSTACLE")
    p3 = preprocessor.process(raw3)
    t3 = ttc_engine.calculate_ttc(20.0, current_timestamp=2.0)
    r3 = risk_engine.evaluate(p3, t3)
    assert r3["risk_level"] == "CRITICAL"
    assert r3["risk_score"] >= 80.0
    assert r3["recommended_action"] == "EMERGENCY_STOP"

def test_risk_gas_hazard_override():
    preprocessor = PreprocessingService()
    risk_engine = RiskEngine()

    raw_gas = {
        "front_distance_cm": 150.0,
        "gas_level": "HIGH",
        "gas_status": "HAZARD",
        "pir": "NO MOTION",
        "ir_obstacle": "CLEAR",
        "ldr_adc": 400
    }
    proc = preprocessor.process(raw_gas)
    ttc_mock = {"ttc_seconds": None, "status": "UNAVAILABLE"}
    risk = risk_engine.evaluate(proc, ttc_mock)
    
    assert risk["risk_score"] >= 70.0
    assert "HAZARDOUS_GAS_OR_SMOKE_DETECTED" in risk["alerts"]
    assert risk["recommended_action"] == "EMERGENCY_EVACUATION"
