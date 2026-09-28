import datetime
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, JSON, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class TelemetryLog(Base):
    """
    Persists full telemetry frames ingested from STM32 or simulation.
    """
    __tablename__ = "telemetry_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    vehicle_id = Column(String(50), default="V-01", index=True)
    
    # Processed Metrics
    front_distance_cm = Column(Float, nullable=True)
    rear_distance_cm = Column(Float, nullable=True)
    closing_speed_kmh = Column(Float, nullable=True)
    ttc_seconds = Column(Float, nullable=True)
    
    # Risk Engine Outcomes
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    recommended_action = Column(String(50), nullable=False)
    safe_path = Column(String(50), nullable=False)
    
    # Environmental & Sensors
    visibility_index = Column(Float, nullable=False)
    gas_hazard = Column(Boolean, default=False)
    personnel_detected = Column(Boolean, default=False)
    ir_obstacle = Column(Boolean, default=False)
    temperature_c = Column(Float, nullable=True)
    humidity_pct = Column(Float, nullable=True)
    vehicle_speed_kmh = Column(Float, default=0.0)
    
    # Payloads & State
    sensor_health = Column(JSON, nullable=True)
    raw_payload = Column(JSON, nullable=True)
    is_simulated = Column(Boolean, default=False)

class AlertLog(Base):
    """
    Persists dynamic security and collision alerts.
    """
    __tablename__ = "alert_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    vehicle_id = Column(String(50), default="V-01")
    alert_code = Column(String(100), nullable=False)
    risk_level = Column(String(20), nullable=False)
    details = Column(Text, nullable=True)

class SafetyCommandLog(Base):
    """
    Persists operator override commands dispatched from Control Room.
    """
    __tablename__ = "safety_command_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    vehicle_id = Column(String(50), default="V-01")
    command = Column(String(50), nullable=False)
    issued_by = Column(String(50), default="OPERATOR")
    acknowledged = Column(Boolean, default=False)
