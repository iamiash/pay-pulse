# 22. REST API Design Specification

### 1. Authentication Endpoints (`/api/v1/auth`)
* `POST /register`: Accepts user credentials; returns `201 Created` or `400 Bad Request` if email exists.
* `POST /login`: Accepts credentials; returns `200 OK` with JWT access token or `401 Unauthorized`.
* `POST /forgot-password`: Generates reset token; returns `200 OK`.

### 2. User Profile Endpoints (`/api/v1/users`)
* `GET /me`: Fetches authenticated user profile; returns `200 OK`.
* `PUT /me`: Updates Name, Email, Contact; enforces DOB immutability (`400 Bad Request` if altered).
* `POST /me/avatar`: Accepts image upload (`multipart/form-data`); saves to `/static/uploads/` and returns `200 OK`.
* `DELETE /me/avatar`: Removes avatar image file and resets path; returns `200 OK`.

### 3. Wallet Endpoints (`/api/v1/wallet`)
* `GET /banks`, `POST /banks`: Retrieves/adds bank accounts with AES-encrypted account numbers.
* `GET /cards`, `POST /cards`: Retrieves/adds cards with AES-encrypted CVCs and masked numbers.
* `GET /mobile`, `POST /mobile`: Retrieves/adds mobile banking accounts (bKash, Nagad, Rocket).

### 4. Subscription Endpoints (`/api/v1/subscriptions`)
* `GET /`: Lists subscriptions; supports status and billing cycle filtering.
* `POST /`: Creates a subscription record linked to a saved wallet payment method; returns `201 Created`.
* `GET /{id}`: Returns detailed subscription data, active tenure months, and decrypted payment info.
* `PUT /{id}`, `DELETE /{id}`: Updates or deletes target subscription records.

### 5. Notification Endpoints (`/api/v1/notifications`)
* `GET /`: Retrieves 7-day renewal notifications and unread alert count.
* `PATCH /{id}/read`: Marks notification as read, decrementing the unread badge counter.

### 6. Report Endpoints (`/api/v1/reports`)
* `POST /summary`: Returns binary stream of Full Complete Summary PDF.
* `POST /subscription/{id}`: Returns binary stream of Specific Subscription History PDF.
* `POST /monthly`: Returns binary stream of Specific Monthly Audit PDF.
* `POST /filtered`: Accepts custom date ranges and scope filters; returns binary stream of Filtered Export PDF.