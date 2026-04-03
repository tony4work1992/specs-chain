<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 001.Requirement Development Workflow/Business Requirement Document.md
Source-Version: 2026.04.03 16.09.06
Sections: Business Rules (BR-01 to BR-04)
-->

# **BRD: Business Rules (AIPD-000002)**

* **BR-01 (Calendar Year Standard):** All "Quarterly" and "Annually" aggregations must strictly follow the standard Gregorian calendar year (January 1st to December 31st), rather than custom fiscal calendars.
* **BR-02 (Timezone Handling):** Revenue must be aggregated based on UTC timestamps at the database level but displayed mapped to the user's local browser timezone to prevent boundary cutoff errors.
* **BR-03 (Currency Normalization):** All dashboard metrics must be presented in US Dollars (USD). Transactions in foreign currencies must be converted using the exchange rate valid on the day of the transaction.
* **BR-04 (Incomplete Periods):** If a user selects "Annually" for the current ongoing year, the data should project partial metrics transparently without falsely zeroing out future months.
