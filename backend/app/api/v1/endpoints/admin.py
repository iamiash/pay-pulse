from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

from app.db.database import get_db
from app.api.deps import require_admin
from app.db.models import (
    User,
    Subscription,
    SecurityEvent,
    AuditLog,
    WalletBank,
    WalletCard,
    WalletMobile,
)
from app.db.schemas import UserStatusUpdateReq


router = APIRouter()


def mask_email(email: str) -> str:
    if not email or "@" not in email:
        return email or "N/A"

    parts = email.split("@")
    name = parts[0]
    domain = parts[1]

    if len(name) <= 1:
        masked_name = name
    elif len(name) == 2:
        masked_name = name[0] + "*"
    else:
        masked_name = (
            name[0]
            + "***"
            + name[-1]
        )

    return f"{masked_name}@{domain}"


def mask_contact(contact: str) -> str:
    if not contact or len(contact) < 5:
        return contact or "N/A"

    return (
        contact[:3]
        + "****"
        + contact[-4:]
    )


def safe_datetime(value: Optional[datetime]) -> str:
    if value:
        return value.isoformat()

    return "N/A"


# ============================================================
# ADMIN DASHBOARD METRICS
# ============================================================

@router.get("/dashboard/metrics")
def get_admin_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> Dict[str, Any]:

    total_users = db.query(User).count()

    active_users = db.query(User).filter(
        or_(
            func.upper(User.account_status) == "ACTIVE",
            User.account_status == None
        )
    ).count()

    inactive_users = db.query(User).filter(
        func.upper(User.account_status) == "INACTIVE"
    ).count()

    suspended_users = db.query(User).filter(
        func.upper(User.account_status) == "SUSPENDED"
    ).count()

    banned_users = db.query(User).filter(
        func.upper(User.account_status) == "BANNED"
    ).count()

    seven_days_ago = (
        datetime.utcnow()
        - timedelta(days=7)
    )

    new_users = db.query(User).filter(
        or_(
            User.created_at >= seven_days_ago,
            func.upper(User.account_status)
            == "PENDING_VERIFICATION",
            func.upper(User.account_status)
            == "PENDING"
        )
    ).count()

    active_subscriptions = db.query(
        Subscription
    ).filter(
        func.upper(
            Subscription.status
        ) == "ACTIVE"
    ).count()

    security_alerts = db.query(
        SecurityEvent
    ).filter(
        or_(
            SecurityEvent.severity == "HIGH",
            SecurityEvent.severity == "CRITICAL"
        )
    ).count()

    failed_logins = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "FAILED_LOGIN"
    ).count()

    password_resets = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "PASSWORD_RESET"
    ).count()

    email_changes = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "EMAIL_CHANGE"
    ).count()

    suspicious_activity = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "SUSPICIOUS_ACTIVITY"
    ).count()

    locked_accounts = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "ACCOUNT_LOCKED"
    ).count()

    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "suspended_users": suspended_users,
        "banned_users": banned_users,
        "new_users": new_users,
        "active_subscriptions": active_subscriptions,
        "security_alerts": security_alerts,
        "failed_logins": failed_logins,
        "password_resets": password_resets,
        "email_changes": email_changes,
        "suspicious_activity": suspicious_activity,
        "locked_accounts": locked_accounts,
    }


# ============================================================
# SECURITY METRICS
# ============================================================

@router.get("/security/metrics")
def get_security_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> Dict[str, Any]:

    failed_logins = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "FAILED_LOGIN"
    ).count()

    password_resets = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "PASSWORD_RESET"
    ).count()

    email_changes = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "EMAIL_CHANGE"
    ).count()

    suspicious_activity = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "SUSPICIOUS_ACTIVITY"
    ).count()

    locked_accounts = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.event_type
        == "ACCOUNT_LOCKED"
    ).count()

    recent_events = db.query(
        SecurityEvent
    ).count()

    return {
        "failed_logins": failed_logins,
        "password_resets": password_resets,
        "email_changes": email_changes,
        "suspicious_activity": suspicious_activity,
        "locked_accounts": locked_accounts,
        "recent_events": recent_events,
    }


# ============================================================
# ADMIN DASHBOARD CHARTS
# REAL DATABASE DATA ONLY
# ============================================================

