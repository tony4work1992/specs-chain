<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/Functional Requirement Document.md
Source-Version: 2026.04.03 16.18.42
Sections: FR-000007 to FR-000009, System Processing, Assumptions, Constraints, Traceability
-->

# **FRD: Presentation & Constraints (AIPD-000002)**

## **1. Formatting Rules**

### **FR-000007: Currency Presentation**
All revenue values must be presented with the `$` prefix and rounded to 2 decimal places. Values exceeding 1,000,000 should be abbreviated (e.g., "$1.24M").

### **FR-000008: Percentage Growth Indicator**
Positive growth percentages must be prefixed with `+` and displayed in Green (#4CAF50). Negative percentages must be prefixed with `-` and displayed in Red (#F44336).

---

## **2. Visual Requirements**

### **FR-000009: Time-Series Revenue Chart**
The chart must dynamically scale its X-axis based on the Temporal Scope:
- Weekly: 7 data points (Days: Mon-Sun)
- Monthly: 4-5 data points (Weeks)
- Quarterly: 3 data points (Months)
- Annually: 12 data points (Months: Jan-Dec)

---

## **3. System Processing Considerations**

### **3.1. Backend Structure**
* NestJS CQRS Handlers (specifically separating Query Handlers for Dashboard distinct from Command Handlers for Checkouts).
* Middleware intercepting `X-Timezone-Offset` for scoped aggregation in Mongoose.

### **3.2. Long-Running Task Processing**
The daily Currency Rate Fetcher constitutes a robust background worker utilizing NestJS `@Cron` decorators and an independent database collection log to audit rate ingest failures.

---

## **4. Assumptions**
1. The underlying transaction schema natively stores `currency_code` (e.g., EUR, JPY) alongside the numeric amount.
2. A valid JWT access token is always present upon dashboard load.

---

## **5. Constraints**
1. Performance requirement dictates Redis must be active; if Redis is down, the system should degrade to slow DB queries but log a critical alert.
2. Only data conforming to the standard Gregorian calendar is supported.

---

## **6. Traceability to BRD**
* BRD Section 5.1 (Dashboard Navigation) -> FR-000001, FR-000002
* BRD Section 5.2 (Core KPIs) -> FR-000003, FR-000004
* BRD Section 6 (Business Rules: Currency/Timezone) -> FR-000005
