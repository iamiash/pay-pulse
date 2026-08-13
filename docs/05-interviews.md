# 05. Stakeholder Interview Transcripts

Interviews conducted with software professionals and students highlighted key requirements for multi-payment tracking and automated alerts.

### Interview Summary 1: Full-Stack Engineer
* **Feedback**: "I use Github Copilot, AWS, Vercel, and Spotify across three different credit cards and my City Bank account. I need a tool that encrypts sensitive card credentials and shows me which specific card is billed for which tool."
* **System Impact**: Implemented AES Fernet field-level encryption for card numbers, CVCs, and bank routing details in SQLite, with encrypted card mappings in `SubscriptionDetailModal.tsx`.

### Interview Summary 2: Digital Content Creator
* **Feedback**: "I need month-to-month expense reports for tax write-offs. A simple dashboard view isn't enough—I need to download structured PDF summaries filtered by date range."
* **System Impact**: Built ReportLab PDF generation engines supporting custom month-to-month and service-specific exported reports.