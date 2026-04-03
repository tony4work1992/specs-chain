<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 001.Requirement Development Workflow/Business Requirement Document.md
Source-Version: 2026.04.03 16.09.06
Sections: Functional Overview (5.1, 5.2)
-->

# **BRD: Functional Overview (AIPD-000002)**

## **1. Dashboard Navigation & Control**

* **Temporal Toggle Switch:** The system must provide a master toggle allowing the user to select 'Weekly', 'Monthly', 'Quarterly', or 'Annually'.
* **Global Context Linking:** All data visualizations and KPIs on the page must re-fetch and re-render automatically upon changing the temporal toggle.

---

## **2. Core Performance Indicators & Visualization**

* **Aggregate Revenue & Volume Calculation:** The system must sum all closed transactions within the defined temporal boundaries and display the absolute revenue amount alongside total transaction count.
* **Percentage Growth Calculation:** The system must compare current period revenue to the exact prior equivalent period and render an upward/downward percentage indicator.
* **Time-Series Charting:** The system must map the summed data onto a sequence chart representing slices of the timeline.
