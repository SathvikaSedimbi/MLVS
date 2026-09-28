import pytest
from backend.ttc import TTCEngine

def test_ttc_calculation_closing():
    engine = TTCEngine(min_closing_speed_mps=0.05)
    
    # First reading: 10 meters (1000 cm) at t = 0.0s
    res1 = engine.calculate_ttc(1000.0, current_timestamp=0.0)
    assert res1["status"] == "CALCULATING"
    assert res1["ttc_seconds"] is None

    # Second reading: 8 meters (800 cm) at t = 1.0s
    # delta_m = 2.0m, dt = 1.0s => closing_speed = 2.0 m/s
    # TTC = 8.0 / 2.0 = 4.0s
    res2 = engine.calculate_ttc(800.0, current_timestamp=1.0)
    assert res2["status"] == "VALID"
    assert res2["closing_speed_mps"] == 2.0
    assert res2["ttc_seconds"] == 4.0

    # Third reading: 6 meters (600 cm) at t = 2.0s
    # delta_m = 2.0m, dt = 1.0s => closing_speed = 2.0 m/s
    # TTC = 6.0 / 2.0 = 3.0s
    res3 = engine.calculate_ttc(600.0, current_timestamp=2.0)
    assert res3["status"] == "VALID"
    assert res3["ttc_seconds"] == 3.0

def test_ttc_stationary_or_opening():
    engine = TTCEngine()
    engine.calculate_ttc(500.0, current_timestamp=0.0)

    # Moving away: distance increased to 600cm
    res = engine.calculate_ttc(600.0, current_timestamp=1.0)
    assert res["status"] == "STABLE_OR_OPENING"
    assert res["ttc_seconds"] is None

def test_ttc_missing_distance():
    engine = TTCEngine()
    res = engine.calculate_ttc(None, current_timestamp=0.0)
    assert res["status"] == "UNAVAILABLE"
    assert res["ttc_seconds"] is None
