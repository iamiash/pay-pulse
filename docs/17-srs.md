# 17. Software Requirements Specification (SRS) Summary

This document binds the functional, technical, and operational requirements of PayPulse into a single architectural specification.

### Key Architectural Boundaries
1. **Frontend Architecture**: React 18, TypeScript, Vite, Tailwind CSS, Axios client interceptors, Context API state management (`AuthContext`, `ToastContext`, `NotificationContext`).
2. **Backend Architecture**: Python FastAPI framework, SQLAlchemy ORM, Pydantic data validation schemas, Bcrypt password hashing, AES Fernet credential encryption, ReportLab PDF generation.
3. **Storage Tier**: SQLite (`paypulse.db`) with relational schema constraints and local media storage for user avatars (`backend/static/uploads/`).
4. **Security Controls**: Stateless JWT authorization, locked DOB user profile constraints, server-side credential encryption, and CORS configuration.
5. **Quality Assurance**: Explicit HTTP status code responses (`200`, `201`, `400`, `401`, `404`, `422`, `500`) logged via Axios interceptors for browser DevTools network diagnostics.