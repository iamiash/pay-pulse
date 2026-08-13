import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, 'paypulse.db')
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def run_auto_migrations():
    """Automatic column schema migration for SQLite paypulse.db"""
    try:
        inspector = inspect(engine)
        if "subscriptions" in inspector.get_table_names():
            columns = [c["name"] for c in inspector.get_columns("subscriptions")]
            if "account_type" not in columns:
                with engine.connect() as conn:
                    conn.execute(text("ALTER TABLE subscriptions ADD COLUMN account_type VARCHAR DEFAULT 'Personal'"))
                    conn.commit()
    except Exception as e:
        print(f"Auto-migration error: {e}")

run_auto_migrations()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()