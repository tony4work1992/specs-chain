# **FUNCTIONAL REQUIREMENT DOCUMENT (FRD)**

**Request Version:** 2026.04.06 21.00.00
**Version:** 2026.04.06 21.00.00
**Parent Version:** 2026.04.06 21.00.00

## **Feature: FEA-001 — Deal Pipeline Management**

---

## **1. Document Purpose**

This document defines the functional requirements for the **Deal Pipeline Management** feature based on the approved Business Requirement Document (BRD) and System Context Information.

The purpose of this feature is to provide Sales Representatives and Sales Managers with a fully structured, stage-gated deal lifecycle management system rendered as a Kanban pipeline board, a tabular list view, and a contextual deal detail page.

This document describes:
* Functional scope and boundary
* User interactions and screen behaviors per component
* Data presentation and formatting rules
* System processing behaviors (validation, transitions, caching, exports)
* Traceability to BRD business rules

---

## **2. Scope**

### **2.1. In Scope**

The Deal Pipeline Management feature includes the following functions:

1. Deal entity CRUD (Create, Read Update, Soft-Archive)
2. Pipeline Board rendering (Kanban with stage columns and deal cards)
3. Drag-and-drop stage transition with server-side sequential validation
4. Deal Detail Page with inline editing, stage history, and activity timeline embedding
5. Deal List View with multi-column sort, filter, pagination, and CSV export
6. Pipeline Summary Bar with aggregate metrics (Manager/Admin only)
7. Stale deal detection and visual flagging (staleness badge)
8. Duplicate deal detection warning on creation
9. Role-based access enforcement at API and UI levels
10. Stage transition audit history (immutable log)

### **2.2. Out of Scope**

The following functions are excluded from this feature:

1. Email / calendar integration (Gmail, Outlook activity auto-logging)
2. AI-powered deal scoring or probability prediction
3. Revenue forecasting and quota tracking dashboards
4. Mobile application (web-only)
5. Real-time WebSocket board sync between concurrent users
6. Multi-currency FX conversion
7. Deal approval workflows (manager approval before stage advance)
8. Import from external CRM (Salesforce, HubSpot)

---

## **3. Intended Users**

The feature is intended for authenticated internal Sales System users, including:

* **Sales Representative** — creates and manages own deals, views own pipeline only
* **Sales Manager** — views and edits all team deals, accesses Pipeline Summary Bar
* **Admin** — full access including pipeline stage configuration and bulk archival

---

## **4. Functional Context**

The system is implemented using:

* **NestJS v10** — Clean Architecture module `DealPipelineModule` with 4 strict layers
* **PostgreSQL 16** — Primary persistence via TypeORM v0.3.x
* **Redis 7** — Summary aggregate caching (cache-aside, 30s TTL)
* **Next.js 14 App Router** — Frontend, TanStack Query v5 for server state, Zustand v4 for optimistic UI, @dnd-kit for Kanban DnD

For avoidance of doubt:
* Stage transition validation is enforced at the **Application layer (Use Case)**, not at the DB constraint level or Controller level
* Deal IDs exposed in all API routes are **UUID v4** — no sequential integers
* The `pipeline_stages` table is **read-only at runtime** — pre-seeded at deployment; stage CRUD is Admin-only configuration (out of scope for this feature)
* `deleted_at` soft-delete column is used for archival — hard delete is forbidden at all layers

For this feature, the Deal Pipeline Management system is categorized as a **transactional CRUD + read-aggregate hybrid module** requiring both write-path Use Cases and optimized read-path Query Use Cases with Redis caching.

---

## **5. Functional Requirements**

### **5.1. Deal Creation**

#### **FR-001: Create Deal Form Rendering**
When a Sales Rep or Manager navigates to the pipeline board and clicks "New Deal", the system MUST render a modal form containing all required and optional deal fields as defined in the BRD. The form MUST use React Hook Form v7 with Zod v3 schema validation. No field submission is possible while validation errors are present. The form MUST display field-level error messages inline beneath each invalid field.

