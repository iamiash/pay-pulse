# Use Case Specifications (SRS Element)

This document tracks the core interaction scenarios between the end-user (Student) and the PayPulse tracking environment.

### Use Case 1: Create New Subscription Log
* **Primary Actor:** Student / App User
* **Preconditions:** The browser has local storage permissions enabled.
* **Main Flow:**
    1. User opens the application dashboard.
    2. User enters the subscription name, numeric price, cycles cadence, and renewal date target.
    3. User presses the "Add Subscription" button.
    4. The system validates fields, updates the internal list array, and refreshes the user display.
* **Alternative Flow:** If numeric inputs are negative or fields are left empty, the application throws an alert error badge on the form layout.

### Use Case 2: Delete Existing Subscription Record
* **Primary Actor:** Student / App User
* **Preconditions:** At least one active record is present in the dashboard UI feed.
* **Main Flow:**
    1. User locates the target subscription card item on the dashboard list.
    2. User clicks the "Delete" action button icon attached to the card.
    3. The system captures the record ID, strips it out of the browser array, and updates the local storage cache state.
    4. The dashboard layout dynamically updates, subtracting the deleted item's budget metric from the top aggregator display.
