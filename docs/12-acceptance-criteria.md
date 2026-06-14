# Acceptance Criteria (PRD Element)

This document defines the clear conditions that each feature must satisfy before the PayPulse MVP can be considered fully functional and ready for deployment.

### AC-1: Subscription Input Form
* **Scenario:** Student adds a valid subscription entry.
* **Given:** The user is on the main dashboard view.
* **When:** They enter a valid name (under 30 characters), a positive price numerical value, pick a cycle cadence, select a future renewal date, and click "Add Subscription".
* **Then:** The system must parse this data, save it to `localStorage`, and instantly display it in the subscription feed without reloading the page.

### AC-2: Data Validation Guardrails
* **Scenario:** Student attempts to submit invalid data fields.
* **Given:** The user leaves fields empty or inputs a negative cost value.
* **When:** They click the submission button.
* **Then:** The application must block the submission entirely and show an inline text warning badge.

### AC-3: Deletion Mechanics
* **Scenario:** Student removes an entry from tracking.
* **Given:** Active card items are displayed on the dashboard grid layout.
* **When:** The user clicks the trash can/delete button on an item card.
* **Then:** The record must be scrubbed from browser memory instantly, the card must disappear, and the aggregate total expenses display must subtract the deleted cost immediately.