#### **FR-002: Required Field Enforcement**
The system MUST prevent deal creation if any of the following fields are empty or invalid: `title` (non-empty string, max 120 chars), `contact_id` (valid UUID referencing an existing Contact), `value` (positive number > 0), `expected_close_date` (ISO date, must be today or future), `assigned_rep_id` (valid user UUID; defaults to current authenticated user for Sales Rep role).

#### **FR-003: Duplicate Deal Warning**
Before submitting a new deal, the frontend MUST call `GET /deals/check-duplicate?title={title}&contact_id={contactId}`. If the API returns `duplicate_found: true`, the form MUST display a non-blocking warning banner: *"A deal with this title and contact already exists in an active stage. Do you still want to create it?"* with Confirm and Cancel buttons. Submission is allowed if the user confirms.

#### **FR-004: Initial Stage Assignment**
On creation, `initial_stage` MUST default to the pipeline stage with `order: 1` (i.e., "New"). The backend MUST enforce this — a client-submitted `stage_id` that is not the first stage MUST be rejected with HTTP 422 and error code `INVALID_INITIAL_STAGE`. Managers may not override the initial stage on creation.

#### **FR-005: Creation API Response**
On successful creation, the API MUST return HTTP 201 with the full `DealResponseDto` (see Functional Specifications). The frontend MUST optimistically append the new deal card to the "New" column before the server response, then reconcile with the actual UUID returned.

---

### **5.2. Pipeline Board**

#### **FR-006: Board Stage Column Rendering**
The system MUST render one column per active `pipeline_stage` record, ordered by `pipeline_stages.order` ascending. Column headers display: stage name, deal count in that stage, and total value sum of deals in that stage (formatted currency).

#### **FR-007: Deal Card Contents**
Each deal card on the board MUST display: deal title (truncated at 40 chars with tooltip), assigned rep avatar (initials fallback) + full name, contact first+last name (linked to Contact Detail), deal value (formatted: VND → `₫1,234,567` / USD → `$1,234.56`), days-in-stage badge (integer, colored: green < 14 days, yellow 14–30 days, red > 30 days), and a "Log Activity" quick-action icon button.

#### **FR-008: Drag-and-Drop Stage Transition Initiation**
The system MUST enable drag-and-drop of deal cards between stage columns using @dnd-kit. When a drag starts, the system MUST apply an optimistic update: remove the card from the source column and add it to the target column immediately in the Zustand `usePipelineBoardStore`. A `PATCH /deals/:id/stage` request MUST be dispatched in parallel.

#### **FR-009: Stage Transition Server Validation**
The NestJS `TransitionDealStageUseCase` MUST validate: (a) the requesting user has permission to move this deal (owner or Manager), (b) the target stage follows the source stage sequentially per `pipeline_stages.order`, OR the target stage is `Closed Lost` (allowed from any active stage). If validation fails, the API MUST return HTTP 422 with `{ error_code: "INVALID_STAGE_TRANSITION", from_stage: string, to_stage: string, allowed_next_stages: string[] }`.

#### **FR-010: Optimistic Rollback on Transition Failure**
If the `PATCH /deals/:id/stage` response returns a non-2xx status, the frontend MUST revert the Zustand store to the pre-drag state, snap the deal card back to its original column with a CSS transition animation, and display a Sonner toast error: *"Stage transition failed: [reason from API error_code]"*.

#### **FR-011: Board Filters**
The board MUST render a filter bar with: Assigned Rep multi-select (Manager/Admin only; hidden for Sales Rep), Stage multi-select, Deal Value range (min/max numeric inputs), Date Created range (date pickers). Active filters MUST be displayed as removable chips. Applying any filter re-fetches the board data via `GET /deals/board?stage[]=...&rep_id[]=...&value_min=...` query params.

