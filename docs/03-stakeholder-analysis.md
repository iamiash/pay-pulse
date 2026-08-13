# 03. Stakeholder Analysis

PayPulse serves primary end-users while adhering to software engineering evaluation standards.

### Stakeholder Matrix
* **Primary End-Users (Professionals & Students)**: Require a secure, rapid dashboard to monitor multi-channel digital expenses, receive 7-day renewal warnings, and store financial cards/accounts with zero security exposure.
* **System Administrators / Security Auditors**: Demand robust server-side protection, including AES Fernet encryption for card CVCs and bank accounts, Bcrypt password hashing, stateless JWT session boundaries, and structured HTTP error logs.
* **Academic & Software Engineering Evaluators**: Require strict adherence to RESTful principles, clean separation of concerns (FastAPI + React TypeScript), comprehensive API error tracking (200, 201, 400, 401, 404, 422, 500), and thorough documentation.