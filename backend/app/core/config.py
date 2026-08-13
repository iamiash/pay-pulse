import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PayPulse"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "PAYPULSE_SUPER_SECRET_JWT_KEY_2026_PRODUCTION_32_BYTES_LONG="
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    FRONTEND_URL: str = "http://localhost:3000"
    
    # AES Fernet Key for encrypting sensitive data
    FERNET_KEY: str = "gAAAAABl-PayPulseEncryptionKeyGeneratedForProduction32B="
    
    # SMTP Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@paypulse.com"
    SMTP_FROM_NAME: str = "PayPulse Security"
    
    # Storage Path
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "static", "uploads")

    class Config:
        case_sensitive = True

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)