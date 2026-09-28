-- ============================================================
-- MLVS (Mine Low-Visibility Support System)
-- PostgreSQL Telemetry & Audit Schema
-- ============================================================

-- Create Database (Run independently if not exists)
-- CREATE DATABASE mlvs_db;

-- 1. Telemetry Logs Table
CREATE TABLE IF NOT EXISTS telemetry_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    vehicle_id VARCHAR(50) NOT NULL DEFAULT 'V-01',
    
    -- Kinematic & Distance Telemetry
    front_distance_cm DOUBLE PRECISION,
    rear_distance_cm DOUBLE PRECISION,
    closing_speed_kmh DOUBLE PRECISION,
    ttc_seconds DOUBLE PRECISION,
    vehicle_speed_kmh DOUBLE PRECISION DEFAULT 0.0,
    
    -- Risk Engine Outcome
    risk_score DOUBLE PRECISION NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    recommended_action VARCHAR(50) NOT NULL,
    safe_path VARCHAR(50) NOT NULL,
    
    -- Environmental & Safety Sensors
    visibility_index DOUBLE PRECISION NOT NULL,
    gas_hazard BOOLEAN DEFAULT FALSE,
    personnel_detected BOOLEAN DEFAULT FALSE,
    ir_obstacle BOOLEAN DEFAULT FALSE,
    temperature_c DOUBLE PRECISION,
    humidity_pct DOUBLE PRECISION,
    
    -- Health & Metadata
    sensor_health JSONB,
    raw_payload JSONB,
    is_simulated BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle ON telemetry_logs (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_risk_level ON telemetry_logs (risk_level);

-- 2. Alert Logs Table
CREATE TABLE IF NOT EXISTS alert_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    vehicle_id VARCHAR(50) NOT NULL DEFAULT 'V-01',
    alert_code VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    details TEXT
);

CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alert_logs (timestamp DESC);

-- 3. Safety Command Dispatch Logs
CREATE TABLE IF NOT EXISTS safety_command_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    vehicle_id VARCHAR(50) NOT NULL DEFAULT 'V-01',
    command VARCHAR(50) NOT NULL,
    issued_by VARCHAR(50) DEFAULT 'OPERATOR',
    acknowledged BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_commands_timestamp ON safety_command_logs (timestamp DESC);
