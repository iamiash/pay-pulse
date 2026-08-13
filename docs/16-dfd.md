# 16. Data Flow Diagrams (DFD)

### Level 0 DFD: Context Diagram
[ User Browser (React Frontend) ]
│
│  HTTP REST Requests (JWT Bearer Token Header)
▼
[ FastAPI Backend Engine (main.py / router.py) ]
│
├──► Security Middleware (Bcrypt Hash / AES Fernet Cipher)
├──► SQLite Engine (paypulse.db)
└──► ReportLab PDF Engine (pdf_service.py)

### Level 1 DFD: Subsystem Process Decomposition

[ Frontend Axios Client (client.ts) ]
│
├──► /api/v1/auth ──────────► [ auth.py ] ──────────► SQLite User Records
├──► /api/v1/users ─────────► [ users.py ] ─────────► Avatar Media Storage (/static/uploads/)
├──► /api/v1/subscriptions ─► [ subscriptions.py ] ─► Subscription Analytics & Tenure Math
├──► /api/v1/wallet ────────► [ wallet.py ] ────────► AES Fernet Encrypted Credentials
├──► /api/v1/notifications ─► [ notifications.py ] ─► 7-Day Renewal Alert Triggers
└──► /api/v1/reports ───────► [ reports.py ] ───────► ReportLab PDF Binary Streaming