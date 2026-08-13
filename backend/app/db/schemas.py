from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

# --- Auth & User ---
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=1, description="Full name is required")
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    contact_no: Optional[str] = ""
    address: Optional[str] = ""
    dob: str = Field(..., min_length=1, description="Date of birth is required")
    country: Optional[str] = "United States"
    preferred_currency: Optional[str] = "USD"

    @field_validator('email', mode='before')
    def normalize_email(cls, v: Any) -> str:
        if isinstance(v, str):
            return v.strip().lower()
        return v

    @field_validator('dob', mode='before')
    def validate_and_format_dob(cls, v: Any) -> str:
        if not v:
            raise ValueError("Date of Birth is required")
        v_str = str(v).strip()
        parsed_dt = None
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d"):
            try:
                parsed_dt = datetime.strptime(v_str, fmt)
                break
            except ValueError:
                pass
        
        if not parsed_dt:
            raise ValueError("Invalid Date of Birth format. Please use YYYY-MM-DD.")
        
        if parsed_dt > datetime.now():
            raise ValueError("Date of Birth cannot be in the future.")
            
        return parsed_dt.strftime("%Y-%m-%d")


class RegistrationResponse(BaseModel):
    success: bool = True
    message: str = "Account created successfully."
    user_id: str
    email_sent: bool = True
    verification_required: bool = True


class UserLogin(BaseModel):
    user_id: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str

    @field_validator('user_id', mode='before')
    def sanitize_user_id(cls, v: Any) -> Optional[str]:
        if isinstance(v, str) and v.strip():
            return v.strip().upper()
        return None

    @field_validator('email', mode='before')
    def normalize_email(cls, v: Any) -> Optional[str]:
        if isinstance(v, str) and v.strip():
            return v.strip().lower()
        return None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: str
    full_name: str
    email: EmailStr
    role: str = "USER"
    account_status: str = "ACTIVE"
    email_verified: bool = False
    contact_no: Optional[str] = ""
    address: Optional[str] = ""
    dob: str
    country: Optional[str] = "United States"
    preferred_currency: Optional[str] = "USD"
    avatar_url: Optional[str] = None
    last_login_at: Optional[datetime] = None
    last_seen_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class UserStatusUpdateReq(BaseModel):
    status: str = Field(..., description="SUSPEND, UNSUSPEND, BAN, UNBAN, FORCE_LOGOUT")


class ForgotPasswordReq(BaseModel):
    email: EmailStr


class ResendUserIdReq(BaseModel):
    email: EmailStr


class ResetPasswordReq(BaseModel):
    email: EmailStr
    reset_token: str
    new_password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    contact_no: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    preferred_currency: Optional[str] = None
    current_password: Optional[str] = None


class ChangeEmailReq(BaseModel):
    current_password: str
    new_email: EmailStr
    confirm_new_email: EmailStr


class VerifyCredentialsReq(BaseModel):
    email: Optional[EmailStr] = None
    user_id: Optional[str] = None
    password: str


class ChangePasswordReq(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


# --- Wallet Schemas ---
class WalletBankCreate(BaseModel):
    bank_name: str
    account_number: str
    branch_name: str
    routing_number: str


class WalletBankOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    bank_name: str
    masked_account_number: str
    branch_name: str
    routing_number: str


class WalletCardCreate(BaseModel):
    card_title: str
    card_type: str
    card_category: str
    card_number: str
    cvc: Optional[str] = ""
    expiry_date: str


class WalletCardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    card_title: str
    card_type: str
    card_category: str
    masked_card_number: str
    expiry_date: str


class WalletMobileCreate(BaseModel):
    provider: str
    mobile_number: str


class WalletMobileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    provider: str
    mobile_number: str


# --- Subscription Schemas ---
class SubscriptionCreate(BaseModel):
    name: str
    provider: Optional[str] = ""
    logo_url: Optional[str] = ""
    website: Optional[str] = ""
    category: str
    account_type: Optional[str] = "Personal"
    associated_email: str
    username: Optional[str] = ""
    associated_contact: str
    account_reference: Optional[str] = ""
    notes: Optional[str] = ""
    plan_type: str
    cost: float
    currency: Optional[str] = "USD"
    billing_cycle: str
    purchased_date: str
    next_billing_date: str
    trial_period: Optional[bool] = False
    auto_renewal: bool = True
    reminder_enabled: Optional[bool] = True
    reminder_days: Optional[int] = 3
    status: Optional[str] = "Active"
    payment_type: str
    bank_id: Optional[int] = None
    card_id: Optional[int] = None
    mobile_id: Optional[int] = None


class SubscriptionUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    category: Optional[str] = None
    account_type: Optional[str] = None
    associated_email: Optional[str] = None
    username: Optional[str] = None
    associated_contact: Optional[str] = None
    account_reference: Optional[str] = None
    notes: Optional[str] = None
    plan_type: Optional[str] = None
    cost: Optional[float] = None
    currency: Optional[str] = None
    billing_cycle: Optional[str] = None
    purchased_date: Optional[str] = None
    next_billing_date: Optional[str] = None
    trial_period: Optional[bool] = None
    auto_renewal: Optional[bool] = None
    reminder_enabled: Optional[bool] = None
    reminder_days: Optional[int] = None
    status: Optional[str] = None
    payment_type: Optional[str] = None
    bank_id: Optional[int] = None
    card_id: Optional[int] = None
    mobile_id: Optional[int] = None


class SubscriptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    provider: Optional[str] = ""
    logo_url: Optional[str] = ""
    website: Optional[str] = ""
    category: str
    account_type: Optional[str] = "Personal"
    associated_email: str
    username: Optional[str] = ""
    associated_contact: str
    account_reference: Optional[str] = ""
    notes: Optional[str] = ""
    plan_type: str
    cost: float
    currency: Optional[str] = "USD"
    billing_cycle: str
    purchased_date: str
    next_billing_date: str
    trial_period: Optional[bool] = False
    auto_renewal: bool
    reminder_enabled: Optional[bool] = True
    reminder_days: Optional[int] = 3
    status: str
    payment_type: str
    tenure_months: int = 1
    bank: Optional[WalletBankOut] = None
    card: Optional[WalletCardOut] = None
    mobile: Optional[WalletMobileOut] = None


class PdfReportFilter(BaseModel):
    report_type: str = "summary"
    date_range: Optional[str] = "This Month"
    subscription_id: Optional[int] = None
    category: Optional[str] = None
    status: Optional[str] = None
    payment_source: Optional[str] = None
    currency: Optional[str] = None
    selected_month: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    subscription_id: Optional[int] = None
    title: str
    message: str
    category: str = "Renewal"
    is_read: bool
    created_at: datetime


class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: Optional[int] = None
    actor_user_id: Optional[int] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    status: str
    metadata_json: Optional[str] = None
    created_at: datetime