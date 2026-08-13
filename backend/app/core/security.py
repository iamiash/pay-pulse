import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from cryptography.fernet import Fernet
import jwt
from app.core.config import settings

SECRET_KEY = getattr(settings, "JWT_SECRET_KEY", getattr(settings, "SECRET_KEY", "paypulse_secret_key_2026_super_secure_key"))
ALGORITHM = getattr(settings, "ALGORITHM", "HS256")
RAW_ENC_KEY = getattr(settings, "ENCRYPTION_KEY", None)

if not RAW_ENC_KEY or len(str(RAW_ENC_KEY)) < 32:
    RAW_ENC_KEY = Fernet.generate_key().decode()

try:
    fernet_cipher = Fernet(RAW_ENC_KEY.encode() if isinstance(RAW_ENC_KEY, str) else RAW_ENC_KEY)
except Exception:
    fernet_cipher = Fernet(Fernet.generate_key())


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def encrypt_sensitive_data(plain_text: str) -> str:
    if not plain_text:
        return ""
    return fernet_cipher.encrypt(plain_text.encode('utf-8')).decode('utf-8')


def decrypt_sensitive_data(cipher_text: str) -> str:
    if not cipher_text:
        return ""
    try:
        return fernet_cipher.decrypt(cipher_text.encode('utf-8')).decode('utf-8')
    except Exception:
        return cipher_text


# Backward compatibility aliases for init_db.py and wallet modules
encrypt_field = encrypt_sensitive_data
decrypt_field = decrypt_sensitive_data


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=43200))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)