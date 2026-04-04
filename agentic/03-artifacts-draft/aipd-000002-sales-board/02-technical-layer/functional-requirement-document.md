# **FUNCTIONAL REQUIREMENT DOCUMENT (FRD)**

**Request Version:** 2026.04.03 16.18.42
**Version:** 2026.04.03 16.18.42
**Parent Version:** 2026.04.03 16.09.06

## **Feature: Sales Dashboard (AIPD-000002)**

---

## **1. Document Purpose**

This document defines the functional requirements for the **Sales Dashboard** feature based on the approved Business Requirement Document (BRD).

The purpose of this feature is to provide Sales Managers and Analysts with a highly responsive, unified interface for real-time tracking of macro and micro revenue metrics.

This document describes:

* Functional scope
* User interactions
* Screen behavior
* Data presentation requirements
* Functional processing expectations
* System behavior relevant to the feature

---

## **2. Scope**

---

### **2.1. In Scope**

The Sales Dashboard feature includes the following functions:

1. **Temporal Context Switching**: Allowing the user to toggle the dashboard scope (Weekly, Monthly, Quarterly, Annually).
2. **Aggregated Data Fetching**: Fetching sum of revenues and transaction counts bounded by the selected timeframe.
3. **Automated Currency Conversion**: Processing all raw transactions to USD at the exchange rate corresponding to the date of transaction.
4. **Timezone Normalization**: Shifting UTC time-boundaries based on the user's local browser timezone offset.

---

### **2.2. Out of Scope**

The following functions are excluded from this feature:

1. Exporting metrics to PDF, CSV, or Excel files.
2. Item-level metric tracking (Top-Selling Items) or conversion rates.

---

## **3. Intended Users**

The feature is intended for Internal Sales Management, including:

* Chief Revenue Officer (CRO)
* Regional Sales Directors
* Sales Operations Analysts

---

## **4. Functional Context**

The system is implemented using:

* **React (Client)**
* **NestJS (REST API Backend)**
* **MongoDB (Database) & Redis (Cache)**

For avoidance of doubt:

* All MongoDB aggregations must calculate dates correctly considering leap years and varying month lengths.
* The API must deliver responses under 1.5 seconds, heavily relying on Redis for Annually/Quarterly endpoints.

For this feature, the Sales Dashboard is categorized as a **read-only query-based screen**.

---

## **5. Functional Requirements**

---

### **5.1. Dashboard Navigation & Control**

#### **FR-000001: Temporal Toggle Switch State**

The UI must present a 4-state toggle (Weekly, Monthly, Quarterly, Annually). The default state upon initial load must be "Monthly". Changing this toggle must immediately trigger an API re-fetch for all visible dashboard components, passing the new boundary scope.

#### **FR-000002: Contextual Client Timezone Dispatch**

Every API Request triggered by the Temporal Toggle must include headers containing the Client's `X-Timezone-Offset` to inform the backend of the necessary boundary shift against UTC records.

---

### **5.2. Core Performance Indicators**

#### **FR-000003: Aggregate Revenue Calculation Logic**

The backend must sum the `transaction_amount` of all documents where `status = 'completed'` and the `transaction_date` falls within the provided Unix Timestamp boundaries. Before summing, foreign currencies must be converted to USD using the rate stored for that exact `transaction_date`.

#### **FR-000004: Period-over-Period Growth Calculation**

The API must calculate the exact same revenue sum for the mathematically equivalent preceding period (e.g., if querying Q3 2026, the prior period is Q2 2026). The growth percentage is calculated as `((Current - Prior) / Prior) * 100`.

---

## **6. Functional Behavior**

---

### **6.1. Currency Exchange Processing**

#### **FR-000005: 00:00 UTC Rate Ingestion**

A NestJS Cron Job must fire at 00:00 UTC daily to fetch the latest USD rates from the defined Third-Party API and store it in MongoDB. If the API fails, the system must retry after 1 hour, failing over sequentially up to 3 times before falling back to the previous day's rate.

---

### **6.2. Caching Strategy**

#### **FR-000006: Redis Cache Invalidation**

When a new transaction is recorded via the distinct Write API, an event must be emitted to invalidate the `dashboard:sales:annually` and `dashboard:sales:quarterly` Redis keys to ensure the Dashboard reads eventually consistent data.

---

## **7. Data Presentation Requirements**

---

### **7.1. Formatting Rules**

#### **FR-000007: Currency Presentation**

All revenue values must be presented with the `$` prefix and rounded to 2 decimal places. Values exceeding 1,000,000 should be abbreviated (e.g., "$1.24M").

#### **FR-000008: Percentage Growth Indicator**

Positive growth percentages must be prefixed with `+` and displayed in Green (#4CAF50). Negative percentages must be prefixed with `-` and displayed in Red (#F44336).

---

### **7.2. Visual Requirements**

#### **FR-000009: Time-Series Revenue Chart**

The chart must dynamically scale its X-axis based on the Temporal Scope:
- Weekly: 7 data points (Days: Mon-Sun)
- Monthly: 4-5 data points (Weeks)
- Quarterly: 3 data points (Months)
- Annually: 12 data points (Months: Jan-Dec)

---

## **8. System Processing Considerations**

This section reflects the provided technical context only and does not add business requirements.

### **8.1. Backend Structure**

The system shall implement the feature within the existing backend architecture based on:

* NestJS CQRS Handlers (specifically separating Query Handlers for Dashboard distinct from Command Handlers for Checkouts).
* Middleware intercepting `X-Timezone-Offset` for scoped aggregation in Mongoose.

### **8.2. Long-Running Task Processing**

The daily Currency Rate Fetcher constitutes a robust background worker utilizing NestJS `@Cron` decorators and an independent database collection log to audit rate ingest failures.

---

## **9. Assumptions**

1. The underlying transaction schema natively stores `currency_code` (e.g., EUR, JPY) alongside the numeric amount.
2. A valid JWT access token is always present upon dashboard load.

---

## **10. Constraints**

1. Performance requirement dictates Redis must be active; if Redis is down, the system should degrade to slow DB queries but log a critical alert.
2. Only data conforming to the standard Gregorian calendar is supported.

---

## **11. Traceability to BRD**

This FRD expands the following BRD areas without adding new requirements:

* BRD Section 5.1 (Dashboard Navigation) -> FR-000001, FR-000002
* BRD Section 5.2 (Core KPIs) -> FR-000003, FR-000004
* BRD Section 6 (Business Rules: Currency/Timezone) -> FR-000005

---

## **12. Summary**

The Sales Dashboard feature provides Sales Management with high-performance, temporally accurate revenue tracking. All data is controlled by pure UTC timestamps mapped via client-timezone constraints, and must remain sub-1.5s responsive through caching optimizations.
