# 10. User Journey Map
[ Unauthenticated User ]
│
├──► Register (Name, Email, Contact, DOB, Password)
├──► Login (JWT Issued) ──► Dashboard View
│
[ Authenticated Operations ]
├──► Add Wallet Items (Bank, Encrypted Card, Mobile Banking)
├──► Add Subscription ──► Select Payment Type ──► Auto-fills user details
│         │
│         └── [ If Payment Missing ] ──► Click "+ Add New" ──► Child Modal
│                                             │
│                                             └── Auto-selects new method in form
│
├──► Universal Search / Click Metric Cards ──► Open Detail Modal (Decrypted Details)
├──► Receive 7-Day Renewal Notification Badge
├──► Export PDF Report (Summary, History, Monthly, Filtered Range)
├──► Account Settings ──► Upload Avatar / Update Info (DOB Locked)
└──► Sign Out ──► Confirmation Modal ──► Session Cleared ──► Redirect to Login