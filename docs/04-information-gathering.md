# 04. Information Gathering & Technical Research

Requirements for PayPulse were gathered by analyzing consumer budgeting workflows and evaluating financial encryption standards.

### Research Discoveries
1. **Payment Variety Necessity**: Local market users rely on a mixture of traditional credit/debit cards (Visa, Mastercard, Amex, Nexus), bank account transfers, and regional mobile banking services (bKash, Nagad, Rocket).
2. **Inline Workflow Expectation**: Users reject multi-step forms that force them to abandon a subscription setup workflow to create a payment method elsewhere. PayPulse addresses this via inline creation modals inside subscription form dropdowns.
3. **Alert Timing**: Research indicates a 7-day notice window provides sufficient lead time for users to evaluate, downgrade, or manually cancel unwanted recurring subscriptions before billing cycles execute.
4. **DevTools Operability**: Developers and evaluators require explicit HTTP status codes and structured JSON response payloads to trace API failures during frontend/backend integration testing.