#### **FR-012: Board Search**
The board MUST include a debounced (300ms) search input. Searches against deal title and contact name server-side via `GET /deals/board?search={query}`. Matching deal cards MUST have their title/contact text highlighted with a yellow background on the matched substring.

---

### **5.3. Deal Detail Page**

#### **FR-013: Deal Detail Page Layout**
Navigating to `/deals/{uuid}` MUST render the Deal Detail Page. The page MUST fetch the deal via `GET /deals/:id` and display: header (title inline-editable, stage badge with transition dropdown, value, assigned rep, contact link, company link, expected close date, days-open counter), editable field panel (all non-ID fields), activity timeline section (fetched separately from Activity API), and stage transition history (collapsed accordion).

#### **FR-014: Inline Field Editing**
All editable fields on the Detail Page MUST support inline editing for the deal owner (Sales Rep) or any Manager/Admin. Changes MUST be auto-saved via `PATCH /deals/:id` with a 1-second debounce. A "Last edited by [Name] at [timestamp]" indicator MUST always be visible below the field panel. Optimistic updates MUST be applied immediately; on save failure, the field MUST revert to its last saved value with an error toast.

#### **FR-015: Stage Transition from Detail Page**
The stage badge MUST render a dropdown showing only valid next stage(s) and "Close as Lost". Selecting a stage triggers the same `PATCH /deals/:id/stage` flow as drag-and-drop (FR-009). The transition history section MUST automatically prepend the new transition record on success.

#### **FR-016: Stage Transition History**
The transition history accordion MUST display all `deal_stage_transitions` records for this deal in descending chronological order. Each entry: `[from_stage_name] → [to_stage_name]`, `Moved by: [User Full Name]`, `At: [ISO datetime formatted as "Apr 06, 2026 09:30 AM"]`. This section is read-only; no deletion or editing is permitted.

#### **FR-017: Activity Timeline Embedding**
The Deal Detail Page MUST embed the Activity Timeline by fetching `GET /activities?deal_id={uuid}&sort=created_at:desc` from the Activity module API. A "Log Activity" button in this section MUST open an Activity creation modal. This section renders independently of the deal data fetch (separate TanStack Query key) so a slow activity load does not block deal details display.

---

### **5.4. Deal List View**

#### **FR-018: List View Columns and Default Sort**
The Deal List View MUST render a TanStack Table v8 with columns: Deal Title (linked to Detail Page), Contact Name (linked), Company Name, Assigned Rep, Stage (colored badge), Deal Value (right-aligned, formatted), Expected Close Date, Days Open, Last Activity Date, Actions column (Edit icon → opens Detail Page; Archive icon → triggers confirmation). Default sort: Last Activity Date descending.

#### **FR-019: Multi-Column Sort**
All columns except Actions MUST be sortable by clicking column headers. Clicking a sorted column cycles: ASC → DESC → unsorted. Sort state MUST be reflected in the URL as `?sort_by=value&sort_dir=desc` for shareable links.

#### **FR-020: Multi-Filter Support**
The list MUST support simultaneous filters: Stage (multi-select checkboxes), Assigned Rep (multi-select, Manager/Admin only), Deal Value (range), Expected Close Date (range), Date Created (range). All filters MUST be reflected in URL query params for shareable filtered views.

#### **FR-021: Pagination**
Pagination MUST default to 25 rows per page. User MUST be able to select 10/25/50/100 rows per page via a dropdown. Page, page size, sort, and filters MUST all be URL-persisted. Server-side pagination via `GET /deals?page=1&limit=25&...`.

#### **FR-022: CSV Export**
An "Export CSV" button MUST be visible in the list toolbar (Manager/Admin only). On click: if filtered result count ≤ 500, the export is synchronous — the API returns a direct CSV file download response. If count > 500, the API returns HTTP 202 with a `job_id`; the frontend polls `GET /deals/export/:jobId/status` every 3 seconds; on completion, the API returns a pre-signed S3 URL; the frontend triggers `window.open(url)` to initiate the download.

