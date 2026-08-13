from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.db.models import Notification, User
from app.db.schemas import NotificationOut
from app.api.deps import get_current_user
from app.services.notification_service import check_and_generate_renewal_notifications

router = APIRouter()

@router.get("/", response_model=List[NotificationOut])
def get_notifications(
    category: Optional[str] = Query(None, description="Category filter: Renewal, Payment, Account, Security, System"),
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    check_and_generate_renewal_notifications(db, current_user.id)
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    
    if category and category.lower() != 'all':
        query = query.filter(Notification.category == category)
        
    return query.order_by(Notification.created_at.desc()).all()

@router.patch("/{notif_id}/read")
def mark_read(notif_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notif = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == current_user.id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"message": "Notification marked as read"}

@router.patch("/read-all")
def mark_all_read(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}