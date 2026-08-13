# 15. Use Case Specifications

### Use Case 1: Add Subscription with Inline Payment Creation
* **Primary Actor**: Authenticated User
* **Preconditions**: User is logged in and opens `AddSubscriptionModal.tsx`.
* **Main Flow**:
  1. User enters subscription details (Name, Plan, Cost, Billing Date).
  2. Associated email and contact number auto-fill with profile data.
  3. User selects payment type "Credit Card" but finds no saved cards in the dropdown.
  4. User clicks **+ Add New**, opening `AddCardModal.tsx`.
  5. User submits new card details; `wallet.py` encrypts CVC/Card numbers using AES Fernet and saves to SQLite.
  6. `AddCardModal.tsx` closes, the card dropdown refreshes, and the new card is automatically selected.
  7. User submits the subscription form; backend returns `201 Created` and a 5–7 second success toast appears.

### Use Case 2: Generate Advanced Date-Range Filtered PDF Report
* **Primary Actor**: Authenticated User
* **Preconditions**: User accesses `Reports.tsx` or opens `PdfExportModal.tsx`.
* **Main Flow**:
  1. User selects "Advanced Filtered PDF Report".
  2. User specifies Start Month/Year, End Month/Year, and selects target subscription scope.
  3. User clicks **Generate PDF**.
  4. FastAPI calls `pdf_service.py`, compiles a ReportLab binary document, and streams a blob payload.
  5. The browser initiates a direct file download (`paypulse_report.pdf`) and displays a success toast notification.