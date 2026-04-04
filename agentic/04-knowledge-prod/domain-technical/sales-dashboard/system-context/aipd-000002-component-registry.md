<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/System Context Information.md
Source-Version: 2026.04.03 16.24.10
Sections: Component Registry, Constraints & Assumptions
-->

# **System Context: Component Registry (AIPD-000002)**

## **Component Registry**

The finite, explicit list of all architectural components involved in this system. This exact list maps directly to Functional Specifications and Testing Requirements boundaries.

* **[Frontend Client]:** React-based Sales Dashboard UI application.
* **[Backend Component]:** NestJS REST API exposing secure Aggregation endpoints.
* **[Database Component]:** MongoDB instance storing raw and normalized transactions.
* **[Cache Layer]:** Redis instance caching heavy time-series JSON payloads.
* **[Background Worker]:** Currency Exchange Rate Scheduler (Cron-based within NestJS).

---

## **Constraints & Assumptions**

* **Technical Constraints:**
  * System must support an anticipated peak traffic load of 100 QPS scaling up to 500 Daily Active Users.
  * System must process and deliver aggregated temporal data to the frontend in under 1.5s.
  * All database operations must store timestamps in pure UTC.
* **Technical Assumptions:**
  * The frontend client will explicitly dispatch its Local Timezone Offset to the backend during API calls to allow proper aggregation boundaries dynamically.
