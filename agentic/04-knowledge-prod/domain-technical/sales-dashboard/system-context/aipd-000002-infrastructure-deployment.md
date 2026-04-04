<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/System Context Information.md
Source-Version: 2026.04.03 16.24.10
Sections: Infrastructure & Deployment Environment, Integration & External Dependencies, Key Technical Mechanisms
-->

# **System Context: Infrastructure & Deployment (AIPD-000002)**

## **Infrastructure & Deployment Environment**

* **Containerization & Orchestration:** Docker Compose (for scaffolding NestJS, MongoDB, and Redis locally/production).
* **Environment Setup:** Local Development environments replicating Staging.
* **High-Availability (HA) SLA:** 99.9% uptime SLA mandated for Production MongoDB and Redis, achieved via single-region multi-zone distribution.

---

## **Integration & External Dependencies**

* **Third-Party APIs:** Currency Exchange Rate API (e.g., OpenExchangeRates or alternative) for daily USD normalization.
* **Internal Core Systems:** Main System Authentication service via JWKS.

---

## **Key Technical Mechanisms**

* **Background Processing & Cron Jobs:** A background cron worker to fetch and cache daily currency exchange rates at 00:00 UTC. The worker applies a 3-retry policy at 1-hour intervals on failure, subsequently falling back to the previous day's rate upon exhaustion.
* **Data Synchronization:** Dynamic currency conversion calculation mechanism during data aggregation.
* **Aggregated Caching Mechanism:** Caching strategy in Redis for frequently requested structural datasets (like Annual view), invalidated upon new transaction arrival.
