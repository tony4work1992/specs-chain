# **FUNCTIONAL REQUIREMENT DOCUMENT (FRD)**

**Request Version:** 2026.04.03 13.25.24
**Version:** 2026.04.03 13.25.24
**Parent Version:** 2026.04.03 10.34.16

## **Feature: Sales Dashboard (AIPD-000002)**

---

## **1. Document Purpose**

This document defines the functional requirements for the **Sales Dashboard** feature based on the approved Business Requirement Document (BRD).

The purpose of this feature is to provide Sales Management and Operational Teams with an authoritative, unified real-time data visualization capability.

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

1. Temporal Metric Control Panel for pivoting data across Weekly, Monthly, Quarterly, and Annually scopes.
2. Synchronous high-volume data querying from a denormalized MongoDB backend.
3. Core KPI generation with chronologically accurate Year-over-Year (YoY) and Period-over-Period growth formulas.
4. Role-Based Access Control (RBAC) payload evaluation gating data at the PostgreSQL identity relationship layer.
5. Snapshot reporting mechanisms bridging to a Puppeteer PDF rendering microservice.

---

### **2.2. Out of Scope**

The following functions are excluded from this feature:

1. End-to-End ETL pipelines (The backend accepts delta HTTP webhooks but does not pull massive external datasets arbitrarily).
2. Advanced AI or Machine Learning Predictive analytics.
3. Inline UI editing/updating of raw booked figures.

---

## **3. Intended Users**

The feature is intended for Internal Employees, including:

* Account Executives
* Sales Managers / Directors
* Sales Operations / Analysts
* Executive Leadership

---

## **4. Functional Context**

The system is implemented using the exact **Component Registry** boundaries:

* **[Component 1]: React Client Dashboard**
* **[Component 2 & 3]: NestJS REST API Gateway & Background Poller**
* **[Component 4 & 5]: PostgreSQL (RBAC) & MongoDB 7 (Bookings)**
* **[Component 6]: Redis Cache Cluster**
* **[Component 8 & 9]: Puppeteer PDF Worker & AWS S3**

For avoidance of doubt:

* The system enforces strict memory allocations during the Puppeteer PDF generation (12-month limit) to avoid cluster failures.
* Data queries are heavily offset onto the Redis Cache Cluster to satisfy sub-5-minute SLA latency.

For this feature, the Sales Dashboard is categorized as a **mission-critical read-only analytical module**.

---

## **5. Functional Requirements**

---

### **5.1. Temporal Metric Control & Data Exporting**

#### **FR-001: Global Temporal Context Switching**

The React Client Dashboard shall provide a dropdown or toggle group allowing users to select {Weekly, Monthly, Quarterly, Annually}. Selecting a value immediately triggers a state dispatch that re-fetches or re-calculates all visual data panes using the Redis cache without reloading the browser.

#### **FR-010: UI Race Condition & State Locking**

To prevent Context Collision during asynchronous operations, the React UI must completely lock the Temporal Context dropdown and display an impenetrable loading overlay while a PDF Export request is actively pending. Users cannot switch temporal contexts until the original RPC response concludes or times out.

#### **FR-002: PDF Snapshot Generation**

When a user clicks "Export PDF", the NestJS REST API Gateway shall serialize the current Temporal UI state constraints and pass them to the Puppeteer PDF Worker over HTTP/RPC.

---

### **5.2. Core Revenue & KPIs**

#### **FR-003: Authoritative Revenue Summation**

The system shall query MongoDB 7 executing aggregate `$sum` pipelines calculating total "Booked Revenue" matching the temporal boundary window exact to the UTC second.

#### **FR-004: strict Chronological Growth Math**

To compute growth percentage, the backend calculates: `((Current_Period_Revenue - Prior_Equivalent_Period_Revenue) / Prior_Equivalent_Period_Revenue) * 100`. The prior period must span the exact equivalent chronological days (e.g., matching Leap Years correctly).

---

### **5.3. Distribution Visualizations**

