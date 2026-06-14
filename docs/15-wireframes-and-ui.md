# Wireframes & UI Layouts

This document outlines the structural interface blueprint for the PayPulse web application dashboard.

### 1. Top Banner Component (Global Metrics)
*   **Left Section:** App Branding logo (`PayPulse`) + active system status indicator.
*   **Center Section:** Total Monthly Budget Aggregator (displays cumulative calculation of all active recurring subscription charges).
*   **Right Section:** Active Count Counter (e.g., "Tracking 4 Active Subscriptions").

### 2. Primary Work Area (Two-Column Grid)
*   **Left Column (Input Control Panel Form):**
    *   Text Input Field: [ Service Name ]
    *   Number Input Field: [ Price / Cost ]
    *   Dropdown Menu: [ Monthly / Yearly billing options ]
    *   Date Picker Field: [ Next Renewal Date ]
    *   Action Element: Green button labeled `[ Add Subscription ]`
*   **Right Column (Active Subscription Feed / List View):**
    *   Displays vertical cards for each stored item.
    *   Each card contains: Title, Price, Renewal Date, a Status Badge color tag (Green/Yellow/Red based on trial closeness), and a small Trash Can icon button to execute the delete feature.
