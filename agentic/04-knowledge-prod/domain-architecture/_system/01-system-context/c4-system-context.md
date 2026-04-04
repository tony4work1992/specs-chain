<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 003.Software Architecture Workflow/Strategic Architecture.md
Source-Version: 2026.04.03 14.29.29
Sections: System Context Diagram (Level 1)
-->

# **C4: System Context Diagram (AIPD-000002)**

```mermaid
C4Context
  title System Context diagram for Intelligence Commerce (AIPD-000002)
  
  Person(ae, "Account Executive", "Internal sales staff viewing the dashboard")
  System(dashboard, "Sales Dashboard System", "Provides realtime unified financial analytics and reporting")
  System_Ext(crm, "Provider CRM", "External source of truth for Sales Bookings")
  System_Ext(s3, "AWS S3", "Hosts the generated PDF reports")

  Rel(ae, dashboard, "Views metrics and generates reports via")
  Rel(dashboard, crm, "Polls for delta sales data from", "HTTPS/REST")
  Rel(dashboard, s3, "Uploads PDF snapshots to", "HTTPS")
  Rel(ae, s3, "Downloads PDF reports from", "Presigned HTTPS")
```