#### **FR-023: Bulk Actions (Manager/Admin only)**
Selecting multiple rows via checkboxes MUST reveal a bulk action toolbar: "Reassign Rep" (opens rep selector modal → calls `PATCH /deals/bulk-reassign`), "Archive" (opens confirmation → calls `POST /deals/bulk-archive`). The select-all checkbox selects all rows on the current page only.

---

### **5.5. Pipeline Summary Bar**

#### **FR-024: Summary Bar Visibility and Metrics**
The Pipeline Summary Bar MUST be visible only to Manager and Admin roles — hidden from Sales Rep via both API response (`403` if rep calls summary endpoint) and UI-level role check. Metrics displayed: Total Active Deals (count), Total Pipeline Value (sum of all non-closed deal values, formatted), Pipeline Value by Stage (Recharts horizontal bar chart, one bar per stage), Win Rate % (last 30 days: `Closed Won / (Closed Won + Closed Lost) * 100`, rounded to 1 decimal), Average Deal Cycle Time (mean days from `created_at` to `closed_at` for Closed Won deals in last 30 days).

#### **FR-025: Summary Bar Data Refresh**
The summary bar MUST auto-refresh every 30 seconds via TanStack Query `refetchInterval: 30000`. The summary data MUST be served from Redis cache (`pipeline:summary:{userId}`, TTL 30s) when available. Cache MUST be invalidated on any `POST /deals`, `PATCH /deals/:id`, `PATCH /deals/:id/stage`, `POST /deals/bulk-archive`, or `PATCH /deals/bulk-reassign` operation that the requesting manager has permission to see.

#### **FR-026: Filters Applied to Summary**
When board filters are active (Assigned Rep, Stage), the Summary Bar MUST reflect the filtered subset, not the global totals. The summary API MUST accept the same filter query params as the board API and apply them to the aggregate query.

---

### **5.6. Stale Deal Detection**

#### **FR-027: Staleness Level Computation**
A NestJS `@Cron('0 * * * *')` (every hour) job MUST run `UpdateDealStalenessUseCase`. This use case queries all active deals (non-terminal stages) and updates `deals.staleness_level` based on `NOW() - stage_entered_at`: `NORMAL` (< 14 days), `WARNING` (14–30 days), `CRITICAL` (> 30 days). Bulk update via a single SQL `UPDATE deals SET staleness_level = CASE WHEN ...` statement.

#### **FR-028: Staleness Visual Rendering**
Deal cards MUST render a staleness badge: no badge if `NORMAL`, amber badge "14d" if `WARNING`, red pulsing badge "30d+" if `CRITICAL`. The Deal Detail Page MUST show the exact days-in-current-stage count (integer) next to the stage badge.

---

## **6. Functional Behavior**

### **6.1. Authorization Enforcement**

#### **FR-029: Sales Rep Scope Restriction**
The `GetDealByIdUseCase`, `UpdateDealUseCase`, and `TransitionDealStageUseCase` MUST verify `deal.assigned_rep_id === currentUser.id` when the requesting user has the `SALES_REP` role. If the check fails, the use case MUST throw a `ForbiddenException` which maps to HTTP 403. This check MUST be performed AFTER the `JwtAuthGuard` validates the token, inside the Use Case — NOT in the Controller guard alone.

#### **FR-030: Terminal Stage Immutability Enforcement**
The `TransitionDealStageUseCase` MUST check if `deal.current_stage.is_terminal === true` BEFORE processing any transition. If true, it MUST throw a `UnprocessableEntityException` with error code `DEAL_STAGE_TERMINAL`. This applies to both `Closed Won` and `Closed Lost` stages.

#### **FR-031: Stage Transition Audit Write**
On every successful stage transition, the `TransitionDealStageUseCase` MUST atomically: (1) update `deals.current_stage_id` and `deals.stage_entered_at`, (2) insert a new `deal_stage_transitions` record with `deal_id`, `from_stage_id`, `to_stage_id`, `transitioned_by_user_id`, `transitioned_at: NOW()`. Both writes MUST execute within a single PostgreSQL transaction. If either write fails, both MUST roll back.

