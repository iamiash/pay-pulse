# 14. Non-Functional Requirements

### NFR-1: Performance & Response SLA
* Core REST API endpoints (`/subscriptions`, `/wallet`, `/notifications`) must respond within < 200ms under standard loads.
* PDF report generation must compile and stream binary blob payloads within < 1.5 seconds.

### NFR-2: Data Security & Privacy
* Zero raw CVC codes or complete card numbers stored in unencrypted plain text within SQLite.
* JWT tokens set with strict expiration windows.
* Password hashes salted with Bcrypt work factor >= 12.

### NFR-3: DevTools Traceability & Error Standard
* All API endpoints must return standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `422 Unprocessable Entity`, `500 Internal Server Error`).
* Axios interceptors in `client.ts` log request URLs, payload structures, and response codes to the browser DevTools console.

### NFR-4: UI Responsiveness & UX Standards
* Fully responsive layout styled with Tailwind CSS, supporting desktop, tablet, and mobile viewports.
* Toast notification alerts auto-dismiss after 5–7 seconds.