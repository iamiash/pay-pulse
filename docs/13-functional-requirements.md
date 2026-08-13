# 13. Functional Requirements Specification

### FR-1: Authentication & JWT Authorization
* FastAPI handles login, registration, and password reset endpoints.
* Stateless JWT Bearer tokens are issued upon authentication and attached to subsequent request headers via `client.ts`.

### FR-2: Cryptographic Security Operations
* Passwords hashed using Bcrypt in `security.py`.
* Sensitive wallet credentials (CVCs, full Card Numbers, Bank Routing/Account Numbers) encrypted using Python `cryptography.fernet.Fernet` AES ciphers before database commit.

### FR-3: Dynamic Subscription Management
* Supports CRUD operations for subscriptions with automatic calculation of total active tenure months.
* Auto-fills user email and contact info into new subscription forms while allowing manual overrides.
* Links subscriptions directly to saved wallet payment methods (Bank, Card, Mobile Banking).

### FR-4: PDF Document Generation Engine
* `pdf_service.py` utilizes ReportLab to generate 4 downloadable PDF report types: Full Summary, Subscription Detail History, Monthly Audit, and Advanced Date-Range Filtered Exports.

### FR-5: Automated Notification Triggers
* Background service evaluates renewal dates and flags subscriptions renewing within 7 days, updating the navbar bell notification badge.