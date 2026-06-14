Use Case Analysis

This document outlines the system boundaries and interaction points between the Actor (the Student User) and the PayPulse application.

### System Boundary: PayPulse Web Application
### Primary Actor: Student / General User

### Core Use Cases:
1. UC-1: Create Subscription Entry
   Description: User inputs service name, monthly/yearly fee, and next billing date. The application updates local storage and refreshes the list view.
2. UC-2: Track/View Total Expenses
   Description: System automatically parses all active storage objects, aggregates individual costs, and displays a summary banner at the top of the viewport.
3. UC-3: Monitor Expiration Status
   Description: System compares current system date against stored renewal dates and appends descriptive warning elements (Green/Yellow/Red status signals).
4. UC-4: Delete/Remove Entry
   Description: User removes an active item upon cancellation or completion of service. The underlying storage index is updated immediately.
