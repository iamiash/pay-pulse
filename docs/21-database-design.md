# Database Design Specification

This document outlines the schema layout, persistence rules, and data constraints of the client-side storage engine used by PayPulse.

### 1. Storage Choice: Web LocalStorage API
To eliminate host server costs, performance bottlenecks, and user authentication setup steps, PayPulse utilizes the browser's native `window.localStorage` object instance. Data persists indefinitely until explicitly purged by the user's browser cleanup workflows or application controls.

### 2. Key-Value Mapping Structure
All subscription entries are kept under a single domain-isolated database key namespace to prevent collisions with other apps running on the client machine.

* **Database Key Identifier:** `paypulse_subscriptions`
* **Data Layout:** A continuous stringified JSON collection block array.

### 3. Data Types & Attribute Table Constraints

| Field Name | Storage Element Type | Constraint Validation Rules |
| :--- | :--- | :--- |
| `id` | String / Token | Primary Unique Index Key. Generated on client runtime via timestamp metrics. |
| `name` | String Text | Required field. Whitespace is stripped out. Limited to a maximum of 30 characters. |
| `cost` | Numeric Value | Required field. Constrained to absolute positive floats greater than or equal to `0.00`. |
| `cycle` | Enum / String String | Strictly accepts either `"monthly"` or `"yearly"` value labels. |
| `renewalDate` | ISO Date Text | Standard format string notation (`YYYY-MM-DD`). Cannot be a broken historical calendar state. |
