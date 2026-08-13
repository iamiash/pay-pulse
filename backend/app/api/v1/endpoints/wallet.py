from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.database import get_db
from app.db.models import WalletBank, WalletCard, WalletMobile, User
from app.db.schemas import (
    WalletBankCreate, WalletBankOut,
    WalletCardCreate, WalletCardOut,
    WalletMobileCreate, WalletMobileOut
)
from app.api.deps import get_current_user
from app.core import security
from app.services.audit_service import log_audit_event

encrypt_fn = getattr(security, "encrypt_sensitive_data", getattr(security, "encrypt_field", lambda x: f"ENC_{x}"))

router = APIRouter()

# --- Banks ---
@router.get("/banks", response_model=List[WalletBankOut])
def get_banks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    banks = db.query(WalletBank).filter(WalletBank.user_id == current_user.id).all()
    return [WalletBankOut.model_validate(b) for b in banks]

@router.post("/banks", response_model=WalletBankOut, status_code=status.HTTP_201_CREATED)
def add_bank(bank_in: WalletBankCreate, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    masked = f"•••• •••• {bank_in.account_number[-4:] if len(bank_in.account_number) >= 4 else bank_in.account_number}"
    bank = WalletBank(
        user_id=current_user.id,
        bank_name=bank_in.bank_name,
        encrypted_account_number=encrypt_fn(bank_in.account_number),
        masked_account_number=masked,
        branch_name=bank_in.branch_name,
        routing_number=bank_in.routing_number
    )
    db.add(bank)
    db.commit()
    db.refresh(bank)

    log_audit_event(
        db=db,
        action="ADD_BANK_ACCOUNT",
        resource_type="WALLET",
        user_id=current_user.id,
        resource_id=str(bank.id),
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent", "PayPulse App"),
        metadata={"bank_name": bank.bank_name, "masked": masked}
    )

    return WalletBankOut.model_validate(bank)

@router.put("/banks/{bank_id}", response_model=WalletBankOut)
def update_bank(bank_id: int, payload: Dict[str, Any], db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bank = db.query(WalletBank).filter(WalletBank.id == bank_id, WalletBank.user_id == current_user.id).first()
    if not bank:
        raise HTTPException(status_code=404, detail="Bank account not found")
    
    if "bank_name" in payload:
        bank.bank_name = payload["bank_name"]
    if "branch_name" in payload:
        bank.branch_name = payload["branch_name"]
    if "routing_number" in payload:
        bank.routing_number = payload["routing_number"]
    
    db.commit()
    db.refresh(bank)
    return WalletBankOut.model_validate(bank)

@router.delete("/banks/{bank_id}")
def delete_bank(bank_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bank = db.query(WalletBank).filter(WalletBank.id == bank_id, WalletBank.user_id == current_user.id).first()
    if not bank:
        raise HTTPException(status_code=404, detail="Bank account not found")
    db.delete(bank)
    db.commit()
    return {"message": "Bank account deleted successfully"}

# --- Cards ---
@router.get("/cards", response_model=List[WalletCardOut])
def get_cards(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cards = db.query(WalletCard).filter(WalletCard.user_id == current_user.id).all()
    return [WalletCardOut.model_validate(c) for c in cards]

@router.post("/cards", response_model=WalletCardOut, status_code=status.HTTP_201_CREATED)
def add_card(card_in: WalletCardCreate, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    masked = f"•••• •••• •••• {card_in.card_number[-4:] if len(card_in.card_number) >= 4 else card_in.card_number}"
    card = WalletCard(
        user_id=current_user.id,
        card_title=card_in.card_title,
        card_type=card_in.card_type,
        card_category=card_in.card_category,
        encrypted_card_number=encrypt_fn(card_in.card_number),
        masked_card_number=masked,
        encrypted_cvc=encrypt_fn(card_in.cvc),
        expiry_date=card_in.expiry_date
    )
    db.add(card)
    db.commit()
    db.refresh(card)

    log_audit_event(
        db=db,
        action="ADD_PAYMENT_CARD",
        resource_type="WALLET",
        user_id=current_user.id,
        resource_id=str(card.id),
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent", "PayPulse App"),
        metadata={"card_title": card.card_title, "masked": masked, "type": card.card_type}
    )

    return WalletCardOut.model_validate(card)

@router.put("/cards/{card_id}", response_model=WalletCardOut)
def update_card(card_id: int, payload: Dict[str, Any], db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card = db.query(WalletCard).filter(WalletCard.id == card_id, WalletCard.user_id == current_user.id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Payment card not found")
    
    if "card_title" in payload:
        card.card_title = payload["card_title"]
    if "expiry_date" in payload:
        card.expiry_date = payload["expiry_date"]
    
    db.commit()
    db.refresh(card)
    return WalletCardOut.model_validate(card)

@router.delete("/cards/{card_id}")
def delete_card(card_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card = db.query(WalletCard).filter(WalletCard.id == card_id, WalletCard.user_id == current_user.id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Payment card not found")
    db.delete(card)
    db.commit()
    return {"message": "Payment card deleted successfully"}

# --- Mobile Banking ---
@router.get("/mobile", response_model=List[WalletMobileOut])
def get_mobile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    mobiles = db.query(WalletMobile).filter(WalletMobile.user_id == current_user.id).all()
    return [WalletMobileOut.model_validate(m) for m in mobiles]

@router.post("/mobile", response_model=WalletMobileOut, status_code=status.HTTP_201_CREATED)
def add_mobile(mobile_in: WalletMobileCreate, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    mobile = WalletMobile(
        user_id=current_user.id,
        provider=mobile_in.provider,
        mobile_number=mobile_in.mobile_number
    )
    db.add(mobile)
    db.commit()
    db.refresh(mobile)

    log_audit_event(
        db=db,
        action="ADD_MOBILE_WALLET",
        resource_type="WALLET",
        user_id=current_user.id,
        resource_id=str(mobile.id),
        ip_address=request.client.host if request.client else "127.0.0.1",
        user_agent=request.headers.get("user-agent", "PayPulse App"),
        metadata={"provider": mobile.provider, "number": mobile.mobile_number}
    )

    return WalletMobileOut.model_validate(mobile)

@router.put("/mobile/{mobile_id}", response_model=WalletMobileOut)
def update_mobile(mobile_id: int, payload: Dict[str, Any], db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    mobile = db.query(WalletMobile).filter(WalletMobile.id == mobile_id, WalletMobile.user_id == current_user.id).first()
    if not mobile:
        raise HTTPException(status_code=404, detail="Mobile account not found")
    
    if "mobile_number" in payload:
        mobile.mobile_number = payload["mobile_number"]
    if "provider" in payload:
        mobile.provider = payload["provider"]
    
    db.commit()
    db.refresh(mobile)
    return WalletMobileOut.model_validate(mobile)

@router.delete("/mobile/{mobile_id}")
def delete_mobile(mobile_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    mobile = db.query(WalletMobile).filter(WalletMobile.id == mobile_id, WalletMobile.user_id == current_user.id).first()
    if not mobile:
        raise HTTPException(status_code=404, detail="Mobile account not found")
    db.delete(mobile)
    db.commit()
    return {"message": "Mobile account deleted successfully"}