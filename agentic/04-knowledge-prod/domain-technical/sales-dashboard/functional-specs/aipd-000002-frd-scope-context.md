<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/Functional Requirement Document.md
Source-Version: 2026.04.03 16.18.42
Sections: Document Purpose, Scope, Intended Users, Functional Context
-->

# **FRD: Scope & Context (AIPD-000002)**

## **1. Document Purpose**

This document defines the functional requirements for the **Sales Dashboard** feature based on the approved Business Requirement Document (BRD).

The purpose of this feature is to provide Sales Managers and Analysts with a highly responsive, unified interface for real-time tracking of macro and micro revenue metrics.

---

## **2. Scope**

### **2.1. In Scope**

1. **Temporal Context Switching**: Allowing the user to toggle the dashboard scope (Weekly, Monthly, Quarterly, Annually).
2. **Aggregated Data Fetching**: Fetching sum of revenues and transaction counts bounded by the selected timeframe.
3. **Automated Currency Conversion**: Processing all raw transactions to USD at the exchange rate corresponding to the date of transaction.
4. **Timezone Normalization**: Shifting UTC time-boundaries based on the user's local browser timezone offset.

### **2.2. Out of Scope**

1. Exporting metrics to PDF, CSV, or Excel files.
2. Item-level metric tracking (Top-Selling Items) or conversion rates.

---

## **3. Intended Users**

* Chief Revenue Officer (CRO)
* Regional Sales Directors
* Sales Operations Analysts

---

## **4. Functional Context**

* **React (Client)**, **NestJS (REST API Backend)**, **MongoDB (Database) & Redis (Cache)**
* All MongoDB aggregations must calculate dates correctly considering leap years and varying month lengths.
* The API must deliver responses under 1.5 seconds, heavily relying on Redis for Annually/Quarterly endpoints.
* The Sales Dashboard is categorized as a **read-only query-based screen**.
