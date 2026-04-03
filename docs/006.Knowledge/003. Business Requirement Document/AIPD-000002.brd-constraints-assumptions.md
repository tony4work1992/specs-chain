<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 001.Requirement Development Workflow/Business Requirement Document.md
Source-Version: 2026.04.03 16.09.06
Sections: Non-Functional Requirements, Assumptions, Constraints
-->

# **BRD: Constraints & Assumptions (AIPD-000002)**

## **1. Non-Functional Requirements**

* **Performance:**
  * The dashboard must load aggregate metrics and update the UI within 1.5 seconds after the user switches the temporal toggle.

* **Usability:**
  * The user interface must gracefully handle empty states (e.g., a startup in its first month trying to view "Quarterly" data) by displaying informative placeholders rather than chart errors.

---

## **2. Assumptions**

* The underlying transaction database already accurately captures the transaction date, original currency, and successfully completed status for all historical sales.
* A reliable internal or third-party daily currency exchange rate API is already available to the backend system.

---

## **3. Constraints**

* The dashboard must be responsive but is primarily designed and constrained for Desktop and Tablet resolutions (min-width: 1024px) for Phase 1.
