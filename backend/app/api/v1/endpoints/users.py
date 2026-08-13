import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.schemas import UserOut, UserUpdate, VerifyCredentialsReq, ChangePasswordReq
from app.db.models import User, Subscription, WalletBank, WalletCard, WalletMobile, Notification, SecurityEvent
from app.api.deps import get_current_user
from app.core.config import settings
from app.core.security import verify_password, get_password_hash
from app.services.audit_service import log_audit_event

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserOut)
@router.put("/me", response_model=UserOut)
def update_profile(
    user_in: UserUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
        
    if user_in.email is not None and user_in.email.lower() != current_user.email.lower():
        if not user_in.current_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Current password is required to update email address."
            )
        if not verify_password(user_in.current_password, current_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Current password verification failed."
            )
            
        existing = db.query(User).filter(User.email == user_in.email, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email is already in use by another account.")
            
        old_email = current_user.email
        current_user.email = user_in.email
        current_user.email_verified = False
        
        client_ip = request.client.host if request.client else "127.0.0.1"
        sec_event = SecurityEvent(
            severity="MEDIUM",
            event_type="EMAIL_CHANGE",
            description=f"User email updated from {old_email} to {user_in.email}",
            user_email=user_in.email,
            ip_address=client_ip
        )
        db.add(sec_event)

        notif = Notification(
            user_id=current_user.id,
            title="Account Email Updated",
            message=f"Your account email was successfully updated to {user_in.email}. Please verify your new address.",
            category="Account"
        )
        db.add(notif)

    if user_in.contact_no is not None:
        current_user.contact_no = user_in.contact_no
    if user_in.address is not None:
        current_user.address = user_in.address

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/avatar", response_model=UserOut)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"user_{current_user.id}_{int(os.times().system)}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.avatar_url = f"/static/uploads/{filename}"
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me/avatar", response_model=UserOut)
def delete_avatar(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.avatar_url = None
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/verify-credentials")
def verify_credentials(
    req: VerifyCredentialsReq,
    current_user: User = Depends(get_current_user)
):
    if req.email:
        clean_email = req.email.strip().lower()
        if current_user.email.lower() != clean_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Check your email and password then try again")
    
    if not verify_password(req.password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Check your email and password then try again")

    return {"valid": True, "message": "Credentials verified"}

@router.post("/me/change-password")
def change_password(
    req: ChangePasswordReq,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password does not match system records.")
    
    current_user.hashed_password = get_password_hash(req.new_password)
    
    log_audit_event(
        db=db,
        action="PASSWORD_CHANGED",
        resource_type="USER",
        resource_id=str(current_user.id),
        user_id=current_user.id,
        actor_user_id=current_user.id,
        request=request,
        status="SUCCESS",
        metadata={"email": current_user.email}
    )
    
    notif = Notification(
        user_id=current_user.id,
        title="Security Alert: Password Changed",
        message="Your account password was successfully changed. If this wasn't you, contact support immediately.",
        category="Security"
    )
    db.add(notif)
    
    db.commit()
    db.refresh(current_user)
    return {"message": "Password changed successfully"}

@router.delete("/me")
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id

    db.query(Subscription).filter(Subscription.user_id == user_id).delete()
    db.query(WalletBank).filter(WalletBank.user_id == user_id).delete()
    db.query(WalletCard).filter(WalletCard.user_id == user_id).delete()
    db.query(WalletMobile).filter(WalletMobile.user_id == user_id).delete()
    db.query(Notification).filter(Notification.user_id == user_id).delete()

    db.delete(current_user)
    db.commit()

    return {"message": "Account successfully deleted"}