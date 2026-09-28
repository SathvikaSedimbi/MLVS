import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.config import settings
from backend.models import Base

logger = logging.getLogger("MLVS.Database")

engine = None
SessionLocal = None
active_db_type = "UNKNOWN"

def init_db():
    global engine, SessionLocal, active_db_type
    
    # Attempt 1: Configured PostgreSQL DATABASE_URL
    try:
        logger.info(f"Attempting connection to primary PostgreSQL database...")
        pg_engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 3} if "postgresql" in settings.DATABASE_URL else {}
        )
        # Test connection
        with pg_engine.connect() as conn:
            pass
        Base.metadata.create_all(bind=pg_engine)
        engine = pg_engine
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        active_db_type = "POSTGRESQL"
        logger.info("Successfully connected to PostgreSQL database and verified tables.")
        return
    except Exception as e:
        logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to local SQLite database.")

    # Attempt 2: Fallback SQLite database
    try:
        sqlite_engine = create_engine(
            settings.FALLBACK_SQLITE_URL,
            connect_args={"check_same_thread": False}
        )
        Base.metadata.create_all(bind=sqlite_engine)
        engine = sqlite_engine
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        active_db_type = "SQLITE_FALLBACK"
        logger.info(f"Initialized fallback SQLite database at {settings.FALLBACK_SQLITE_URL}.")
    except Exception as e:
        logger.error(f"Failed to initialize fallback database: {e}")
        engine = None
        SessionLocal = None
        active_db_type = "OFFLINE"

def get_db():
    """Dependency helper for FastAPI endpoints."""
    if SessionLocal is None:
        return None
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
