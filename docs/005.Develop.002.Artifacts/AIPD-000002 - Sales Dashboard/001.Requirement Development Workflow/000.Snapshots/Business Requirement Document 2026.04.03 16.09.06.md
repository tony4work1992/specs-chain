# **BUSINESS REQUIREMENT DOCUMENT (BRD)**

**Request Version:** 2026.04.03 10.34.16
**Version:** 2026.04.03 10.34.16
**Parent Version:** 2026.04.03 10.28.26

## **Feature: Sales Dashboard (AIPD-000002)**

---

## **1. Purpose**

The purpose of the **Sales Dashboard** is to provide Sales Management and Operational Teams with an authoritative, unified real-time data visualization capability. 

The feature enables Leadership and Analysts to:

* Monitor continuous temporal revenue figures (Weekly, Monthly, Quarterly, Annually) seamlessly without manual data crunching.
* Instantly measure chronological growth percentages to determine the real-time health of the business.
* Make immediate, data-driven operational decisions backed by strictly governed, role-isolated metrics.

---

## **2. Scope Definition**

### **2.1. In Scope**

The feature includes:

* Implementation of a master Temporal Metric Control Panel for dynamic slice toggling.
* Calculation engines for strictly paired historical Growth Indicators (e.g., Year-over-Year).
* Strict Role-Based Access Control (RBAC) ensuring data visibility boundaries per user level.
* Synchronous PDF and CSV data exporting mechanisms for snapshot reporting.
* High-volume data integration capabilities satisfying near real-time rendering.

---

### **2.2. Out of Scope**

The following are not included in this feature:

* The actual ingestion and ETL pipelines from external 3rd-party CRMs (Assumed to be handled by a separate Data Lake/API layer).
* Advanced AI-based predictive forecasting or machine learning trend estimations (Dashboard focuses solely on historical and current booked data).
* Input forms for manually altering or editing sales records through the dashboard UI.

---

## **3. Stakeholders**

* **Primary Stakeholders:**

  * Sales Managers / Directors
  * Sales Operations / Analysts

* **Secondary Stakeholders:**

  * System Architecture & Data Engineering Teams (responsible for providing the real-time aggregated endpoints).
  * Executive Leadership (Consumers of the exported PDF business reports).

---

## **4. Business Objectives**

* **Efficiency:** Decrease time spent generating weekly and monthly revenue summaries by 80%.
* **Speed to Insight:** Facilitate sub-5-minute latency visualizations between a CRM record closing and its reflection on the dashboard.
* **Security:** Guarantee 100% adherence to organizational data isolation rules via strictly enacted RBAC.

---

## **5. Functional Overview**

The Sales Dashboard is structured into 3 main sections:

---

### **5.1. Temporal Metric Control & Data Exporting**

* Provide interactive controls allowing the user to seamlessly pivot the entire dashboard's context across Weekly, Monthly, Quarterly, and Annually spans.
* Provide one-click generation of PDF/CSV reports mirroring the current temporal context.

---

### **5.2. Core Revenue & Growth KPIs**

* Display authoritative total sales revenue for the selected timeframe.
* Compute and display positive or negative percentage growth against the exact chronologically equivalent prior period.

---

### **5.3. Distribution Visualizations**

* Render time-series graphs distributing the chosen metric across the specified temporal spans (e.g., 12 column indicators for a Yearly view).

---

## **6. Business Rules**

* **BR-01 (Role Isolation):** A user holding an 'Account Executive' role shall ONLY view aggregated data corresponding structurally to their owned portfolio. 'Sales Managers' inherit global viewing privileges.
* **BR-02 (Growth Math Integrity):** Growth percentages formulas MUST evaluate strictly equivalent chronological days. (e.g., 'Quarter-to-Date' must be compared only to the exact equivalent number of days from the start of the previous Quarter, not the full previous Quarter).
* **BR-03 (Export Engine Limit):** Users shall not invoke a PDF export containing a data spread exceeding a 12-month temporal scope to protect server rendering resources.

---

## **7. Non-Functional Requirements**

* **Usability:**

  * Toggling the Temporal Metric Control Panel (e.g., switching from Weekly to Monthly) must asynchronously update the dashboard Data Views without causing a full browser page reload.

* **Performance:**

  * The dashboard must target a data freshness latency of under 5 minutes from the central data source.
  * PDF and CSV data exports must complete processing and downloading within 10 seconds of user invocation.

---

## **8. Assumptions**

* The underlying Data Source or CRM already calculates "Booked vs. Billed" revenue cleanly and exposes it natively through standard API endpoints.
* Valid user session tokens contain accurately mapped RBAC role definitions that the backend can consume securely.

---

## **9. Constraints**

* The backend infrastructure must be sized to support potentially heavy concurrent PDF rendering operations at common reporting times (e.g., End of Month).
* The dashboard's visual clarity relies heavily on the availability of standardized modern charting UI libraries (e.g., Recharts, Chart.js).
