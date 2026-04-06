# **HIGH-LEVEL REQUIREMENTS DOCUMENT**

**Request Version:** 2026.04.06 21.00.00
**Version:** 2026.04.06 21.00.00
**Parent Version:** 2026.04.06 21.00.00

## **Feature: FEA-001 — Deal Pipeline Management**

---

## **1. Target Audience**

This feature is designed for internal sales team members across three roles with distinct responsibilities:

* **Sales Representative:**
  The primary day-to-day user. Responsible for creating, owning, and advancing individual deals through the pipeline. They need fast, frictionless access to their personal deal list, the ability to log context (notes, activities), and clear visual cues for what action is needed next on each deal.

* **Sales Manager:**
  Responsible for team performance oversight. Needs a bird's-eye view of the entire pipeline across all reps, the ability to reassign or co-own deals, and aggregated metrics to forecast end-of-quarter revenue. Does not need to create deals directly but must be able to edit any deal in their team.

* **Admin:**
  Responsible for system configuration — defining pipeline stages, managing deal categories, setting ownership rules, and archiving closed deals. Does not participate in daily deal operations but maintains the structural integrity of the pipeline.

---

## **2. User Expectations**

* **Clarity & Visual Pipeline Representation:**
  Sales Reps and Managers expect a Kanban-style board that visually represents deals as cards grouped by pipeline stage. Moving a card between columns must trigger a stage transition instantly — no page reload. Deal cards must surface the most critical data at a glance: deal name, contact name, value (VND/USD), and days in current stage.

* **Speed & Responsiveness:**
  The pipeline board must load within 2 seconds for up to 200 active deals. Drag-and-drop stage transitions must feel instantaneous (optimistic UI update before server confirmation). Filtering and searching must return results within 500ms.

* **Data Integrity & Ownership Enforcement:**
  Sales Reps must only be able to edit deals they own. Managers can edit all deals within their team. The system must prevent accidental data loss — archiving or deleting a deal requires explicit confirmation. Stage transitions that violate the defined sequence must be blocked with a clear error message.

* **Contextual Awareness:**
  Each deal must link directly to a Contact and optionally a Company. Users expect to view the full activity timeline (calls, emails, notes) directly within the deal detail page without navigating away. The deal must show how many days it has been in the current stage as a visual staleness indicator.

* **Performance Insights (Manager-level):**
  Sales Managers expect an always-visible summary bar showing: total pipeline value by stage, number of active deals, win rate (last 30 days), and average deal cycle time. This data must refresh automatically without manual reload.

---

## **3. Component Requirements**

The Deal Pipeline Management feature is divided into 5 main sections:

---

### **3.1. Pipeline Board (Kanban View)**

* **Stage Columns:**
  The board renders one column per pipeline stage in fixed left-to-right order: `New → Qualified → Proposal Sent → Negotiation → Closed Won | Closed Lost`. Closed Won and Closed Lost are terminal columns, visually distinct (green / red tint).

* **Deal Cards:**
  Each card displays: Deal Title, Assigned Rep avatar + name, Contact name (linked), Deal Value (formatted currency), Days in Stage badge (yellow if > 14 days, red if > 30 days), and a quick-action button (Log Activity).

* **Drag-and-Drop Stage Transition:**
  Users can drag a deal card from one column to an adjacent valid column. The system validates the transition server-side. If valid, the card snaps to the new column. If invalid (e.g., skipping stages), the card returns to its origin with a toast error message.

* **Board Filters:**
  Filter bar above the board supports: Assigned Rep (multi-select, Manager only), Stage (multi-select), Deal Value range (min/max input), Date Created range. Active filters are shown as removable chips.

* **Board Search:**
  Instant search by deal title or contact name. Results highlight matching cards across all stage columns simultaneously.

---

### **3.2. Deal Creation Form**

* **Required Fields:**
  Deal Title (text, max 120 chars), Contact (linked selector — must exist in system), Deal Value (numeric, currency selector VND/USD), Expected Close Date (date picker, must be future date), Assigned Rep (defaults to current user; Manager can assign to any rep), Initial Stage (defaults to "New").

* **Optional Fields:**
  Company (auto-filled from Contact's linked company), Description / Notes (rich text, max 2,000 chars), Deal Source (dropdown: Inbound, Outbound, Referral, Event, Other).

* **Validation Rules:**
  All required fields must be filled before submission. Deal Value must be > 0. Expected Close Date cannot be in the past. Duplicate detection: warn (not block) if a deal with the same title + contact already exists in an active stage.

---

### **3.3. Deal Detail Page**

* **Header Section:**
  Deal title (editable inline), current stage badge (with manual stage-change dropdown for valid next stages only), deal value, assigned rep, contact link, company link, expected close date, days open counter.

* **Activity Timeline:**
  Chronological feed of all logged activities (calls, emails, meetings, notes) linked to this deal. Each entry shows: type icon, summary, logged by, timestamp. New activity can be logged directly from this panel.

* **Edit Panel:**
  All deal fields accessible for editing inline (for owner) or via Edit modal. Changes auto-save with debounce (1 second). A "Last edited by / at" indicator is always visible.

* **Stage Transition History:**
  Collapsed section showing the full history of stage changes: `[Stage From] → [Stage To]` with timestamp and user who triggered the change.

---

### **3.4. Deal List View (Table)**

* **Columns:**
  Deal Title, Contact, Company, Assigned Rep, Stage, Deal Value, Expected Close Date, Days Open, Last Activity Date, Actions (Edit / Archive).

* **Sorting:** All columns sortable. Default: Last Activity Date descending.

* **Pagination:** 25 rows per page, user-selectable (10 / 25 / 50 / 100).

* **Bulk Actions (Manager only):** Select multiple deals → Reassign Rep, Archive, Export to CSV.

* **Export:** Export current filtered view to CSV (max 1,000 rows per export).

---

### **3.5. Pipeline Summary Bar (Manager View)**

* **Metrics Displayed:**
  Total Active Deals count, Total Pipeline Value (sum of all non-closed deal values), Pipeline Value by Stage (mini bar chart), Win Rate % (Closed Won / (Closed Won + Closed Lost) in last 30 days), Average Deal Cycle Time (days from creation to Closed Won, last 30 deals).

* **Refresh Behavior:**
  Metrics refresh every 30 seconds via polling. Manual refresh button available. Data reflects the currently applied board filters.

* **Visibility:** Visible only to Sales Manager and Admin roles. Hidden from Sales Rep view.