#### **FR-005: Time-Series Line Graphs**

The dashboard shall render responsive SVG elements (Recharts) mapping incremental revenue chunks over the designated temporal x-axis coordinates.

#### **FR-011: DOM Density Bucket Aggregation**

To prevent browser client-side DOM freeze from massive SVG point generation, the Backend must enforce server-side aggregation bucketing prior to payload delivery:
- If Temporal Scope = `Annually`, Backend groups `$sum` by Month (Maximum 12 columns).
- If Temporal Scope = `Monthly`, Backend groups `$sum` by Day (Maximum 31 columns).
- If Temporal Scope = `Quarterly`, Backend groups `$sum` by Week (Maximum 13 columns).

---

## **6. Functional Behavior**

---

### **6.1. Security & Data Isolation**

#### **FR-006: RBAC Payload Injection**

The NestJS REST API Gateway must intercept all incoming JWTs. If the identity layer (PostgreSQL) resolves the role as 'Account Executive', the API automatically injects a `WHERE owner_id = {user_id}` clause into EVERY MongoDB 7 pipeline execution.

---

### **6.2. Resource Protection Limitations**

#### **FR-007: 12-Month Hard Limit on Puppeteer**

If an execution command for the PDF Worker requests a temporal range spanning strictly > 365 days, the NestJS Gateway must short-circuit the request returning HTTP 400 immediately, protecting the Node event loop.

---

## **7. Data Presentation Requirements**

---

### **7.1. Formatting Rules**

#### **FR-008: Currency Serialization**

All monetary metrics must be formatted server-side using standard locale-aware string interpolation (e.g., `$1,234,567.89`) before reaching the UI mapping functions.

---

### **7.2. Visual Requirements**

#### **FR-009: Growth Color Context**

Growth percentages > 0% shall strictly render in Hex `#4CAF50` (Green). Growth < 0% shall strictly render in Hex `#F44336` (Red).

---

## **8. System Processing Considerations**

This section reflects the provided technical context only and does not add business requirements.

### **8.1. Backend Structure**

The system shall implement the feature within the existing backend architecture based on:

* NestJS CQRS Handlers bridging the API payloads explicitly to Redis/Mongo without exposing business logic in Controllers.
* Direct memory allocation monitoring on the Puppeteer K8s Pods.

### **8.2. Background CRM Polling & Cache Invalidation**

The NestJS Background Cron Poller operates on a strictly defined `*/5 * * * *` interval checking the External CRM Integration for `$gt: last_sync` records, subsequently upserting to MongoDB 7.

Immediately upon a successful MongoDB 7 upsert batch conclusion, the Cron Poller must fire a synchronous EventBus trigger compelling the Redis Cache Cluster to surgically execute `DEL sales:aggregate:*` (Cache Invalidation). This guarantees the UI does not perpetually serve stale metrics after the CRM sync finishes.

---

## **9. Assumptions**

1. The External CRM Integration endpoints reliably provide valid chronologically ascending timestamps for the delta sync mechanism.
2. The user has a modern Chromium/WebKit browser capable of rendering SVGs smoothly.

---

## **10. Constraints**

1. API payload limits are strictly throttled.
2. The dashboard cannot show real-time "live ticking" figures (Data is inherently snapshotted with a 5-minute jitter due to the Chron Poller architecture).

---

## **11. Traceability to BRD**

This FRD expands the following BRD areas without adding new requirements:

* BR-01 (Role Isolation) -> Expanded in FR-006 (RBAC Injection).
* BR-02 (Growth Math Integrity) -> Expanded in FR-004 (Chronological Growth Math)
* BR-03 (Export Engine Limit) -> Expanded in FR-007 (12-Month Hard Limit).

---

## **12. Summary**

The Sales Dashboard feature provides Internal Stakeholders with an authoritative real-time macro-financial viewport. All information is controlled by strict RBAC constraints mapped through PostgreSQL and must remain hyper-performant using Redis aggregations bounded under 5-minute CRM sync cycles.
