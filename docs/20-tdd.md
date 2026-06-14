# Technical Design Document (TDD)

This document defines the implementation specifications, function naming standards, and module requirements for PayPulse.

### 1. Code Standards & Architecture
* **Language:** Vanilla HTML5, CSS3, and modern ECMAScript 6+ JavaScript.
* **File Organization:** Flat client-side structure (`index.html`, `style.css`, `app.js`).
* **Naming Convention:** `camelCase` for variable and function names; `kebab-case` for HTML IDs and CSS classes.

### 2. Core Functional Modules (Planned JavaScript Layout)

#### A. Storage Intermediary Functions
* `getStoredSubscriptions()`: Pulls raw text from `localStorage`, parses it, and returns an array of objects. Returns an empty array if no key exists.
* `saveSubscriptions(subscriptionsArray)`: Serializes the updated object array into a JSON string and commits it back to browser storage.

#### B. Calculation & Processing Modules
* `calculateTotalMonthlySpend()`: Iterates through the stored records array. If an item's cycle is set to `"yearly"`, it divides the cost by 12 before adding it to the cumulative total runner.
* `determineExpirationStatus(renewalDateString)`: Measures the delta between the machine's live timestamp and the target billing string to output a status metric (`safe`, `warning`, or `critical`).

#### C. View Rendering Elements
* `renderDashboardView()`: Clears out active container layout nodes, queries the storage controller, runs calculations, builds fresh DOM elements for the list view, and appends them to the screen viewport.
