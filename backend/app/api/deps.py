from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.database import get_db
from app.db.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    secret_key = getattr(settings, "JWT_SECRET_KEY", getattr(settings, "SECRET_KEY", "paypulse_secret_key_2026"))
    algorithm = getattr(settings, "ALGORITHM", "HS256")

    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        user_id: str = str(payload.get("sub"))
        if not user_id or user_id == "None":
            raise credentials_exception
    except Exception:
        raise credentials_exception

    try:
        user = db.query(User).filter(User.id == int(user_id)).first()
    except ValueError:
        raise credentials_exception

    if user is None:
        raise credentials_exception

    # Account Status Security Guards
    if user.account_status == "BANNED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been banned."
        )
    if user.account_status == "SUSPENDED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is temporarily suspended."
        )
    if user.account_status == "DEACTIVATED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated."
        )

    # Update last active timestamp
    user.last_seen_at = datetime.utcnow()
    db.commit()

    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ["ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required."
        )
    return current_user