<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/System Context Information.md
Source-Version: 2026.04.03 16.24.10
Sections: Database & Storage Architecture
-->

# **System Context: Database Architecture (AIPD-000002)**

## **Database & Storage Architecture**

* **Primary Database:** MongoDB 7 (Handling transaction persistence and complex aggregation pipelines).
* **Caching & In-Memory Store:** Redis (For caching aggregated Weekly/Monthly/Quarterly buckets to meet the < 1.5s latency requirement).