### **6.2. Caching Behavior**

#### **FR-032: Pipeline Summary Cache-Aside Pattern**
`GetPipelineSummaryQuery` MUST first attempt to read from Redis key `pipeline:summary:{requestingUserId}`. On cache hit: return cached JSON deserialized into `PipelineSummaryResponseDto`. On cache miss: execute DB aggregate query, serialize result, write to Redis with `EX 30` (30-second TTL), then return result.

#### **FR-033: Cache Invalidation Strategy**
Any write operation that modifies pipeline aggregate state (deal create, stage transition, archive, bulk-reassign) MUST call `CacheInvalidationService.invalidatePipelineSummary(affectedManagerId)`. This deletes the Redis key `pipeline:summary:{managerId}` where `managerId` is derived from: the deal's assigned rep's manager, or the requesting user if they are a Manager.

---

## **7. Data Presentation Requirements**

### **7.1. Formatting Rules**

#### **FR-034: Currency Formatting**
Deal value MUST be formatted based on the system currency config: VND → `₫1,234,567` (no decimal places), USD → `$1,234.56` (2 decimal places). Formatting MUST use the `Intl.NumberFormat` browser API with `currency` option. Raw numeric values from the API are always stored and transmitted as integers in minor currency units (cents for USD, VND as-is).

#### **FR-035: Date Formatting**
All dates displayed in the UI MUST use `date-fns/format` with the pattern `MMM dd, yyyy` (e.g., "Apr 06, 2026"). Relative time (e.g., "3 days ago") MUST use `date-fns/formatDistanceToNow` and MUST be displayed as a tooltip on hover over absolute dates. API transmits all dates as ISO 8601 UTC strings.

#### **FR-036: Days Open / Days in Stage**
"Days Open" = `Math.floor((now - deal.created_at) / 86400000)`. "Days in Stage" = `Math.floor((now - deal.stage_entered_at) / 86400000)`. Both are computed client-side from timestamps returned in the API response.

### **7.2. Visual Requirements**

#### **FR-037: Stage Badge Color Mapping**
Stage badges MUST use these Tailwind color classes: `New` → `bg-slate-100 text-slate-700`, `Qualified` → `bg-blue-100 text-blue-700`, `Proposal Sent` → `bg-violet-100 text-violet-700`, `Negotiation` → `bg-amber-100 text-amber-700`, `Closed Won` → `bg-green-100 text-green-700`, `Closed Lost` → `bg-red-100 text-red-700`.

#### **FR-038: Empty State Rendering**
If a pipeline stage column contains zero deals, the column MUST render an empty state: a dashed border card with the text "No deals in this stage" and a "+ Add Deal" button. This button pre-fills the creation form with the respective stage. (Note: the initial stage validation in FR-004 applies — the form MUST still default to "New" stage; the clicked stage is used as a board UX hint only, not bypassing the stage rule.)

---

## **8. System Processing Considerations**

### **8.1. Backend Structure**

The system shall implement the feature within the `DealPipelineModule` following Clean Architecture:

* **Domain Layer:** `Deal` entity (Aggregate Root), `PipelineStage` entity (read-only reference), `DealStageTransition` entity (audit record), `IDealRepository` interface, `IPipelineStageRepository` interface
* **Application Layer:** `CreateDealCommand` + `CreateDealUseCase`, `UpdateDealCommand` + `UpdateDealUseCase`, `TransitionDealStageCommand` + `TransitionDealStageUseCase`, `ArchiveDealCommand` + `ArchiveDealUseCase`, `GetDealByIdQuery` + `GetDealByIdQueryHandler`, `ListDealsQuery` + `ListDealsQueryHandler`, `GetPipelineBoardQuery` + `GetPipelineBoardQueryHandler`, `GetPipelineSummaryQuery` + `GetPipelineSummaryQueryHandler`, `BulkReassignDealsCommand`, `BulkArchiveDealsCommand`, `DuplicateDealCheckQuery`, `ExportDealsCommand`, `UpdateDealStalenessUseCase` (cron)
* **Infrastructure Layer:** `DealTypeOrmRepository`, `PipelineStageTypeOrmRepository`, `DealStageTransitionTypeOrmRepository`, `PipelineSummaryCacheRepository` (Redis), `DealCsvExportAdapter` (S3)
* **Presentation Layer:** `DealController` (`/deals`), `DealBoardController` (`/deals/board`), `DealSummaryController` (`/deals/summary`), `DealExportController` (`/deals/export`)

