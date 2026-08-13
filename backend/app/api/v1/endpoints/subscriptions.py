from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.database import get_db
from app.db.models import Subscription, User, WalletBank, WalletCard, WalletMobile
from app.db.schemas import SubscriptionCreate, SubscriptionUpdate, SubscriptionOut
from app.api.deps import get_current_user
from app.services.notification_service import check_and_generate_renewal_notifications
from app.services.audit_service import log_audit_event

router = APIRouter()

def calculate_tenure_months(purchased_date_str: str) -> int:
    try:
        p_date = datetime.strptime(purchased_date_str[:10], "%Y-%m-%d")
        now = datetime.now()
        months = (now.year - p_date.year) * 12 + (now.month - p_date.month)
        return max(1, months)
    except Exception:
        return 1

def sync_subscription_status(sub: Subscription, db: Session):
    try:
        today = datetime.now().date()
        if sub.next_billing_date and sub.status == "Active":
            b_date = datetime.strptime(sub.next_billing_date[:10], "%Y-%m-%d").date()
            if b_date < today:
                sub.status = "Expired"
                db.commit()
                db.refresh(sub)
    except Exception:
        pass

@router.get("/", response_model=List[SubscriptionOut])
def list_subscriptions(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_and_generate_renewal_notifications(db, current_user.id)
    
    query = db.query(Subscription).filter(Subscription.user_id == current_user.id)
    if status_filter:
        query = query.filter(Subscription.status == status_filter)
    
    subs = query.all()
    results = []
    for s in subs:
        sync_subscription_status(s, db)
        s_out = SubscriptionOut.model_validate(s)
        s_out.tenure_months = calculate_tenure_months(s.purchased_date)
        if not getattr(s_out, 'account_type', None):
            s_out.account_type = getattr(s, 'account_type', 'Personal') or 'Personal'
        results.append(s_out)
    return results

@router.post("/", response_model=SubscriptionOut, status_code=status.HTTP_201_CREATED)
def create_subscription(
    sub_in: SubscriptionCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bank_id = None
    card_id = None
    mobile_id = None

    if sub_in.payment_type == "bank" and sub_in.bank_id:
        bank = db.query(WalletBank).filter(WalletBank.id == sub_in.bank_id, WalletBank.user_id == current_user.id).first()
        if not bank:
            raise HTTPException(status_code=400, detail="Selected bank account was not found in your wallet.")
        bank_id = bank.id
    elif sub_in.payment_type == "card" and sub_in.card_id:
        card = db.query(WalletCard).filter(WalletCard.id == sub_in.card_id, WalletCard.user_id == current_user.id).first()
        if not card:
            raise HTTPException(status_code=400, detail="Selected payment card was not found in your wallet.")
        card_id = card.id
    elif sub_in.payment_type in ["mfs", "mobile_banking"] and sub_in.mobile_id:
        mobile = db.query(WalletMobile).filter(WalletMobile.id == sub_in.mobile_id, WalletMobile.user_id == current_user.id).first()
        if not mobile:
            raise HTTPException(status_code=400, detail="Selected mobile banking account was not found in your wallet.")
        mobile_id = mobile.id

    initial_status = "Active"
    today = datetime.now().date()
    try:
        b_date = datetime.strptime(sub_in.next_billing_date[:10], "%Y-%m-%d").date()
        if b_date < today:
            initial_status = "Expired"
    except Exception:
        pass

    sub_kwargs = {
        "user_id": current_user.id,
        "name": sub_in.name,
        "category": sub_in.category,
        "associated_email": sub_in.associated_email,
        "associated_contact": sub_in.associated_contact,
        "plan_type": sub_in.plan_type,
        "cost": sub_in.cost,
        "billing_cycle": sub_in.billing_cycle,
        "purchased_date": sub_in.purchased_date,
        "next_billing_date": sub_in.next_billing_date,
        "auto_renewal": sub_in.auto_renewal,
        "status": initial_status,
        "payment_type": sub_in.payment_type,
        "bank_id": bank_id,
        "card_id": card_id,
        "mobile_id": mobile_id
    }

    if hasattr(Subscription, "account_type"):
        sub_kwargs["account_type"] = sub_in.account_type or "Personal"

    try:
        new_sub = Subscription(**sub_kwargs)
        db.add(new_sub)
        db.commit()
        db.refresh(new_sub)
        
        check_and_generate_renewal_notifications(db, current_user.id)

        log_audit_event(
            db=db,
            action="CREATE_SUBSCRIPTION",
            resource_type="SUBSCRIPTION",
            user_id=current_user.id,
            resource_id=str(new_sub.id),
            ip_address=request.client.host if request.client else "127.0.0.1",
            user_agent=request.headers.get("user-agent", "PayPulse App"),
            metadata={"service": new_sub.name, "cost": float(new_sub.cost)}
        )

        res = SubscriptionOut.model_validate(new_sub)
        res.tenure_months = calculate_tenure_months(new_sub.purchased_date)
        res.account_type = getattr(new_sub, 'account_type', sub_in.account_type) or "Personal"
        return res
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to save subscription: {str(e)}")

@router.put("/{sub_id}", response_model=SubscriptionOut)
def update_subscription(
    sub_id: int,
    sub_in: SubscriptionUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sub = db.query(Subscription).filter(Subscription.id == sub_id, Subscription.user_id == current_user.id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    update_data = sub_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(sub, field) and value is not None:
            setattr(sub, field, value)

    today = datetime.now().date()
    try:
        if sub.next_billing_date:
            b_date = datetime.strptime(sub.next_billing_date[:10], "%Y-%m-%d").date()
            if b_date < today and sub.status == "Active":
                sub.status = "Expired"
    except Exception:
        pass

    db.commit()
    db.refresh(sub)
    
    check_and_generate_renewal_notifications(db, current_user.id)

    log_audit_event(
        db=db,
        action="UPDATE_SUBSCRIPTION",
        resource_type="SUBSCRIPTION",
        user_id=current_user.id,
        resource_id=str(sub.id),
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent", "PayPulse App"),
        metadata={"service": sub.name, "status": sub.status}
    )

    res = SubscriptionOut.model_validate(sub)
    res.tenure_months = calculate_tenure_months(sub.purchased_date)
    return res

@router.get("/search", response_model=List[SubscriptionOut])
def search_subscriptions(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subs = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        (Subscription.name.ilike(f"%{q}%")) | 
        (Subscription.category.ilike(f"%{q}%")) | 
        (Subscription.associated_email.ilike(f"%{q}%"))
    ).all()
    
    results = []
    for s in subs:
        s_out = SubscriptionOut.model_validate(s)
        s_out.tenure_months = calculate_tenure_months(s.purchased_date)
        if not getattr(s_out, 'account_type', None):
            s_out.account_type = getattr(s, 'account_type', 'Personal') or 'Personal'
        results.append(s_out)
    return results

@router.delete("/{sub_id}")
def delete_subscription(
    sub_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sub = db.query(Subscription).filter(Subscription.id == sub_id, Subscription.user_id == current_user.id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    sub.status = "Idle"
    db.commit()

    log_audit_event(
        db=db,
        action="DELETE_SUBSCRIPTION",
        resource_type="SUBSCRIPTION",
        user_id=current_user.id,
        resource_id=str(sub.id),
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent", "PayPulse App"),
        metadata={"service": sub.name}
    )

    return {"message": "Subscription set to Idle successfully"}