# Data Schema Specification

This document outlines the data attributes and object parameters stored within the client-side database layer for the PayPulse app.

### Storage Engine: Browser localStorage Keys
*   **Main Storage Key:** `paypulse_subscriptions` (Stores an array of individual subscription objects serialized as text strings).

### Subscription Object Fields Map:

| Attribute Name | Data Type | Requirement | Example Values | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | Required | `"sub_17012345678"` | Unique identifier generated using timestamp values. |
| `name` | String | Required | `"GitHub Copilot"` | Title label of the tracked software service. |
| `cost` | Float / Number | Required | `10.00` | Price value charged per cycle recurring billing. |
| `cycle` | String | Required | `"monthly"` or `"yearly"` | Target dropdown string selecting renewal cadence. |
| `renewalDate` | String | Required | `"2026-07-01"` | ISO format calendar date indicating next billing point. |

### Raw Sample Record Definition (JSON Object representation):
