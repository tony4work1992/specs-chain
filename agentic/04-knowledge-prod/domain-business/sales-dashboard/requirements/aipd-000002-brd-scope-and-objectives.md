<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 001.Requirement Development Workflow/Business Requirement Document.md
Source-Version: 2026.04.03 16.09.06
Sections: Purpose, Scope Definition, Stakeholders, Business Objectives
-->

# **BRD: Scope & Objectives (AIPD-000002)**

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
