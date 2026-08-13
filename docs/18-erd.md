# 18. Entity Relationship Diagram (ERD)
┌────────────────────────┐
   │         USER           │
   ├────────────────────────┤
   │ id (PK)                │
   │ name                   │
   │ email (UNIQUE)         │
   │ password_hash          │
   │ contact_no             │
   │ dob (LOCKED)           │
   │ avatar_url             │
   └───────────┬────────────┘
               │
┌──────────────┼───────────────────────────┐
│ 1:N          │ 1:N                       │ 1:N
▼              ▼                           ▼
┌────────┐  ┌──────────────┐          ┌─────────────────┐
│ WALLET │  │ SUBSCRIPTION │          │  NOTIFICATION   │
├────────┤  ├──────────────┤          ├─────────────────┤
│ (Bank) │  │ id (PK)      │          │ id (PK)         │
│ (Card) │  │ user_id (FK) │          │ user_id (FK)    │
│ (Mob)  │  │ name         │          │ sub_id (FK)     │
└───┬────┘  │ cost, plan   │          │ alert_type      │
│       │ next_billing │          │ days_remaining  │
│ 1:1   │ payment_type │          │ is_read         │
└──────►│ payment_id   │          └─────────────────┘
└──────────────┘