# 19. System Design & Component Data Flow

### Step-by-Step Data Flow
1. **Request Dispatch & Interception**: The React frontend dispatches HTTP API calls via `client.ts`. The Axios interceptor automatically attaches the `Authorization: Bearer <JWT>` token header and logs request metrics to the DevTools console.
2. **Dependency Injection & Routing**: FastAPI receives the request in `main.py`, passing it to `router.py`. Middleware verifies CORS policy and `deps.py` decodes the JWT token to authenticate the user and establish a database session.
3. **Business Logic & Cryptography**:
   * For **Wallet operations**, `security.py` encrypts sensitive card/bank data using AES Fernet before persisting to SQLite via SQLAlchemy ORM models.
   * For **Subscriptions**, `subscriptions.py` updates plan records, calculates active tenure duration, and checks renewal date thresholds.
   * For **PDF Reports**, `pdf_service.py` queries SQLite, formats structured tables using ReportLab, and streams a binary blob back to the client.
4. **Response & UI Updates**: The frontend receives standardized response codes (`200 OK`, `201 Created`, etc.). Success or error status messages trigger 5–7 second floating toast notifications via `ToastContext.tsx`.