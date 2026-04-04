<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/Functional Requirement Document.md
Source-Version: 2026.04.03 16.18.42
Sections: FR-000005, FR-000006
-->

# **FRD: Functional Behavior (AIPD-000002)**

## **1. Currency Exchange Processing**

### **FR-000005: 00:00 UTC Rate Ingestion**

A NestJS Cron Job must fire at 00:00 UTC daily to fetch the latest USD rates from the defined Third-Party API and store it in MongoDB. If the API fails, the system must retry after 1 hour, failing over sequentially up to 3 times before falling back to the previous day's rate.

---

## **2. Caching Strategy**

### **FR-000006: Redis Cache Invalidation**

When a new transaction is recorded via the distinct Write API, an event must be emitted to invalidate the `dashboard:sales:annually` and `dashboard:sales:quarterly` Redis keys to ensure the Dashboard reads eventually consistent data.
