from sqlalchemy import text

from app.db.database import SessionLocal, engine, Base
from app.db.models import (
    User,
    WalletBank,
    WalletCard,
    WalletMobile,
    Subscription,
)
from app.core.security import get_password_hash, encrypt_field


def auto_migrate_schema():
    # Ensure all SQL tables exist
    Base.metadata.create_all(bind=engine)

    # Auto-add missing columns to existing SQLite database tables
    with engine.connect() as conn:
        result = conn.execute(text("PRAGMA table_info(users)")).fetchall()
        existing_columns = [row[1] for row in result]

        if "user_id" not in existing_columns:
            conn.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN user_id TEXT DEFAULT 'PP-7K4M9X2Q'"
                )
            )

        if "address" not in existing_columns:
            conn.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN address TEXT DEFAULT ''"
                )
            )

        if "country" not in existing_columns:
            conn.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN country TEXT DEFAULT 'United States'"
                )
            )

        if "preferred_currency" not in existing_columns:
            conn.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN preferred_currency TEXT DEFAULT 'USD'"
                )
            )

        if "role" not in existing_columns:
            conn.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN role TEXT DEFAULT 'USER'"
                )
            )

        if "account_status" not in existing_columns:
            conn.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN account_status TEXT DEFAULT 'ACTIVE'"
                )
            )

        if "email_verified" not in existing_columns:
            conn.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN email_verified INTEGER DEFAULT 1"
                )
            )

        conn.commit()


def init_db():
    auto_migrate_schema()

    db = SessionLocal()

    try:
        # =========================================================
        # ADMIN ACCOUNT
        # =========================================================

        admin_user = (
            db.query(User)
            .filter(User.email == "tanvir@paypulse.io")
            .first()
        )

        if not admin_user:
            admin_user = User(
                user_id="ADM-PP50",
                full_name="Tanvir Hossain",
                email="tanvir@paypulse.io",
                hashed_password=get_password_hash("password123"),
                contact_no="+8801800000000",
                address="789 Admin Tower, Dhaka",
                dob="1992-04-10",
                country="Bangladesh",
                preferred_currency="USD",
                role="ADMIN",
                account_status="ACTIVE",
                email_verified=True,
            )

            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

        else:
            # Force existing admin into the correct demo state.
            admin_user.user_id = "ADM-PP50"
            admin_user.hashed_password = get_password_hash(
                "password123"
            )
            admin_user.role = "ADMIN"
            admin_user.account_status = "ACTIVE"
            admin_user.email_verified = True

            db.commit()

        # =========================================================
        # DEMO USER
        # =========================================================

        existing_demo_user = (
            db.query(User)
            .filter(User.email == "demo@paypulse.com")
            .first()
        )

        if existing_demo_user:
            return

        test_user = User(
            user_id="PP-7K4M9X2Q",
            full_name="Alex Morgan",
            email="demo@paypulse.com",
            hashed_password=get_password_hash("password123"),
            contact_no="+8801700000000",
            address="123 Pulse St, New York",
            dob="1995-08-15",
            country="United States",
            preferred_currency="USD",
            role="USER",
            account_status="ACTIVE",
            email_verified=True,
        )

        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        # =========================================================
        # DEMO BANK
        # =========================================================

        bank = WalletBank(
            user_id=test_user.id,
            bank_name="City Bank Platinum",
            encrypted_account_number=encrypt_field(
                "1102938475610"
            ),
            masked_account_number="•••• •••• 5610",
            branch_name="Gulshan Avenue",
            routing_number="08526210",
        )

        db.add(bank)

        # =========================================================
        # DEMO CARD
        # =========================================================

        card = WalletCard(
            user_id=test_user.id,
            card_title="Primary Sapphire Mastercard",
            card_type="Mastercard",
            card_category="Credit",
            encrypted_card_number=encrypt_field(
                "5412751234568890"
            ),
            masked_card_number="•••• •••• •••• 8890",
            encrypted_cvc=encrypt_field("882"),
            expiry_date="09/28",
        )

        db.add(card)

        # =========================================================
        # DEMO MOBILE BANKING
        # =========================================================

        mobile = WalletMobile(
            user_id=test_user.id,
            provider="bkash",
            mobile_number="+8801811223344",
        )

        db.add(mobile)
        db.commit()

        # =========================================================
        # DEMO SUBSCRIPTIONS
        # =========================================================

        subscriptions = [
            Subscription(
                user_id=test_user.id,
                name="Netflix Premium UHD",
                category="Streaming",
                associated_email="alex.netflix@paypulse.com",
                associated_contact="+8801700000000",
                plan_type="4K Family Plan",
                cost=19.99,
                billing_cycle="Monthly",
                purchased_date="2025-01-10",
                next_billing_date="2026-08-10",
                auto_renewal=True,
                status="Active",
                payment_type="card",
                card_id=card.id,
            ),
            Subscription(
                user_id=test_user.id,
                name="AWS Cloud Hosting",
                category="Cloud",
                associated_email="devops@paypulse.com",
                associated_contact="+8801700000000",
                plan_type="Pro Compute Cluster",
                cost=149.50,
                billing_cycle="Monthly",
                purchased_date="2024-06-15",
                next_billing_date="2026-08-08",
                auto_renewal=True,
                status="Active",
                payment_type="bank",
                bank_id=bank.id,
            ),
            Subscription(
                user_id=test_user.id,
                name="ChatGPT Plus",
                category="SaaS",
                associated_email="alex.ai@paypulse.com",
                associated_contact="+8801700000000",
                plan_type="Individual Pro",
                cost=20.00,
                billing_cycle="Monthly",
                purchased_date="2025-03-01",
                next_billing_date="2026-08-06",
                auto_renewal=False,
                status="Active",
                payment_type="mobile_banking",
                mobile_id=mobile.id,
            ),
        ]

        db.add_all(subscriptions)
        db.commit()

    finally:
        db.close()


if __name__ == "__main__":
    init_db()