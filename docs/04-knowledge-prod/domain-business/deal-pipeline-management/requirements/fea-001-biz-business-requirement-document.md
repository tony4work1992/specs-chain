# **BUSINESS REQUIREMENT DOCUMENT (BRD)**

**Request Version:** 2026.04.06 21.00.00
**Version:** 2026.04.06 21.00.00
**Parent Version:** 2026.04.06 21.00.00

## **Feature: FEA-001 — Deal Pipeline Management**

---

## **1. Purpose**

The purpose of the **Deal Pipeline Management** feature is to provide the Sales Team with a single, authoritative system to track every sales opportunity from first contact to final outcome.

The feature enables sales professionals to:

* Create and manage deals through a structured, stage-gated pipeline that enforces a consistent and auditable sales process
* Gain real-time visibility into all active opportunities, their current stage, estimated value, and staleness — eliminating the need for manual spreadsheet tracking
* Allow Sales Managers to monitor team-wide pipeline health, forecast revenue, and intervene on at-risk deals before they stall or are lost

---

## **2. Scope Definition**

### **2.1. In Scope**

The feature includes:

* Full CRUD lifecycle for Deal entities (Create, Read, Update, Archive)
* Kanban-style Pipeline Board with drag-and-drop stage transitions
* Enforced sequential stage progression: `New → Qualified → Proposal Sent → Negotiation → Closed Won | Closed Lost`
* Deal ownership model: deals are assigned to a specific Sales Rep; managers can view and edit all deals
* Deal Detail Page with inline editing, linked Contact/Company, and embedded Activity Timeline
* Deal List View with sorting, filtering, pagination, and CSV export
* Pipeline Summary Bar for Sales Managers (aggregate metrics, win rate, avg cycle time)
* Role-Based Access Control enforcement: Sales Rep (own deals only), Sales Manager (all team deals), Admin (configuration)
* Stage transition history audit trail (who moved the deal, when, from → to)
* Duplicate deal detection warning on creation

### **2.2. Out of Scope**

The following are explicitly not included in this feature release:

* Email integration (Gmail / Outlook sync to auto-log activities on deals)
* AI-powered lead scoring or deal probability prediction
* Revenue forecasting models or quota tracking
* Mobile native application (web-only for MVP)
* Multi-currency conversion logic (display only; no FX rate calculation)
* Integration with external CRM systems (Salesforce, HubSpot import/export)
* Deal approval workflows (e.g., manager must approve deals above a value threshold)
* Automated deal assignment / routing rules

---

## **3. Stakeholders**

* **Primary Stakeholders:**
  * Sales Representatives — daily operators, primary data entry users
  * Sales Managers — pipeline oversight, team performance monitoring

* **Secondary Stakeholders:**
  * Admin — pipeline stage configuration, user management, data archival policy
  * Engineering Team — technical implementation and maintenance
  * Finance / C-Level — consumers of exported pipeline data for revenue planning (read-only, via CSV export)

---

## **4. Business Objectives**

* **BO-01 — Eliminate Spreadsheet Dependency:** Replace all manual deal tracking in Excel/Google Sheets with a structured system, reducing data inconsistency and version conflicts to zero within 30 days of launch.
* **BO-02 — Enforce Sales Process Consistency:** Ensure 100% of active deals follow the defined stage sequence. No deal may skip stages, preventing premature close reporting.
* **BO-03 — Improve Pipeline Visibility:** Sales Managers must have real-time access to full team pipeline value and stage distribution at all times — no manual aggregation required.
* **BO-04 — Increase Sales Rep Accountability:** Every deal must have a named owner and an expected close date. Deals without an activity logged in the last 14 days must surface as visually flagged to the rep.
* **BO-05 — Enable Data-Driven Decisions:** Provide win rate and average cycle time metrics to allow managers to identify process bottlenecks and coach reps based on objective data.

---

## **5. Functional Overview**

The Deal Pipeline Management feature is structured into 4 main functional areas:

---

### **5.1. Deal Lifecycle Management**

* The system MUST allow authenticated Sales Reps to create a new Deal with: title, contact link, value, expected close date, source, and optional description.
* The system MUST enforce that every deal has exactly one assigned owner (Sales Rep) at all times.
* The system MUST allow deal owners and managers to update all deal fields at any time while the deal is in a non-terminal stage.
* The system MUST support soft-archiving of deals (not hard-delete). Archived deals are hidden from the active pipeline but remain queryable in a separate "Archived" view.
* The system MUST provide a stage transition mechanism that validates the transition against the defined stage sequence before persisting the change.

### **5.2. Pipeline Visualization**

* The system MUST render a Kanban board with one column per pipeline stage in fixed order.
* The system MUST support drag-and-drop repositioning of deal cards between valid adjacent stage columns.
* The system MUST apply optimistic UI updates on drag-and-drop while the server validates the transition asynchronously. On server rejection, the card must revert and display an error.
* The system MUST render a Pipeline Summary Bar visible only to Manager and Admin roles, showing aggregate metrics that auto-refresh every 30 seconds.

### **5.3. Deal Detail & Activity Context**

