# PayPulse — Smart Subscription Tracker & Management Platform

PayPulse is a full-stack, enterprise-grade web application designed to help users track, manage, and audit digital subscriptions, recurring billing cycles, and saved financial instruments in one unified dashboard.

## Technical Architecture
* **Backend**: Python 3.11+, FastAPI framework, SQLAlchemy ORM, Pydantic v2 validation, ReportLab (PDF Engine), Cryptography (AES Fernet field-level encryption), Bcrypt password hashing, PyJWT bearer authorization.
* **Database**: SQLite (`paypulse.db`) with relational integrity constraints and client/server-side credential masking.
* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Axios client with custom HTTP status code DevTools interceptors.
* **Authentication**: Stateless JWT Bearer token authorization with protected React routes.

## Core System Capabilities
1. **Subscription Lifecycle Management**: Log plan details, billing frequencies (Monthly/Yearly), auto-renewal states, active tenure month counters, next billing dates, and associated user email/phone contacts.
2. **Encrypted Financial Wallet**: Store Bank Accounts, Payment Cards (Visa, Mastercard, Amex, Nexus), and Mobile Banking channels (bKash, Nagad, Rocket) with server-side AES Fernet encryption on CVCs and account numbers.
3. **Dynamic Payment Association**: Directly map subscriptions to saved wallet accounts with inline modal creation (`+ Add New`) that preserves form state.
4. **Interactive Analytics & Universal Search**: Clickable dashboard metric cards for rapid list filtering, live auto-complete search with modal inspection, and an automated 7-day renewal notification engine.
5. **Advanced PDF Export Suite**: Export 4 customizable ReportLab PDF reports (Full Complete Summary, Specific Subscription History, Monthly Audit, and Advanced Date-Range Filtered Exports).
6. **User Account Security**: Custom avatar uploads/deletions, profile menu popovers with sign-out confirmation modals, and strict Date of Birth (DOB) immutability after registration.

## Documentation Index
Comprehensive system design, requirements, database schemas, and API specifications are available in the [`/docs`](./docs/00-index.md) folder:
* **Product Requirements**: [PRD](./docs/08-prd.md) | [User Journey](./docs/10-user-journey.md) | [User Stories](./docs/11-user-stories.md)
* **Software Specifications**: [SRS Summary](./docs/17-srs.md) | [Functional Requirements](./docs/13-functional-requirements.md) | [Non-Functional Requirements](./docs/14-non-functional-requirements.md)
* **Technical Design**: [System Architecture](./docs/19-system-design.md) | [TDD](./docs/20-tdd.md) | [ERD Diagram](./docs/18-erd.md) | [DFD Diagrams](./docs/16-dfd.md)
* **Data & API Layer**: [Database Design](./docs/21-database-design.md) | [REST API Specs](./docs/22-api-design.md)