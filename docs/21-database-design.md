# 21. Database Design Specification

### Database Engine: SQLite (`backend/paypulse.db`)

### Schema Definitions

#### 1. Users Table (`users`)
* `id` (INTEGER, Primary Key, Autoincrement)
* `name` (VARCHAR(100), Not Null)
* `email` (VARCHAR(150), Unique, Index, Not Null)
* `password_hash` (VARCHAR(255), Not Null)
* `contact_no` (VARCHAR(30), Not Null)
* `dob` (DATE, Not Null, Read-Only Post-Registration)
* `avatar_url` (VARCHAR(255), Nullable)

#### 2. Subscriptions Table (`subscriptions`)
* `id` (INTEGER, Primary Key, Autoincrement)
* `user_id` (INTEGER, Foreign Key -> `users.id`)
* `name` (VARCHAR(100), Not Null)
* `category` (VARCHAR(50), Not Null)
* `plan_type` (VARCHAR(50), Not Null)
* `cost` (DECIMAL(10,2), Not Null)
* `billing_cycle` (VARCHAR(20), Not Null) -- Monthly / Yearly
* `start_date` (DATE, Not Null)
* `purchased_date` (DATE, Not Null)
* `next_billing_date` (DATE, Not Null)
* `auto_renewal` (BOOLEAN, Default True)
* `payment_type` (VARCHAR(20), Not Null) -- Bank / Card / Mobile
* `payment_id` (INTEGER, Not Null)
* `associated_email` (VARCHAR(150), Not Null)
* `contact_no` (VARCHAR(30), Not Null)

#### 3. Wallet Tables
* **`wallet_banks`**: `id`, `user_id` (FK), `bank_name`, `account_number_encrypted`, `routing_number`, `branch_name`.
* **`wallet_cards`**: `id`, `user_id` (FK), `card_type` (Visa/Mastercard/Amex/Nexus), `category` (Credit/Debit), `card_number_encrypted`, `card_number_masked`, `expiry_date`, `cvc_encrypted`.
* **`wallet_mobile`**: `id`, `user_id` (FK), `provider` (bKash/Nagad/Rocket), `mobile_number`.

#### 4. Notifications Table (`notifications`)
* `id` (INTEGER, Primary Key, Autoincrement)
* `user_id` (INTEGER, Foreign Key -> `users.id`)
* `subscription_id` (INTEGER, Foreign Key -> `subscriptions.id`)
* `alert_type` (VARCHAR(50))
* `days_remaining` (INTEGER)
* `is_read` (BOOLEAN, Default False)
* `created_at` (TIMESTAMP)