# 08. Product Requirement Document (PRD)

## 1. System Vision
PayPulse is a high-performance web platform designed for monitoring digital subscriptions, managing payment accounts, triggering 7-day renewal alerts, and exporting customizable PDF audit reports.

## 2. Core Functional Modules

### A. Authentication & User Profile Module
* **Account Provisioning**: Registration, Login, Forgot/Reset Password via JWT Bearer authentication.
* **Profile Management**: Update Full Name, Email, and Phone Contact.
* **Locked DOB Rule**: Date of Birth (DOB) is strictly read-only after registration.
* **Media Avatar Management**: Upload custom profile avatar images (saved in `backend/static/uploads/`) or delete custom avatars to restore default initials.

### B. Wallet Management Module
* **Bank Accounts**: Bank Name, Account Number (Encrypted), Routing Number, Branch Name.
* **Payment Cards**: Card Type (Visa, Mastercard, Amex, Nexus), Category (Credit/Debit), Card Number (Encrypted/Masked), Expiry Date, CVC (Encrypted).
* **Mobile Banking**: Provider (bKash, Nagad, Rocket), Mobile Number.

### C. Subscription Tracking & Dynamic Payment Association
* **Subscription Fields**: Service Name, Category, Plan Tier, Cost, Billing Cycle (Monthly/Yearly), Start Date, Purchase Date, Next Billing Date, Auto-Renewal Toggle, Associated Email, Contact Number.
* **Pre-filled User Data**: New subscription forms auto-fill Associated Email and Contact Number with the logged-in user's profile data, remaining fully editable.
* **Dynamic Payment Selector**: Selecting Bank, Card, or Mobile Banking dynamically populates saved choices. Includes an inline **+ Add New** button that opens a child modal to create a payment method on the fly and auto-select it without losing form state.

### D. Interactive UI, Search & Notifications
* **Collapsible Sidebar**: Defaults to icon-only view with tooltips on hover. Menu toggle expands sidebar with labels. Bottom profile avatar shows user details on hover, with a popover for Account Settings and Sign Out. Sign Out triggers a confirmation modal before clearing the session.
* **Interactive Metric Cards**: Clickable summary metrics (Active Services, Expired Services, Total Monthly Spend, Upcoming Renewals) that instantly filter the main subscription list.
* **Universal Live Search**: Top bar input with live auto-complete suggestions. Clicking a suggestion opens that item's detail modal.
* **7-Day Renewal Notifications**: Automated background checks generate alerts for subscriptions renewing within 7 days, updating an unread badge on the navbar bell icon.
* **Toast Notifications**: Floating UI status alerts auto-dismiss after 5–7 seconds for all backend CRUD operations.

### E. PDF Export Suite
1. **Full Complete Summary PDF**: Full audit of active/expired services, total monthly spend, and wallet breakdown.
2. **Specific Subscription History PDF**: Comprehensive lifecycle and payment history for a selected service.
3. **Specific Monthly Audit PDF**: Breakdown of active/expired services and costs incurred during a target month.
4. **Advanced Filtered PDF**: Custom date-range export (Month A to Month B) filtered by service or payment type.