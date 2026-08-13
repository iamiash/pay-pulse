# 12. Acceptance Criteria

### AC-1: Encryption Safeguards
* **Given** a user inputs a Card Number, CVC, or Bank Account Number,
* **When** the payload reaches `wallet.py`,
* **Then** the backend must encrypt the sensitive fields using AES Fernet before storing them in SQLite, returning masked string representations (`•••• 4382`) to the frontend UI.

### AC-2: DOB Read-Only Enforcement
* **Given** an authenticated user opens `AccountSettings.tsx`,
* **When** they attempt to modify their Date of Birth,
* **Then** the UI input must remain disabled, and `users.py` must reject any attempt to update DOB with a `400 Bad Request` or `422 Unprocessable Entity` response.

### AC-3: Inline Payment Method Creation
* **Given** a user is filling out `AddSubscriptionModal.tsx` and selects a payment dropdown,
* **When** they click **+ Add New**,
* **Then** a child payment modal must open, submit the new payment method to SQLite, close the child modal, refresh the payment list, and automatically select the new item in the subscription dropdown without clearing previously entered form inputs.

### AC-4: 7-Day Notification Alert Execution
* **Given** a subscription's `next_billing_date` is within 7 days of the current date,
* **When** `notification_service.py` executes,
* **Then** an unread notification record must be created, incrementing the unread bell icon badge in `Navbar.tsx`.