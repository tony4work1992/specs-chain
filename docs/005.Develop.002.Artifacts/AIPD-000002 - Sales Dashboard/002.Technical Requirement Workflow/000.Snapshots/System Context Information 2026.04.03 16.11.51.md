# **SYSTEM CONTEXT INFORMATION**

**Request Version:** 2026.04.03 12.38.08
**Version:** 2026.04.03 12.38.08
**Parent Version:** 2026.04.03 10.34.16

## **Project / Feature: Sales Dashboard (AIPD-000002)**

---

## **1. Document Purpose**

This document outlines the high-level technical context, architectural constraints, and system environment for **Sales Dashboard (AIPD-000002)**. It serves as a foundational reference for Technical Requirement Workflows (such as FRD generation) by Solution Architects and System Builders.

---

## **2. Core Technology Stack**

* **Frontend Framework:** React.js
* **Backend Framework:** NestJS
* **Programming Languages:** TypeScript (End-to-End)
* **Mobile Environment:** Not Applicable (Desktop-focused web interface)
* **UI/UX Core Libraries:** Material UI (MUI), Recharts (for complex temporal visualizations)

---

## **3. Database & Storage Architecture**

* **Primary Relational Database:** PostgreSQL (for Role-Based Access Control and user identity relations)
* **Primary NoSQL Database:** MongoDB 7 (for persisting and indexing massive sets of sales records)
* **Caching & In-Memory Store:** Redis (CRITICAL for achieving sub-5-minute data latency metrics and serving fast temporal UI toggles without database load)
* **File & Object Storage:** AWS S3 (for short-lived temporary storage of generated PDF/CSV export snapshots)
* **Message Broker / Streaming:** Not Required locally, assuming direct polling or Webhook sync over HTTP from the CRM.

---

## **4. System Architecture & Design Patterns**

* **Architecture Style:** Monolithic Backend supporting API integrations.
* **Core Design Patterns:** CQRS (Command Query Responsibility Segregation) - separating heavy read aggregations (growth math, time-series distributions) from transactional updates.
* **Communication Protocols:** REST API for core operations; WebSockets / Server-Sent Events (SSE) for pushing real-time dashboard state updates.
* **Authentication & Authorization:** JWT with strict Role-Based Access Control (RBAC) payload validation enforced directly at the Controller/Repository boundary.

---

## **5. Infrastructure & Deployment Environment**

* **Hosting Provider:** AWS / Local Docker 
* **Containerization & Orchestration:** Docker (Docker Compose for local isolation environment)
* **CI/CD Pipeline:** GitHub Actions
* **Environment Setup:** Local, Staging, Production

---

## **6. Integration & External Dependencies**

* **Payment Gateways:** Not Applicable
* **Communication Services:** Not Applicable
* **Internal Core Systems:** Existing Enterprise CRM / Data Lake providing the raw source of truth for "Booked/Billed" temporal revenue.
* **Third-Party APIs:** Puppeteer or similar headless-chrome microservice integration for robust server-side PDF snapshot rendering.

---

## **7. Key Technical Mechanisms**

* **Background Processing & Cron Jobs:** Background cron jobs in NestJS orchestrating the fetching and synchronization of CRM delta records into the dashboard's optimized Read Database every 5 minutes.
* **Data Migration & Synchronization:** Fast ETL routines mapping raw external CRM entities into denormalized temporal structures optimized exclusively for fast UI rendering.
* **Logging & Monitoring:** Standard production centralized logging for tracking slow queries, particularly monitoring PDF export computation duration.
* **Error Handling & Retry Mechanisms:** Circuit breaker logic when fetching from the primary CRM API to prevent cascading thread starvation if the CRM goes offline.

---

## **8. Constraints & Assumptions**

* **Technical Constraints:** PDF rendering operations are tightly constrained and capped at 12-month data slices to strictly prevent Node.js memory overflow during high-concurrency End-of-Month reporting.
* **Technical Assumptions:** The external CRM/Database supports high-frequency delta querying (updated_at > last_sync) every 5 minutes without imposing harsh rate limits.

---

## **9. Specific Feature Configurations (If applicable)**

* **Recharts / Chart.js:** Core frontend module for rendering reactive Time-Series growth graphs completely free of page reloads.
* **pdfmake / puppeteer:** Node.js backend module utilized to construct structured binary PDF buffers asynchronously matching the user's filtered UI state.

---

## **10. Component Registry**

Define the finite, explicit list of all architectural components involved in this system. This exact list will map directly to Functional Specifications and Testing Requirements boundaries.

* **[Component 1]:** React Client Dashboard
* **[Component 2]:** NestJS REST API Gateway
* **[Component 3]:** NestJS Background Cron Poller
* **[Component 4]:** Postgre Database (RBAC)
* **[Component 5]:** MongoDB 7 (Bookings Collection)
* **[Component 6]:** Redis Cache Cluster
* **[Component 7]:** External CRM Integration
* **[Component 8]:** Puppeteer PDF Worker
* **[Component 9]:** AWS S3 Object Storage
