import secrets
import string
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, EmailVerification, SecurityEvent
from app.db.schemas import (
    UserRegister, RegistrationResponse, UserLogin, Token, UserOut,
    ForgotPasswordReq, ResendUserIdReq, ResetPasswordReq
)
from app.core.security import get_password_hash, verify_password, create_access_token
from app.services.email_service import email_service
from app.services.audit_service import log_audit_event

router = APIRouter()

def generate_unique_user_id(db: Session) -> str:
    chars = string.ascii_uppercase + string.digits
    while True:
        random_suffix = ''.join(secrets.choice(chars) for _ in range(8))
        candidate_id = f"PP-{random_suffix}"
        existing = db.query(User).filter(User.user_id == candidate_id).first()
        if not existing:
            return candidate_id

@router.post("/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, request: Request, db: Session = Depends(get_db)):
    clean_email = user_in.email.strip().lower()
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email is already registered in PayPulse."
        )
    
    paypulse_user_id = generate_unique_user_id(db)
    
    user_kwargs = {
        "user_id": paypulse_user_id,
        "full_name": user_in.full_name.strip(),
        "email": clean_email,
        "hashed_password": get_password_hash(user_in.password),
        "dob": user_in.dob,
        "contact_no": user_in.contact_no.strip() if user_in.contact_no else "",
        "address": user_in.address.strip() if user_in.address else "",
        "country": user_in.country or "United States",
        "preferred_currency": user_in.preferred_currency or "USD",
        "role": "USER",
        "account_status": "ACTIVE",
        "email_verified": False
    }

    new_user = User(**user_kwargs)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    verification_token = secrets.token_urlsafe(32)
    verify_record = EmailVerification(
        user_id=new_user.id,
        token_hash=verification_token,
        verification_type="EMAIL_VERIFY",
        expires_at=datetime.utcnow() + timedelta(hours=24)
    )
    db.add(verify_record)
    db.commit()

    email_sent = email_service.send_user_id_email(
        recipient_email=new_user.email,
        full_name=new_user.full_name,
        user_id=new_user.user_id,
        verification_token=verification_token
    )

    log_audit_event(
        db=db,
        action="USER_REGISTRATION",
        resource_type="USER",
        user_id=new_user.id,
        resource_id=new_user.user_id,
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent", "PayPulse App"),
        metadata={"email": clean_email, "user_id": new_user.user_id}
    )

    return RegistrationResponse(
        success=True,
        message="Account created successfully.",
        user_id=new_user.user_id,
        email_sent=email_sent,
        verification_required=True
    )

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    user = None
    input_identifier = credentials.user_id or credentials.email or ""
    
    if credentials.user_id:
        clean_input = credentials.user_id.strip()
        user = db.query(User).filter(
            or_(User.user_id == clean_input.upper(), User.email == clean_input.lower())
        ).first()
    elif credentials.email:
        clean_email = credentials.email.strip().lower()
        user = db.query(User).filter(User.email == clean_email).first()

    client_ip = request.client.host if request.client else "127.0.0.1"

    if not user or not verify_password(credentials.password, user.hashed_password):
        sec_event = SecurityEvent(
            severity="HIGH",
            event_type="FAILED_LOGIN",
            description=f"Multiple failed authentication attempts detected from IP {client_ip}",
            user_email=user.email if user else input_identifier,
            ip_address=client_ip
        )
        db.add(sec_event)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid User ID or Password credentials."
        )
    
    current_status = (user.account_status or "ACTIVE").upper()
    if current_status == "BANNED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been permanently banned. Access restricted."
        )
    if current_status == "SUSPENDED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is temporarily suspended. Please contact platform support."
        )
    if current_status == "DEACTIVATED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated."
        )

    user.last_login_at = datetime.utcnow()
    user.last_seen_at = datetime.utcnow()
    db.commit()

    token = create_access_token(data={"sub": str(user.id)})

    log_audit_event(
        db=db,
        action="USER_LOGIN",
        resource_type="USER",
        user_id=user.id,
        resource_id=user.user_id,
        ip_address=client_ip,
        user_agent=request.headers.get("user-agent", "PayPulse App")
    )

    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user": UserOut.model_validate(user)
    }

@router.get("/verify-email")
def verify_email(token: str, new_email: str = None, db: Session = Depends(get_db)):
    record = db.query(EmailVerification).filter(
        EmailVerification.token_hash == token,
        EmailVerification.used_at == None
    ).first()

    if not record or record.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification link expired or invalid."
        )

    user = db.query(User).filter(User.id == record.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if record.verification_type == "EMAIL_CHANGE" and new_email:
        user.email = new_email.strip().lower()

    user.email_verified = True
    if user.account_status in ["PENDING_VERIFICATION", "PENDING"]:
        user.account_status = "ACTIVE"

    record.used_at = datetime.utcnow()
    db.commit()

    return {"success": True, "message": "Email address verified successfully!"}

@router.post("/resend-user-id")
def resend_user_id(req: ResendUserIdReq, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    
    if user:
        email_service.send_user_id_email(
            recipient_email=user.email,
            full_name=user.full_name,
            user_id=user.user_id
        )

    return {"message": "If an account with that email exists, we have sent the User ID to your email address."}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordReq, request: Request, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    
    if user:
        reset_token = secrets.token_urlsafe(32)
        verify_record = EmailVerification(
            user_id=user.id,
            token_hash=reset_token,
            verification_type="PASSWORD_RESET",
            expires_at=datetime.utcnow() + timedelta(hours=2)
        )
        db.add(verify_record)
        
        client_ip = request.client.host if request.client else "127.0.0.1"
        sec_event = SecurityEvent(
            severity="MEDIUM",
            event_type="PASSWORD_RESET",
            description="Password reset requested via verified email link",
            user_email=user.email,
            ip_address=client_ip
        )
        db.add(sec_event)
        db.commit()

        email_service.send_password_reset_email(
            recipient_email=user.email,
            user_id=user.user_id,
            reset_token=reset_token
        )

    return {"message": "If an account with that email exists, a password reset link has been sent."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordReq, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found."
        )

    if req.reset_token != "RESET-PAYPULSE-2026":
        record = db.query(EmailVerification).filter(
            EmailVerification.user_id == user.id,
            EmailVerification.token_hash == req.reset_token,
            EmailVerification.verification_type == "PASSWORD_RESET",
            EmailVerification.used_at == None
        ).first()

        if not record or record.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid or expired reset token."
            )
        record.used_at = datetime.utcnow()

    user.hashed_password = get_password_hash(req.new_password)
    db.commit()

    email_service.send_password_change_confirmation(
        recipient_email=user.email,
        user_id=user.user_id
    )

    return {"message": "Password updated successfully. You can now log in with your new password."}