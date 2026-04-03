# **BUSINESS REQUIREMENT DOCUMENT (BRD)**

**Request Version:** 2026.04.03 16.09.06
**Version:** 2026.04.03 16.09.06
**Parent Version:** 2026.04.03 16.07.13

## **Feature: Sales Dashboard (AIPD-000002)**

---

## **1. Purpose**

The purpose of the **Sales Dashboard** is to provide Sales Management and Operational Teams with a highly responsive, unified interface for real-time tracking of macro and micro revenue metrics.

The feature enables Sales Managers and Analysts to:

* Instantly pivot the entire dashboard's context across distinct temporal milestones (Weekly, Monthly, Quarterly, Annually).
* Accurately track historical revenue generation against prior periods to deduce growth or decline patterns.
* Standardize global revenue reporting to a single source of truth, removing timezone and currency discrepancies.

---

## **2. Scope Definition**

### **2.1. In Scope**

The feature includes:

* A global Temporal Filtering Controller controlling the time-horizon for the entire view.
* Primary KPI Overview cards (Revenue Snapshot, Period Growth Indicator, Transaction Volume).
* Time-Series Revenue Chart for comparative temporal distribution over the selected period.
* Automatic currency conversion to a base currency (USD) mapping to the transaction day's rate.
* Timezone normalization logic translating UTC database records to the user's localized browser timezone.

---

### **2.2. Out of Scope**

The following are not included in this feature:

* Top-selling products leaderboards and granular item-level metrics (Deferred to Phase 2).
* Sales pipeline conversion rate analytics (Deferred to Phase 2).
* Exporting reports to PDF or Excel formats.

---

## **3. Stakeholders**

* **Primary Stakeholders:**

  * Chief Revenue Officer (CRO)
  * Regional Sales Directors

* **Secondary Stakeholders:**

  * Sales Operations Analysts
  * Financial Planning & Analysis (FP&A) Team

---

## **4. Business Objectives**

* **Increase Reporting Efficiency:** Reduce the time required for sales managers to aggregate quarterly and annual performance by 80%.
* **Standardize Metrics:** Enforce a single standard for global timezone aggregation and currency conversion.
* **Enhance Decision Making:** Provide immediate visual cues for period-over-period growth or loss to allow for mid-quarter tactical pivots.

---

## **5. Functional Overview**

The Sales Dashboard is structured into 2 main sections:

---

### **5.1. Dashboard Navigation & Control**

* **Temporal Toggle Switch:** The system must provide a master toggle allowing the user to select 'Weekly', 'Monthly', 'Quarterly', or 'Annually'.
* **Global Context Linking:** All data visualizations and KPIs on the page must re-fetch and re-render automatically upon changing the temporal toggle.

---

### **5.2. Core Performance Indicators & Visualization**

* **Aggregate Revenue & Volume Calculation:** The system must sum all closed transactions within the defined temporal boundaries and display the absolute revenue amount alongside total transaction count.
* **Percentage Growth Calculation:** The system must compare current period revenue to the exact prior equivalent period and render an upward/downward percentage indicator.
* **Time-Series Charting:** The system must map the summed data onto a sequence chart representing slices of the timeline.

---

## **6. Business Rules**

* **BR-01 (Calendar Year Standard):** All "Quarterly" and "Annually" aggregations must strictly follow the standard Gregorian calendar year (January 1st to December 31st), rather than custom fiscal calendars.
* **BR-02 (Timezone Handling):** Revenue must be aggregated based on UTC timestamps at the database level but displayed mapped to the user's local browser timezone to prevent boundary cutoff errors.
* **BR-03 (Currency Normalization):** All dashboard metrics must be presented in US Dollars (USD). Transactions in foreign currencies must be converted using the exchange rate valid on the day of the transaction.
* **BR-04 (Incomplete Periods):** If a user selects "Annually" for the current ongoing year, the data should project partial metrics transparently without falsely zeroing out future months.

---

## **7. Non-Functional Requirements**

* **Performance:**
  * The dashboard must load aggregate metrics and update the UI within 1.5 seconds after the user switches the temporal toggle.

* **Usability:**
  * The user interface must gracefully handle empty states (e.g., a startup in its first month trying to view "Quarterly" data) by displaying informative placeholders rather than chart errors.

---

## **8. Assumptions**

* The underlying transaction database already accurately captures the transaction date, original currency, and successfully completed status for all historical sales.
* A reliable internal or third-party daily currency exchange rate API is already available to the backend system.

---

## **9. Constraints**

* The dashboard must be responsive but is primarily designed and constrained for Desktop and Tablet resolutions (min-width: 1024px) for Phase 1.
