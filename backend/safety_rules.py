"""
Configurable safety threshold rules and weight definitions for the MLVS Risk Engine.
"""

from typing import Dict, Any

DEFAULT_RISK_WEIGHTS: Dict[str, float] = {
    "distance": 0.35,      # Direct front/rear obstacle proximity
    "ttc": 0.25,           # Kinematic collision countdown
    "ir_obstacle": 0.15,   # Near-field blind-spot barrier
    "gas": 0.15,           # MQ toxic gas / smoke concentration
    "personnel": 0.05,     # PIR personnel presence in haul road
    "visibility": 0.05     # Optical fog / attenuation
}

# Distance thresholds in centimeters
DIST_CRITICAL_CM = 30.0   # < 30 cm triggers immediate critical hazard
DIST_WARNING_CM = 60.0    # < 60 cm triggers caution warning
DIST_BUFFER_CM = 100.0    # < 100 cm triggers advisory buffer

# TTC thresholds in seconds
TTC_CRITICAL_SEC = 2.0
TTC_WARNING_SEC = 4.0

# Visibility thresholds (%)
VISIBILITY_CRITICAL_PCT = 25.0
VISIBILITY_WARNING_PCT = 55.0
