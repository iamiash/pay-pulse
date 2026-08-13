from datetime import datetime
from sqlalchemy.orm import Session
from app.db.models import Subscription, Notification

def check_and_generate_renewal_notifications(db: Session, user_id: int):
    today = datetime.now().date()
    subs = db.query(Subscription).filter(Subscription.user_id == user_id).all()

    for sub in subs:
        try:
            if sub.next_billing_date:
                raw_date = str(sub.next_billing_date)[:10]
                billing_date = datetime.strptime(raw_date, "%Y-%m-%d").date()
                days_until = (billing_date - today).days

                # Automatically update status to Expired if billing date has passed and still Active
                if billing_date < today and sub.status == "Active":
                    sub.status = "Expired"

                # Check reminder threshold (supports notify_before_days or reminder_days if present, default 7 days)
                reminder_days = getattr(sub, "notify_before_days", None) or getattr(sub, "reminder_days", None) or 7

                # Trigger notification if renewal is within the reminder window or 7 days
                if 0 <= days_until <= reminder_days and sub.status in ["Active", "active"]:
                    existing = db.query(Notification).filter(
                        Notification.user_id == user_id,
                        Notification.subscription_id == sub.id,
                        Notification.is_read == False,
                        Notification.category == "Renewal"
                    ).first()

                    if not existing:
                        time_phrase = "today" if days_until == 0 else (f"in 1 day" if days_until == 1 else f"in {days_until} days")
                        msg = f"{sub.name} renews {time_phrase}."
                        
                        notif = Notification(
                            user_id=user_id,
                            subscription_id=sub.id,
                            title=f"Renewal Alert: {sub.name}",
                            message=msg,
                            category="Renewal",
                            is_read=False
                        )
                        db.add(notif)
        except Exception:
            continue
    db.commit()