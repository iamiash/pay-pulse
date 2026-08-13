from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)  # Immutable public ID (e.g. PP-7K4M9X2Q)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    contact_no = Column(String, nullable=True, default="")
    address = Column(String, nullable=True, default="")
    dob = Column(String, nullable=False)  # YYYY-MM-DD
    country = Column(String, nullable=True, default="United States")
    preferred_currency = Column(String, nullable=True, default="USD")
    avatar_url = Column(String, nullable=True)
    role = Column(String, nullable=False, default="USER")  # USER, ADMIN, SUPER_ADMIN
    account_status = Column(String, nullable=False, default="ACTIVE")  # ACTIVE, SUSPENDED, BANNED, PENDING_VERIFICATION, DEACTIVATED
    email_verified = Column(Boolean, nullable=False, default=False)
    last_login_at = Column(DateTime, nullable=True)
    last_seen_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    banks = relationship("WalletBank", back_populates="user", cascade="all, delete-orphan")
    cards = relationship("WalletCard", back_populates="user", cascade="all, delete-orphan")
    mobile_accounts = relationship("WalletMobile", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    verifications = relationship("EmailVerification", back_populates="user", cascade="all, delete-orphan")


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String, nullable=False, default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    event_type = Column(String, nullable=False, index=True)   # FAILED_LOGIN, PASSWORD_RESET, EMAIL_CHANGE, SUSPICIOUS_ACTIVITY, ACCOUNT_LOCKED
    description = Column(Text, nullable=False)
    user_email = Column(String, nullable=True, index=True)
    ip_address = Column(String, nullable=True, default="127.0.0.1")
    resolved = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String, nullable=False, index=True)
    verification_type = Column(String, default="EMAIL_VERIFY")  # EMAIL_VERIFY, PASSWORD_RESET, EMAIL_CHANGE
    new_email = Column(String, nullable=True)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="verifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    actor_user_id = Column(Integer, nullable=True)
    action = Column(String, nullable=False, index=True)
    resource_type = Column(String, nullable=False)
    resource_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True, default="127.0.0.1")
    user_agent = Column(String, nullable=True, default="PayPulse Web Client")
    status = Column(String, default="SUCCESS")
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id])


class WalletBank(Base):
    __tablename__ = "wallet_banks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bank_name = Column(String, nullable=False)
    encrypted_account_number = Column(String, nullable=False)
    masked_account_number = Column(String, nullable=False)
    branch_name = Column(String, nullable=False)
    routing_number = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="banks")


class WalletCard(Base):
    __tablename__ = "wallet_cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    card_title = Column(String, nullable=False)
    card_type = Column(String, nullable=False)  # Visa, Mastercard, Amex, Nexus
    card_category = Column(String, nullable=False)  # Credit, Debit
    encrypted_card_number = Column(String, nullable=False)
    masked_card_number = Column(String, nullable=False)
    encrypted_cvc = Column(String, nullable=True, default="")
    expiry_date = Column(String, nullable=False)  # MM/YY
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cards")


class WalletMobile(Base):
    __tablename__ = "wallet_mobile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider = Column(String, nullable=False)  # bkash, nagad, rocket
    mobile_number = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mobile_accounts")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False)  # Entertainment, SaaS, Utilities, Cloud, Streaming
    account_type = Column(String, default="Personal", nullable=True)
    associated_email = Column(String, nullable=False)
    associated_contact = Column(String, nullable=False)
    plan_type = Column(String, nullable=False)  # Monthly, Yearly, Quarterly
    cost = Column(Float, nullable=False)
    billing_cycle = Column(String, nullable=False)  # Monthly, Yearly
    purchased_date = Column(String, nullable=False)  # YYYY-MM-DD
    next_billing_date = Column(String, nullable=False)  # YYYY-MM-DD
    auto_renewal = Column(Boolean, default=True)
    status = Column(String, default="Active")  # Active, Expired, Idle
    
    payment_type = Column(String, nullable=False)  # bank, card, mobile_banking
    bank_id = Column(Integer, ForeignKey("wallet_banks.id"), nullable=True)
    card_id = Column(Integer, ForeignKey("wallet_cards.id"), nullable=True)
    mobile_id = Column(Integer, ForeignKey("wallet_mobile.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="subscriptions")
    bank = relationship("WalletBank")
    card = relationship("WalletCard")
    mobile = relationship("WalletMobile")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")