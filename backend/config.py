import os
from dotenv import load_dotenv

# Load from backend/.env or root .env
load_dotenv()

class Settings:
    COM_PORT: str = os.getenv("COM_PORT", "COM7")
    BAUD_RATE: int = int(os.getenv("BAUD_RATE", "115200"))
    SERIAL_TIMEOUT: float = float(os.getenv("SERIAL_TIMEOUT", "1.0"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/mlvs_db")
    FALLBACK_SQLITE_URL: str = "sqlite:///./telemetry.db"
    VEHICLE_ID: str = os.getenv("VEHICLE_ID", "V-01")
    SIMULATION_MODE: bool = os.getenv("SIMULATION_MODE", "false").lower() in ("true", "1", "yes")
    WS_HEARTBEAT_SEC: float = 1.0

    # Risk Engine Configuration & Thresholds (cm and seconds)
    CRITICAL_DISTANCE_CM: float = float(os.getenv("CRITICAL_DISTANCE_CM", "30.0"))
    WARNING_DISTANCE_CM: float = float(os.getenv("WARNING_DISTANCE_CM", "60.0"))
    BUFFER_DISTANCE_CM: float = float(os.getenv("BUFFER_DISTANCE_CM", "100.0"))

    CRITICAL_TTC_SEC: float = float(os.getenv("CRITICAL_TTC_SEC", "2.0"))
    WARNING_TTC_SEC: float = float(os.getenv("WARNING_TTC_SEC", "4.0"))

    # OLED Downlink config
    OLED_DOWNLINK_ENABLED: bool = os.getenv("OLED_DOWNLINK_ENABLED", "true").lower() in ("true", "1", "yes")
    OLED_UPDATE_INTERVAL_SEC: float = float(os.getenv("OLED_UPDATE_INTERVAL_SEC", "0.5"))

settings = Settings()