@router.get("/dashboard/charts")
def get_admin_dashboard_charts(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> Dict[str, Any]:

    now = datetime.utcnow()

    today_start = datetime(
        now.year,
        now.month,
        now.day
    )

    # --------------------------------------------------------
    # Helper
    # --------------------------------------------------------

    def users_created_between(
        start_dt: datetime,
        end_dt: datetime
    ) -> int:

        return db.query(User).filter(
            User.created_at >= start_dt,
            User.created_at < end_dt
        ).count()

    # --------------------------------------------------------
    # DAILY USER REGISTRATION
    # --------------------------------------------------------

    daily = []

    for offset in range(6, -1, -1):

        day_start = (
            today_start
            - timedelta(days=offset)
        )

        day_end = (
            day_start
            + timedelta(days=1)
        )

        daily.append({
            "label": day_start.strftime("%a"),
            "value": users_created_between(
                day_start,
                day_end
            ),
        })

    # --------------------------------------------------------
    # WEEKLY USER REGISTRATION
    # --------------------------------------------------------

    current_week_start = (
        today_start
        - timedelta(
            days=today_start.weekday()
        )
    )

    weekly = []

    for offset in range(3, -1, -1):

        week_start = (
            current_week_start
            - timedelta(weeks=offset)
        )

        week_end = (
            week_start
            + timedelta(weeks=1)
        )

        weekly.append({
            "label": week_start.strftime(
                "%d %b"
            ),
            "value": users_created_between(
                week_start,
                week_end
            ),
        })

    # --------------------------------------------------------
    # MONTHLY USER REGISTRATION
    # --------------------------------------------------------

    current_month_start = datetime(
        now.year,
        now.month,
        1
    )

    monthly = []

    for offset in range(5, -1, -1):

        month_number = (
            current_month_start.month
            - offset
        )

        year = current_month_start.year

        while month_number <= 0:
            month_number += 12
            year -= 1

        month_start = datetime(
            year,
            month_number,
            1
        )

        if month_number == 12:
            month_end = datetime(
                year + 1,
                1,
                1
            )
        else:
            month_end = datetime(
                year,
                month_number + 1,
                1
            )

        monthly.append({
            "label": month_start.strftime(
                "%b"
            ),
            "value": users_created_between(
                month_start,
                month_end
            ),
        })

    # --------------------------------------------------------
    # REAL USER ACTIVITY
    # --------------------------------------------------------

    dau_cutoff = (
        now
        - timedelta(days=1)
    )

    wau_cutoff = (
        now
        - timedelta(days=7)
    )

    mau_cutoff = (
        now
        - timedelta(days=30)
    )

    dau = db.query(User).filter(
        User.last_seen_at >= dau_cutoff
    ).count()

    wau = db.query(User).filter(
        User.last_seen_at >= wau_cutoff
    ).count()

    mau = db.query(User).filter(
        User.last_seen_at >= mau_cutoff
    ).count()

    # --------------------------------------------------------
    # ACTIVITY HISTORY
    # --------------------------------------------------------

    history = []

    for offset in range(4, -1, -1):

        period_end = (
            now
            - timedelta(days=offset)
        )

        period_start = (
            period_end
            - timedelta(days=1)
        )

        day_dau = db.query(User).filter(
            User.last_seen_at >= period_start,
            User.last_seen_at < period_end
        ).count()

        history.append({
            "period": period_end.strftime(
                "%a"
            ),
            "dau": day_dau,
            "wau": wau,
            "mau": mau,
        })

    # --------------------------------------------------------
    # ACCOUNT STATUS DISTRIBUTION
    # --------------------------------------------------------

    active_count = db.query(User).filter(
        or_(
            func.upper(
                User.account_status
            ) == "ACTIVE",
            User.account_status == None
        )
    ).count()

    suspended_count = db.query(
        User
    ).filter(
        func.upper(
            User.account_status
        ) == "SUSPENDED"
    ).count()

    banned_count = db.query(
        User
    ).filter(
        func.upper(
            User.account_status
        ) == "BANNED"
    ).count()

    pending_count = db.query(
        User
    ).filter(
        or_(
            func.upper(
                User.account_status
            ) == "PENDING",

            func.upper(
                User.account_status
            ) == "PENDING_VERIFICATION",

            func.upper(
                User.account_status
            ) == "INACTIVE"
        )
    ).count()

    account_status_distribution = [
        {
            "status": "Active",
            "count": active_count,
            "color": "#10B981",
        },
        {
            "status": "Suspended",
            "count": suspended_count,
            "color": "#F59E0B",
        },
        {
            "status": "Banned",
            "count": banned_count,
            "color": "#EF4444",
        },
        {
            "status": "Pending / Inactive",
            "count": pending_count,
            "color": "#6366F1",
        },
    ]

    # --------------------------------------------------------
    # REAL SUBSCRIPTION GROWTH
    # --------------------------------------------------------

    subscription_growth = []

    for offset in range(5, -1, -1):

        month_number = (
            current_month_start.month
            - offset
        )

        year = current_month_start.year

        while month_number <= 0:
            month_number += 12
            year -= 1

        month_start = datetime(
            year,
            month_number,
            1
        )

        if month_number == 12:
            month_end = datetime(
                year + 1,
                1,
                1
            )
        else:
            month_end = datetime(
                year,
                month_number + 1,
                1
            )

        rows = db.query(
            Subscription
        ).filter(
            Subscription.created_at >= month_start,
            Subscription.created_at < month_end,
            func.upper(
                Subscription.status
            ) == "ACTIVE"
        ).all()

        subscription_growth.append({
            "period": month_start.strftime(
                "%b"
            ),
            "subscriptions": len(rows),
            "revenue": round(
                sum(
                    float(row.cost or 0)
                    for row in rows
                ),
                2
            ),
        })

    return {
        "user_growth": {
            "daily": daily,
            "weekly": weekly,
            "monthly": monthly,
        },

        "active_users_trend": {
            "dau": dau,
            "wau": wau,
            "mau": mau,
            "history": history,
        },

        "account_status_distribution":
            account_status_distribution,

        "subscription_growth":
            subscription_growth,
    }


# ============================================================
# ADMIN USER DIRECTORY
# ============================================================

@router.get("/users")
def get_admin_users(
    search: Optional[str] = Query(
        None,
        description=(
            "Search term for User ID, "
            "Email, Name, Contact"
        )
    ),
    status: Optional[str] = Query(
        None,
        description="Filter status"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> List[Dict[str, Any]]:

    query = db.query(User)

    if search and search.strip():

        search_term = (
            f"%{search.strip()}%"
        )

        query = query.filter(
            or_(
                User.user_id.ilike(
                    search_term
                ),
                User.full_name.ilike(
                    search_term
                ),
                User.email.ilike(
                    search_term
                ),
                User.contact_no.ilike(
                    search_term
                ),
            )
        )

    if (
        status
        and status.strip().upper()
        not in ["ALL", "ALL ACCOUNTS"]
    ):

        st = status.strip().upper()

        if st == "VERIFIED":

            query = query.filter(
                User.email_verified == True
            )

        elif st == "UNVERIFIED":

            query = query.filter(
                User.email_verified == False
            )

        elif st in [
            "ACTIVE",
            "INACTIVE",
            "SUSPENDED",
            "BANNED",
            "PENDING",
            "PENDING_VERIFICATION",
            "NEW / PENDING",
        ]:

            if st in [
                "PENDING",
                "NEW / PENDING",
            ]:

                query = query.filter(
                    or_(
                        func.upper(
                            User.account_status
                        ) == "PENDING",

                        func.upper(
                            User.account_status
                        ) == "PENDING_VERIFICATION"
                    )
                )

            else:

                query = query.filter(
                    func.upper(
                        User.account_status
                    ) == st
                )

    users = query.order_by(
        User.created_at.desc()
    ).all()

    results = []

    for u in users:

        sub_count = db.query(
            Subscription
        ).filter(
            Subscription.user_id == u.id,
            func.upper(
                Subscription.status
            ) == "ACTIVE"
        ).count()

        results.append({
            "id": u.id,
            "user_id": u.user_id,
            "full_name": u.full_name,
            "email": u.email,
            "account_status":
                u.account_status or "ACTIVE",
            "role": u.role or "USER",
            "email_verified":
                getattr(
                    u,
                    "email_verified",
                    True
                ),
            "contact_no":
                u.contact_no or "N/A",

            "created_at":
                safe_datetime(
                    u.created_at
                ),

            "last_login_at":
                safe_datetime(
                    getattr(
                        u,
                        "last_login_at",
                        None
                    )
                ),

            "last_seen_at":
                safe_datetime(
                    getattr(
                        u,
                        "last_seen_at",
                        None
                    )
                ),

            "subscriptions_count":
                sub_count,
        })

    return results


# ============================================================
# UPDATE USER STATUS
# ============================================================

@router.patch(
    "/users/{user_id}/status"
)
def update_user_status(
    user_id: int,
    payload: UserStatusUpdateReq,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    target_user = db.query(
        User
    ).filter(
        User.id == user_id
    ).first()

    if not target_user:

        raise HTTPException(
            status_code=404,
            detail="User account not found."
        )

    # Prevent an administrator from accidentally
    # banning/suspending their own account.
    if target_user.id == current_user.id:

        raise HTTPException(
            status_code=400,
            detail=(
                "Administrators cannot "
                "change their own account status."
            )
        )

    action = (
        payload.status
        .strip()
        .upper()
    )

    if action in [
        "SUSPEND",
        "SUSPENDED",
    ]:

        target_user.account_status = (
            "SUSPENDED"
        )

    elif action in [
        "UNSUSPEND",
        "UNBAN",
        "ACTIVE",
        "ACTIVATE",
    ]:

        target_user.account_status = (
            "ACTIVE"
        )

    elif action in [
        "BAN",
        "BANNED",
    ]:

        target_user.account_status = (
            "BANNED"
        )

    elif action == "FORCE_LOGOUT":

        target_user.last_seen_at = (
            datetime.utcnow()
            - timedelta(days=1)
        )

    else:

        target_user.account_status = action

    db.commit()

    audit_log = AuditLog(
        user_id=target_user.id,
        actor_user_id=current_user.id,
        action=f"ADMIN_USER_{action}",
        resource_type="USER",
        resource_id=str(
            target_user.id
        ),
        status="SUCCESS",
        metadata_json=(
            f'{{'
            f'"admin_email": '
            f'"{current_user.email}", '
            f'"action": "{action}"'
            f'}}'
        ),
        created_at=datetime.utcnow()
    )

    db.add(audit_log)

    db.commit()

    return {
        "message": (
            "User status successfully "
            f"updated to "
            f"{target_user.account_status}"
        ),
        "account_status":
            target_user.account_status,
    }


# ============================================================
# USER DETAILS
# ============================================================

@router.get(
    "/users/{user_id}/details"
)
def get_admin_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> Dict[str, Any]:

    u = db.query(
        User
    ).filter(
        User.id == user_id
    ).first()

    if not u:

        raise HTTPException(
            status_code=404,
            detail="User profile not found."
        )

    overview = {
        "user_id":
            u.user_id,

        "full_name":
            u.full_name,

        "masked_email":
            mask_email(u.email),

        "masked_contact":
            mask_contact(
                u.contact_no or ""
            ),

        "account_status":
            u.account_status or "ACTIVE",

        "role":
            u.role or "USER",

        "created_at":
            safe_datetime(
                u.created_at
            ),

        "last_login":
            safe_datetime(
                getattr(
                    u,
                    "last_login_at",
                    None
                )
            ),

        "last_active":
            safe_datetime(
                getattr(
                    u,
                    "last_seen_at",
                    None
                )
            ),

        "email_verified":
            getattr(
                u,
                "email_verified",
                True
            ),
    }

    # --------------------------------------------------------
    # SUBSCRIPTIONS
    # --------------------------------------------------------

    subs = db.query(
        Subscription
    ).filter(
        Subscription.user_id == u.id
    ).all()

    subscriptions = [
        {
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "plan_type": s.plan_type,
            "cost": float(
                s.cost or 0
            ),
            "currency":
                s.currency or "USD",
            "billing_cycle":
                s.billing_cycle,
            "status":
                s.status,
            "next_billing_date":
                s.next_billing_date,
        }
        for s in subs
    ]

    # --------------------------------------------------------
    # WALLET
    # --------------------------------------------------------

    banks = db.query(
        WalletBank
    ).filter(
        WalletBank.user_id == u.id
    ).all()

    cards = db.query(
        WalletCard
    ).filter(
        WalletCard.user_id == u.id
    ).all()

    mobiles = db.query(
        WalletMobile
    ).filter(
        WalletMobile.user_id == u.id
    ).all()

    wallet = {
        "banks": [
            {
                "id": b.id,
                "bank_name":
                    b.bank_name,
                "masked_account":
                    b.masked_account_number,
            }
            for b in banks
        ],

        "cards": [
            {
                "id": c.id,
                "card_title":
                    c.card_title,
                "masked_card":
                    c.masked_card_number,
                "type":
                    c.card_type,
            }
            for c in cards
        ],

        "mobiles": [
            {
                "id": m.id,
                "provider":
                    m.provider,
                "mobile_number":
                    (
                        f"****"
                        f"{m.mobile_number[-4:]}"
                        if m.mobile_number
                        and len(
                            m.mobile_number
                        ) >= 4
                        else "N/A"
                    ),
            }
            for m in mobiles
        ],
    }

    # --------------------------------------------------------
    # REAL ACTIVITY
    # --------------------------------------------------------

    recent_audits = db.query(
        AuditLog
    ).filter(
        AuditLog.user_id == u.id
    ).order_by(
        AuditLog.created_at.desc()
    ).limit(10).all()

    activity = [
        {
            "event":
                al.action,

            "timestamp":
                safe_datetime(
                    al.created_at
                ),

            "ip":
                al.ip_address or "N/A",
        }
        for al in recent_audits
    ]

    if (
        not activity
        and getattr(
            u,
            "last_seen_at",
            None
        )
    ):

        activity = [
            {
                "event":
                    "Last account activity",

                "timestamp":
                    u.last_seen_at.isoformat(),

                "ip":
                    "N/A",
            }
        ]

    # --------------------------------------------------------
    # SECURITY EVENTS
    # --------------------------------------------------------

    sec_events = db.query(
        SecurityEvent
    ).filter(
        SecurityEvent.user_email
        == u.email
    ).order_by(
        SecurityEvent.timestamp.desc()
    ).all()

    security = [
        {
            "id":
                se.id,

            "event_type":
                se.event_type,

            "severity":
                se.severity,

            "description":
                se.description,

            "timestamp":
                safe_datetime(
                    se.timestamp
                ),
        }
        for se in sec_events
    ]

    # --------------------------------------------------------
    # AUDIT LOGS
    # --------------------------------------------------------

    audits = db.query(
        AuditLog
    ).filter(
        AuditLog.user_id == u.id
    ).order_by(
        AuditLog.created_at.desc()
    ).all()

    audit_logs = [
        {
            "id":
                al.id,

            "action":
                al.action,

            "resource_type":
                al.resource_type,

            "timestamp":
                safe_datetime(
                    al.created_at
                ),

            "status":
                al.status,
        }
        for al in audits
    ]

    return {
        "overview":
            overview,

        "subscriptions":
            subscriptions,

        "wallet":
            wallet,

        "activity":
            activity,

        "security":
            security,

        "audit":
            audit_logs,
    }


# ============================================================
# GLOBAL SUBSCRIPTIONS
# ============================================================

@router.get(
    "/subscriptions"
)
def get_admin_global_subscriptions(
    user: Optional[str] = Query(None),
    service: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    billing_cycle: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> List[Dict[str, Any]]:

    query = db.query(
        Subscription
    )

    if service:

        query = query.filter(
            Subscription.name.ilike(
                f"%{service.strip()}%"
            )
        )

    if (
        status
        and status.upper() != "ALL"
    ):

        query = query.filter(
            Subscription.status.ilike(
                status.strip()
            )
        )

    if (
        category
        and category.upper() != "ALL"
    ):

        query = query.filter(
            Subscription.category.ilike(
                category.strip()
            )
        )

    if (
        billing_cycle
        and billing_cycle.upper()
        != "ALL"
    ):

        query = query.filter(
            Subscription.billing_cycle.ilike(
                billing_cycle.strip()
            )
        )

    subs = query.order_by(
        Subscription.id.desc()
    ).all()

    results = []

    for s in subs:

        u = db.query(
            User
        ).filter(
            User.id == s.user_id
        ).first()

        if user and u:

            user_term = (
                user.strip().lower()
            )

            if not (
                user_term
                in u.user_id.lower()
                or user_term
                in u.full_name.lower()
                or user_term
                in u.email.lower()
            ):

                continue

        results.append({
            "id":
                s.id,

            "user_id":
                (
                    u.user_id
                    if u
                    else f"PP-USR-{s.user_id}"
                ),

            "user_name":
                (
                    u.full_name
                    if u
                    else "Unknown User"
                ),

            "service":
                s.name,

            "plan":
                s.plan_type,

            "amount":
                float(s.cost or 0),

            "currency":
                s.currency or "USD",

            "next_billing_date":
                s.next_billing_date,

            "status":
                s.status,

            "payment_type":
                s.payment_type,

            "category":
                s.category,

            "billing_cycle":
                s.billing_cycle,

            "created_at":
                (
                    s.created_at
                    or s.purchased_date
                    or datetime.utcnow().isoformat()
                ),
        })

    return results


# ============================================================
# GLOBAL WALLET
# ============================================================

@router.get(
    "/wallet"
)
def get_admin_wallet_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> List[Dict[str, Any]]:

    wallet_items = []

    # --------------------------------------------------------
    # CARDS
    # --------------------------------------------------------

    cards = db.query(
        WalletCard
    ).all()

    for c in cards:

        u = db.query(
            User
        ).filter(
            User.id == c.user_id
        ).first()

        wallet_items.append({
            "id":
                c.id,

            "user_id":
                (
                    u.user_id
                    if u
                    else f"PP-{c.user_id}"
                ),

            "user_name":
                (
                    u.full_name
                    if u
                    else "Unknown User"
                ),

            "type":
                "card",

            "provider":
                c.card_type
                or c.card_title
                or "Credit Card",

            "masked_identifier":
                c.masked_card_number,

            "status":
                "PRIMARY",

            "created_at":
                safe_datetime(
                    c.created_at
                ),
        })

    # --------------------------------------------------------
    # BANKS
    # --------------------------------------------------------

    banks = db.query(
        WalletBank
    ).all()

    for b in banks:

        u = db.query(
            User
        ).filter(
            User.id == b.user_id
        ).first()

        wallet_items.append({
            "id":
                b.id,

            "user_id":
                (
                    u.user_id
                    if u
                    else f"PP-{b.user_id}"
                ),

            "user_name":
                (
                    u.full_name
                    if u
                    else "Unknown User"
                ),

            "type":
                "bank",

            "provider":
                b.bank_name,

            "masked_identifier":
                b.masked_account_number,

            "status":
                "ACTIVE",

            "created_at":
                safe_datetime(
                    b.created_at
                ),
        })

    # --------------------------------------------------------
    # MOBILE BANKING
    # --------------------------------------------------------

    mobiles = db.query(
        WalletMobile
    ).all()

    for m in mobiles:

        u = db.query(
            User
        ).filter(
            User.id == m.user_id
        ).first()

        if (
            m.mobile_number
            and len(m.mobile_number) >= 4
        ):

            masked_num = (
                "****"
                + m.mobile_number[-4:]
            )

        else:

            masked_num = "N/A"

        wallet_items.append({
            "id":
                m.id,

            "user_id":
                (
                    u.user_id
                    if u
                    else f"PP-{m.user_id}"
                ),

            "user_name":
                (
                    u.full_name
                    if u
                    else "Unknown User"
                ),

            "type":
                "mobile_banking",

            "provider":
                m.provider,

            "masked_identifier":
                masked_num,

            "status":
                "ACTIVE",

            "created_at":
                safe_datetime(
                    m.created_at
                ),
        })

    return wallet_items


# ============================================================
# AUDIT LOGS
# ============================================================

@router.get(
    "/audit-logs"
)
def get_admin_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> List[Dict[str, Any]]:

    logs = db.query(
        AuditLog
    ).order_by(
        AuditLog.created_at.desc()
    ).all()

    results = []

    for log in logs:

        u = None

        if log.user_id:

            u = db.query(
                User
            ).filter(
                User.id == log.user_id
            ).first()

        results.append({
            "id":
                log.id,

            "user_id":
                log.user_id,

            "user_email":
                (
                    mask_email(u.email)
                    if u
                    else "system"
                ),

            "action":
                log.action,

            "ip_address":
                log.ip_address or "N/A",

            "timestamp":
                safe_datetime(
                    log.created_at
                ),

            "details":
                (
                    log.metadata_json
                    or
                    f"Action "
                    f"{log.action} "
                    f"executed on "
                    f"{log.resource_type}"
                ),
        })

    return results


# ============================================================
# SECURITY EVENTS
# ============================================================

@router.get(
    "/security"
)
def get_admin_security_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> List[Dict[str, Any]]:

    events = db.query(
        SecurityEvent
    ).order_by(
        SecurityEvent.timestamp.desc()
    ).all()

    return [
        {
            "id":
                e.id,

            "severity":
                e.severity,

            "event_type":
                e.event_type,

            "description":
                e.description,

            "user_email":
                (
                    mask_email(e.user_email)
                    if e.user_email
                    else "system"
                ),

            "ip_address":
                e.ip_address or "N/A",

            "timestamp":
                safe_datetime(
                    e.timestamp
                ),

            "resolved":
                e.resolved,
        }
        for e in events
    ]