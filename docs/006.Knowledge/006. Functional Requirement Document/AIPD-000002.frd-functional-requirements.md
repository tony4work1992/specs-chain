<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/Functional Requirement Document.md
Source-Version: 2026.04.03 16.18.42
Sections: FR-000001, FR-000002, FR-000003, FR-000004
-->

# **FRD: Functional Requirements (AIPD-000002)**

## **1. Dashboard Navigation & Control**

### **FR-000001: Temporal Toggle Switch State**

The UI must present a 4-state toggle (Weekly, Monthly, Quarterly, Annually). The default state upon initial load must be "Monthly". Changing this toggle must immediately trigger an API re-fetch for all visible dashboard components, passing the new boundary scope.

### **FR-000002: Contextual Client Timezone Dispatch**

Every API Request triggered by the Temporal Toggle must include headers containing the Client's `X-Timezone-Offset` to inform the backend of the necessary boundary shift against UTC records.

---

## **2. Core Performance Indicators**

### **FR-000003: Aggregate Revenue Calculation Logic**

The backend must sum the `transaction_amount` of all documents where `status = 'completed'` and the `transaction_date` falls within the provided Unix Timestamp boundaries. Before summing, foreign currencies must be converted to USD using the rate stored for that exact `transaction_date`.

### **FR-000004: Period-over-Period Growth Calculation**

The API must calculate the exact same revenue sum for the mathematically equivalent preceding period (e.g., if querying Q3 2026, the prior period is Q2 2026). The growth percentage is calculated as `((Current - Prior) / Prior) * 100`.