* The system MUST provide a Deal Detail Page that shows all deal attributes, an editable field panel, the full activity timeline, and a stage transition history log.
* The system MUST allow users to log an Activity (Call, Email, Meeting, Note) directly from the Deal Detail Page, automatically linking it to the deal.
* The system MUST display a "Days in Current Stage" counter on each deal card and detail page, with visual alerts at 14-day (warning) and 30-day (critical) thresholds.

### **5.4. Reporting & Export**

* The system MUST provide a Deal List View (tabular) with multi-column sort, filter by stage/rep/date/value, and paginated results.
* The system MUST allow Managers to perform bulk actions: reassign rep, archive multiple deals.
* The system MUST support CSV export of the currently filtered deal list (maximum 1,000 rows per export request).

---

## **6. Business Rules**

* **BR-01 — Sequential Stage Progression:** A deal MUST move through stages in the defined order: `New → Qualified → Proposal Sent → Negotiation → Closed Won | Closed Lost`. Skipping non-terminal stages is strictly forbidden. The only exception: any active stage may transition directly to `Closed Lost` (loss can happen at any point).
* **BR-02 — Ownership Mandate:** Every deal MUST have exactly one assigned Sales Rep at all times. A deal cannot exist in an unassigned state. When a rep is deactivated, their deals must be automatically flagged for reassignment.
* **BR-03 — Value Non-Negotiable:** Deal Value MUST be a positive number greater than zero. Zero-value deals are not permitted (use deal archival instead of setting value to 0).
* **BR-04 — Future Close Date:** Expected Close Date MUST be set to today or a future date at the time of creation. It may be updated to any future date afterward.
* **BR-05 — Terminal Stage Immutability:** Once a deal reaches `Closed Won` or `Closed Lost`, its stage CANNOT be changed. To reopen a lost deal, the user must create a new deal (copy is acceptable). This preserves historical reporting accuracy.
* **BR-06 — Rep Scope Restriction:** A Sales Rep MUST NOT be able to view, edit, or transition deals owned by other reps. Attempting to access another rep's deal URL directly must return a 403 Forbidden response.
* **BR-07 — Duplicate Warning:** If a new deal is created with the same title and contact as an existing active deal, the system MUST display a non-blocking warning to the user before allowing save. It MUST NOT auto-block creation.
* **BR-08 — Audit Immutability:** Stage transition history records are immutable. Once written, they cannot be edited or deleted by any user including Admin.

---

## **7. Non-Functional Requirements**

* **Performance:**
  * Pipeline board must render initial load within 2 seconds for up to 200 active deals on a standard broadband connection.
  * Stage transition (drag-and-drop server confirmation) must complete within 800ms (P99).
  * Deal list filtering/search must respond within 500ms (P99).

* **Usability:**
  * All interactive elements must meet WCAG 2.1 AA contrast requirements.
  * Drag-and-drop must function correctly on touchpad and mouse input. Mobile touch is not required for MVP.
  * All destructive actions (archive, bulk reassign) must require a confirmation dialog.

* **Security:**
  * All Deal API endpoints MUST be protected by JWT authentication (`JwtAuthGuard`).
  * All role-based restrictions (BR-06) MUST be enforced at the API layer (server-side), NOT solely via UI hiding.
  * Deal IDs in URLs must be UUIDs (not sequential integers) to prevent enumeration attacks.

* **Reliability:**
  * Optimistic UI updates for stage transitions must include a rollback mechanism on server failure, with a user-visible error toast.
  * CSV export for lists > 500 rows must be processed asynchronously (background job) to avoid request timeout.

---

## **8. Assumptions**

* **A-01:** The Contact and Company entities already exist in the system (created via the Lead & Contact module). Deal creation depends on at least one Contact being present.
* **A-02:** Pipeline stages (`New`, `Qualified`, `Proposal Sent`, `Negotiation`, `Closed Won`, `Closed Lost`) are pre-configured by Admin during system setup. Stage names and order are not editable by Sales Reps or Managers.
* **A-03:** Currency display is single-currency per organization (configured at system level). Multi-currency conversion is out of scope for MVP.
* **A-04:** The Activity module (Skill FEA-002 scope) exists and exposes an API for creating activities linked to a deal. The pipeline module consumes this API; it does not own activity creation logic.
* **A-05:** All users have been provisioned with one of the three defined roles (Sales Rep, Sales Manager, Admin) before accessing this feature.

---

## **9. Constraints**

* **C-01 — No Hard Delete:** Deals must never be permanently deleted through the UI. Archival is the only supported removal mechanism to preserve reporting history.
* **C-02 — Stage Configuration is Admin-Only:** Sales Reps and Managers have zero ability to add, rename, reorder, or remove pipeline stages. Stage schema changes require Admin action and may have downstream impacts on existing deals.
* **C-03 — Export Volume Cap:** CSV exports are capped at 1,000 rows per request to prevent server overload. Larger data extractions require a scheduled report (post-MVP).
* **C-04 — TypeORM Migration Policy:** All schema changes for the `deals` table MUST be generated via `typeorm migration:generate` (per System Rule 2.9). The AI agent MUST NOT hand-author migration files.
* **C-05 — No Real-Time WebSocket for MVP Board:** The pipeline board uses polling (30-second refresh) for the summary bar only. Full real-time board sync (e.g., two managers seeing each other's drag-and-drop live) is deferred to post-MVP to reduce infrastructure complexity.