### **8.2. Async CSV Export Processing**

For CSV exports exceeding 500 rows: the `ExportDealsCommand` dispatches a background job using NestJS `BullModule` (Bull queue backed by Redis). The job reads the full filtered deal list, generates CSV via `fast-csv`, uploads to S3, then stores the pre-signed URL (1-hour expiry) in a `deal_export_jobs` Redis key. The frontend polls `GET /deals/export/:jobId/status` every 3 seconds until `status: "completed"` with `download_url`.

---

## **9. Assumptions**

1. `pipeline_stages` table contains exactly the 6 canonical stages seeded at deployment. Stage schema changes require an Admin-level migration, not a runtime API.
2. The `contacts` table exists and its UUID primary keys are valid before any deal creation is attempted.
3. Redis is available on all environments. If Redis is down, `GetPipelineSummaryQuery` falls back to direct PostgreSQL aggregate query and returns result without caching (graceful degradation).
4. The Activity module (`/activities` endpoint) exists independently and is consumable by the frontend at deal detail page load time.
5. The `identity` module exposes a `UserSummaryDto` { id, fullName, avatarUrl, role } interface consumable by the deal module without importing `UserEntity`.

---

## **10. Constraints**

1. Stage transition logic MUST live in `TransitionDealStageUseCase` — NEVER in a Controller or a TypeORM entity lifecycle hook.
2. TypeORM migrations MUST be auto-generated via `typeorm migration:generate` (per Rule 2.9). Hand-authored SQL migrations are forbidden.
3. The `DealPipelineModule` MUST NOT import TypeORM repositories from `LeadContactModule` or `IdentityModule` directly. Cross-module data access MUST go through exported interfaces/services.
4. CSV export downloads are limited to 1,000 rows maximum. Requests for larger exports MUST return HTTP 422 with error code `EXPORT_LIMIT_EXCEEDED`.
5. All Controller endpoints MUST be decorated with `@ApiTags('deals')` and `@ApiBearerAuth()` for Swagger documentation compliance.

---

## **11. Traceability to BRD**

This FRD expands the following BRD areas without adding new requirements:

* **BR-01 (Sequential Stage Progression)** → FR-009, FR-010, FR-015, FR-030, FR-031
* **BR-02 (Ownership Mandate)** → FR-002, FR-004, FR-029
* **BR-03 (Value Non-Negotiable)** → FR-002
* **BR-04 (Future Close Date)** → FR-002
* **BR-05 (Terminal Stage Immutability)** → FR-030, FR-031
* **BR-06 (Rep Scope Restriction)** → FR-029
* **BR-07 (Duplicate Warning)** → FR-003
* **BR-08 (Audit Immutability)** → FR-016, FR-031
* **BO-01 to BO-05** → FR-006, FR-018, FR-024, FR-025, FR-027

---

## **12. Summary**

The Deal Pipeline Management feature provides Sales Representatives, Managers, and Admins with a fully structured, audit-safe deal lifecycle system. All deal state mutations are stage-gate enforced at the Application layer. Pipeline visibility is role-partitioned: reps see only their own deals; managers see all. The board is optimistic-UI-first with server-side validation rollback. All business rules from BRD (BR-01 through BR-08) are traceable to specific FR entries in this document.
