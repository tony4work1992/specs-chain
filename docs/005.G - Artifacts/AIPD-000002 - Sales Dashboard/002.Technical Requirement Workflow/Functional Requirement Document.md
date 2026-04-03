# **FUNCTIONAL REQUIREMENT DOCUMENT (FRD)**

**Request Version:** 2026.04.03 10.57.45
**Version:** 2026.04.03 10.57.45
**Parent Version:** 2026.04.03 10.56.16

## **Feature: Sales Dashboard (AIPD-000002)**

---

## **1. Document Purpose**

This document defines the functional requirements for the **Sales Dashboard** feature based on the approved Business Requirement Document (BRD) and the detailed System/Architecture constraints.

The purpose of this feature is to provide Sales Reps and Managers with a real-time, temporally reactive data visualization hub for Revenue and Growth tracking.

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

1. Server-Sent Events (SSE) streaming pipeline for real-time dashboard mutation.
2. Background NestJS Cron job fetching 5-minute CRM delta updates.
3. Temporal Math Calculation Engine for determining exact Growth formulas against normalized UTC Timezones.
4. Asynchronous PDF/CSV Export execution cap-limited to 12-month data slices, with strict AWS S3 memory sweeps.
5. In-Memory caching failover algorithms and Field-Level Data Encryption.

---

### **2.2. Out of Scope**

The following functions are excluded from this feature:

1. In-dashboard editing/mutation of sales record items (Read-Only Application).
2. Advanced AI or Machine Learning predictive forecasting algorithms.
3. Architecture outside of Dockerized container bounds.

---

## **3. Intended Users**

The feature is intended for Operational Sales Teams, including:

* Account Executives / Sales Representatives (Local View)
* Sales Managers / Operations Analysts (Global View)

---

## **4. Functional Context**

The system is implemented using:

* **React.js & Recharts (Frontend)**
* **NestJS & Redis/MongoDB 7 (Backend)**
* **CQRS Architecture & Docker Containerization (Backend Pattern)**

For avoidance of doubt:

* The system assumes underlying external CRMs are healthy and accessible.
* A strict Role-Based Access Control (RBAC) payload will be attached to every incoming API query interceptor.

For this feature, the Sales Dashboard is categorized as a **read-only query-based screen**.

---

## **5. Functional Requirements**

---

### **5.1. Dashboard Telemetry & Background Processing**

#### **FR-001: CRM Delta Polling Service**

A dedicated NestJS Cron job must execute every 5 minutes polling the primary external CRM for records modified (`updated_at`). The payload shall be mapped and upserted into the `MongoDB` Read Cache. 

#### **FR-002: Real-time UI Streaming Pipeline**

Upon successful Upsert into MongoDB, the backend shall push an invalidation payload via Server-Sent Events (SSE) to active client React components causing silent background refetches.

---

### **5.2. Metrics, Math, and Temporal Queries**

#### **FR-003: Growth Calculus & Timezone Normalization**

All calculation endpoints mapping temporal boundaries MUST standardize boundary truncations at UTC Midnight (`00:00:00Z`). Growth percentage must compare the exact equivalent number of past days to present days.

#### **FR-004: Revenue Attribution Lock**

When calculating past KPIs on Deal records transferred to new Sales Reps, the revenue shall permanently attribute to the user who explicitly owned the record at the exact timestamp of closure.

---

## **6. Functional Behavior**

---

### **6.1. Export & Asynchronous Behaviors**

#### **FR-005: Bounded PDF Export Engine**

When a User clicks "Export PDF", the system shall offload the active JSON state parameter to a `Puppeteer` background queue. If the requested temporal span exceeds exactly 12 months, the backend must immediately reject the HTTP request with a `400 Bad Request`.

#### **FR-006: Temporary Artifact Lifecycle (AWS S3)**

All generated PDF and CSV exported files persisted to the object storage endpoint MUST be tagged with an explicit 24-hour expiration policy, ensuring AWS S3 automatic cleanup triggers to avoid storage inflation.

---

### **6.2. Exception and Recovery Strategies**

#### **FR-007: Redis Cache Failover Degradation**

If the primary Redis caching cluster becomes unresponsive or goes Out of Memory during peak End of Month reporting, the backend query handlers must seamlessly bypass the cache and query MongoDB directly, ensuring the application remains alive (even if response latency degrades above 5 minutes).

---

## **7. Data Presentation Requirements**

---

### **7.1. Formatting Rules**

#### **FR-008: Currency Serialization**

All monetary Revenue payloads transported traversing to the frontend must be formatted in strictly standard decimal structure (`$#,##0.00`).

---

### **7.2. Visual Requirements**

#### **FR-009: Visual Chart Tooltips (Recharts)**

Line Charts representing Temporal Trends must provide Hover Tooltips displaying the exact isolated Date and the Revenue increment at that plot point.

---

## **8. System Processing Considerations**

This section reflects the provided technical context only and does not add business requirements.

### **8.1. Backend Structure**

The system shall implement the feature within the existing backend architecture based on:

* CQRS Command and Query Bus separation for independent Read heavy scaling.
* Containerized multi-stage Docker builds: The microservice handling Puppeteer must use targeted base images (e.g. Node Alpine) avoiding heavy Chromium installation bloat in the primary API nodes.

### **8.2. Data Security at Rest**

Given the extreme sensitivity of Booked/Billed Sales Revenue, the persistence layer MUST implement Transparent Data Encryption (TDE) or Field-Level Encryption within MongoDB to guarantee data is secure while persisting at rest.

---

## **9. Assumptions**

1. Authentication headers carry distinct and trusted RBAC territory definitions verifiable by the backend.
2. Legacy CRM API tokens are not subject to restrictive rate limiting for 5-minute poller cadences.

---

## **10. Constraints**

1. Puppeteer memory pools are limited; capping at 12-months data for PDF buffers is a hard technical enforcement.
2. Visual interface must operate entirely seamlessly without heavy multi-second loader spinners during normal use.

---

## **11. Traceability to BRD**

This FRD expands the following BRD areas without adding new requirements:

* **BR-02 (Growth Math Integrity)** translates to **FR-003 & FR-004**.
* **BR-03 (Export Engine Limit)** translates to **FR-005**.
* **Non-Functional Performance Constraints** translate to **FR-001 & FR-002**.

---

## **12. Summary**

The Sales Dashboard feature provides Operational Sales Teams with instantaneous, strictly-calculated Temporal Growth tracking interfaces. All information is controlled by stringent RBAC logic, UTC-normalized metrics, Field-Level encryption, and rigorous crash fallback systems, remaining fast, scalable, and memory-efficient.
