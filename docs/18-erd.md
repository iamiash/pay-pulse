# Entity Relationship Diagram (ERD)

This document models the logical data relationships within PayPulse. Even though the application uses a flat client-side storage model (`localStorage`), the conceptual data relationships are mapped here for future scalability (e.g., migrating to an SQL backend).

### 1. Conceptual Data Entities

#### Entity A: User (Implicit)
*   **Context:** Currently bounded by the individual browser session instance. 
*   **Relationship:** One individual user machine holds zero to many (`1:N`) subscription records.

#### Entity B: Subscription Record
*   **Attributes:** `id` (PK), `name`, `cost`, `cycle`, `renewalDate`.

### 2. Logical Text Model

### 3. Cardinality Rules
*   Each subscription logged inside the dashboard belongs strictly to the local client state.
*   If a user clears their browser cache or local storage repository, the associated relationship is torn down, resetting the dashboard entity count to zero.
