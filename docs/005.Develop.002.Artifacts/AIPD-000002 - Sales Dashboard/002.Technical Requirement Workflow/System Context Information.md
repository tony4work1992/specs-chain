# **SYSTEM CONTEXT INFORMATION**

**Request Version:** 2026.04.03 16.11.51
**Version:** 2026.04.03 16.24.10
**Parent Version:** 2026.04.03 16.09.06

## **Project / Feature: Sales Dashboard (AIPD-000002)**

---

## **1. Document Purpose**

This document outlines the high-level technical context, architectural constraints, and system environment for **Sales Dashboard**. It serves as a foundational reference for Technical Requirement Workflows (such as FRD generation) by Solution Architects and System Builders to ensure the underlying backend, database, and frontend architectures adequately support the high-performance revenue aggregation demands.

---

## **2. Core Technology Stack**

Detail the primary technologies used to build and operate this application/feature.

* **Frontend Framework:** React 
* **Backend Framework:** NestJS (Node.js) to support modular API slices
* **Programming Languages:** TypeScript (Strict end-to-end type safety)
* **Mobile Environment:** Responsive Web (Mobile-first browser support, no native app for Phase 1)
* **UI/UX Core Libraries:** Material UI (MUI) for standardized components, Recharts for Temporal Time-Series graphing.

---

## **3. Database & Storage Architecture**

Define the data persistence and caching mechanisms.

* **Primary Database:** MongoDB 7 (Handling transaction persistence and complex aggregation pipelines).
* **Caching & In-Memory Store:** Redis (For caching aggregated Weekly/Monthly/Quarterly buckets to meet the < 1.5s latency requirement).

---

## **4. System Architecture & Design Patterns**

Describe the architectural paradigms driving the implementation.

* **Architecture Style:** Monolithic API with decoupled React Client (Client-Server Architecture).
* **Core Design Patterns:** CQRS (Separating complex dashboard read queries from transaction write operations), Repository Pattern.
* **Communication Protocols:** REST API (JSON payloads).
* **Authentication & Authorization:** JWT validation via JWKS endpoint connected to the Internal Auth Microservice.

---

## **5. Infrastructure & Deployment Environment**

Provide context on how and where the system is hosted and run.

* **Containerization & Orchestration:** Docker Compose (for scaffolding NestJS, MongoDB, and Redis locally/production).
* **Environment Setup:** Local Development environments replicating Staging.
* **High-Availability (HA) SLA:** 99.9% uptime SLA mandated for Production MongoDB and Redis, achieved via single-region multi-zone distribution.

---

## **6. Integration & External Dependencies**

List external systems or third-party services the feature/system must interact with.

* **Third-Party APIs:** Currency Exchange Rate API (e.g., OpenExchangeRates or alternative) for daily USD normalization.
* **Internal Core Systems:** Main System Authentication service via JWKS.

---

## **7. Key Technical Mechanisms**

Describe specific technical procedures or mechanisms relevant to this feature.

* **Background Processing & Cron Jobs:** A background cron worker to fetch and cache daily currency exchange rates at 00:00 UTC. The worker applies a 3-retry policy at 1-hour intervals on failure, subsequently falling back to the previous day's rate upon exhaustion.
* **Data Synchronization:** Dynamic currency conversion calculation mechanism during data aggregation.
* **Aggregated Caching Mechanism:** Caching strategy in Redis for frequently requested structural datasets (like Annual view), invalidated upon new transaction arrival.

---

## **8. Constraints & Assumptions**

Define any architectural or technical limitations.

* **Technical Constraints:**
  * System must support an anticipated peak traffic load of 100 QPS scaling up to 500 Daily Active Users.
  * System must process and deliver aggregated temporal data to the frontend in under 1.5s.
  * All database operations must store timestamps in pure UTC.
* **Technical Assumptions:**
  * The frontend client will explicitly dispatch its Local Timezone Offset to the backend during API calls to allow proper aggregation boundaries dynamically.

---

## **9. Specific Feature Configurations (If applicable)**

List out specialized libraries or technical modules strictly related to the current feature requested in the BRD.

* **Date Management:** `date-fns` or `dayjs` on both Backend and Frontend for robust timezone manipulation and boundary calculation without excessive bundle size.
* **Charting Engine:** `recharts` for handling temporal distribution mapping natively in React.

---

## **10. Component Registry**

Define the finite, explicit list of all architectural components involved in this system. This exact list will map directly to Functional Specifications and Testing Requirements boundaries.

* **[Frontend Client]:** React-based Sales Dashboard UI application.
* **[Backend Component]:** NestJS REST API exposing secure Aggregation endpoints.
* **[Database Component]:** MongoDB instance storing raw and normalized transactions.
* **[Cache Layer]:** Redis instance caching heavy time-series JSON payloads.
* **[Background Worker]:** Currency Exchange Rate Scheduler (Cron-based within NestJS).
