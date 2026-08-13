# 20. Technical Design Document (TDD)

## 1. Directory Structure Standards
* **Backend**: FastAPI structure separating `endpoints/`, `core/`, `db/`, and `services/`.
* **Frontend**: Feature-driven React components (`components/subscriptions/`, `components/wallet/`, `components/modals/`, `components/icons/`).

## 2. Core Functional Modules

### Backend Services
* `core/security.py`: Contains Bcrypt password hashing methods and Fernet AES encryption/decrypted helpers (`encrypt_field()`, `decrypt_field()`).
* `services/pdf_service.py`: ReportLab generation logic for the 4 PDF report formats.
* `services/notification_service.py`: Evaluates billing dates against machine time to flag subscriptions renewing within 7 days.

### Frontend State Managers
* `context/AuthContext.tsx`: Manages authentication state, user session restoration, and token persistence.
* `context/ToastContext.tsx`: Manages floating toast alert banners with automatic 5–7 second dismissal timeouts.
* `context/NotificationContext.tsx`: Tracks unread notification counts and manages bell badge updates.