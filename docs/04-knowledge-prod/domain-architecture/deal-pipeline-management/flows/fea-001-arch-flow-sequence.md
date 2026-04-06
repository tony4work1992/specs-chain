# Flow Sequence Architecture
*Version: 2026.04.06 21.00.00*
*Feature: FEA-001 — Deal Pipeline Management*

---

## Flow 1: Deal Stage Transition (Drag-and-Drop with Optimistic UI + Rollback)

```mermaid
sequenceDiagram
  autonumber
  actor Rep as Sales Rep (Browser)
  participant Board as PipelineBoardTemplate (COM_27)
  participant Store as usePipelineBoardStore (Zustand)
  participant Query as TanStack Query (useDealsBoard)
  participant API as NestJS API (DealController)
  participant UC as TransitionDealStageUseCase
  participant DB as PostgreSQL 16
  participant Redis as Redis 7 (Cache)

  Rep->>Board: Drags DealCard from "Qualified" to "Proposal Sent"
  Board->>Store: addPending(dealId, targetStageId)
  Board->>Store: moveCard(dealId, fromStageId, toStageId) [optimistic]
  Board-->>Rep: Card visually moves to "Proposal Sent" column instantly

  Board->>API: PATCH /deals/{id}/stage { target_stage_id }
  activate API
  API->>UC: TransitionDealStageUseCase.execute(dealId, targetStageId, currentUser)

  UC->>DB: SELECT deal WHERE id = dealId
  DB-->>UC: DealEntity { current_stage: Qualified, is_terminal: false }

  UC->>DB: SELECT pipeline_stages ORDER BY order
  DB-->>UC: [New(1), Qualified(2), Proposal Sent(3), Negotiation(4), CW(5,terminal), CL(6,terminal)]

  alt Valid transition (Qualified → Proposal Sent, order=3 follows order=2)
    UC->>DB: BEGIN TRANSACTION
    UC->>DB: UPDATE deals SET current_stage_id=proposalId, stage_entered_at=NOW()
    UC->>DB: INSERT deal_stage_transitions (deal_id, from=qualified, to=proposal, by=repId, at=NOW())
    UC->>DB: COMMIT
    DB-->>UC: Success
    UC->>Redis: DEL pipeline:summary:{managerId}
    Redis-->>UC: OK
    UC-->>API: DealResponseDto (updated)
    API-->>Board: HTTP 200 DealResponseDto
    deactivate API
    Board->>Store: removePending(dealId)
    Board->>Query: invalidateQueries(['deals','board'])
    Query->>API: GET /deals/board (re-fetch)
    API-->>Query: Updated PipelineBoardResponseDto
    Board-->>Rep: Board reconciled with server state

  else Invalid transition (e.g., skip to Negotiation)
    UC-->>API: throw UnprocessableEntityException { error_code: INVALID_STAGE_TRANSITION, allowed_next_stages }
    API-->>Board: HTTP 422 { error_code, from_stage, allowed_next_stages }
    deactivate API
    Board->>Store: rollbackPending(dealId) [revert to Qualified column]
    Board-->>Rep: Card snaps back to "Qualified" with CSS transition
    Board-->>Rep: Sonner toast error: "Stage transition failed: Must go through Proposal Sent first"

  else Deal is in terminal stage
    UC-->>API: throw UnprocessableEntityException { error_code: DEAL_STAGE_TERMINAL }
    API-->>Board: HTTP 422 { error_code: DEAL_STAGE_TERMINAL }
    deactivate API
    Board->>Store: rollbackPending(dealId)
    Board-->>Rep: Card reverts, toast error: "This deal is closed and cannot be moved"
  end
```

---

## Flow 2: Create Deal with Duplicate Check

```mermaid
sequenceDiagram
  autonumber
  actor Rep as Sales Rep (Browser)
  participant Modal as CreateDealModal (COM_21)
  participant RHF as React Hook Form + Zod
  participant API as NestJS API (DealController)
  participant DupUC as DuplicateDealCheckQueryHandler
  participant CreateUC as CreateDealUseCase
  participant DB as PostgreSQL 16
  participant Redis as Redis 7

  Rep->>Modal: Opens "New Deal" modal
  Rep->>Modal: Fills title="Acme Corp Deal", contact=John Smith, value=50000000

  Modal->>RHF: Trigger validation on blur of contact field
  RHF-->>Modal: Validation passed

  Modal->>API: GET /deals/check-duplicate?title=Acme Corp Deal&contact_id={uuid}
  activate API
  API->>DupUC: DuplicateDealCheckQueryHandler.execute(title, contactId)
  DupUC->>DB: SELECT id FROM deals WHERE title ILIKE 'Acme Corp Deal' AND contact_id=uuid AND deleted_at IS NULL LIMIT 1
  DB-->>DupUC: { id: existingDealUUID }
  DupUC-->>API: { duplicate_found: true, existing_deal_id: existingDealUUID }
  API-->>Modal: HTTP 200 { duplicate_found: true, existing_deal_id }
  deactivate API

  Modal-->>Rep: DuplicateWarningBanner shown: "A deal with this title and contact already exists. Continue?"

  alt Rep clicks Confirm
    Rep->>Modal: Clicks "Create Anyway"
    Modal->>RHF: Final form validation
    RHF-->>Modal: All fields valid

    Modal->>API: POST /deals { title, contact_id, value, currency, expected_close_date, ... }
    activate API
    API->>CreateUC: CreateDealUseCase.execute(dto, currentUser)
    CreateUC->>DB: SELECT pipeline_stages WHERE order=1 (get initial stage ID)
    DB-->>CreateUC: { id: newStageId, name: "New" }
    CreateUC->>DB: INSERT INTO deals (...) VALUES (...)
    DB-->>CreateUC: DealEntity { id: newDealUUID }
    CreateUC->>DB: INSERT INTO deal_stage_transitions (deal_id, from=null, to=newStageId, ...)
    DB-->>CreateUC: Success
    CreateUC->>Redis: DEL pipeline:summary:{managerId}
    Redis-->>CreateUC: OK
    CreateUC-->>API: DealResponseDto
    API-->>Modal: HTTP 201 DealResponseDto
    deactivate API

    Modal-->>Rep: Modal closes, Sonner toast: "Deal created successfully"
    Modal->>API: invalidateQueries(['deals','board'])

  else Rep clicks Cancel
    Rep->>Modal: Clicks "Cancel"
    Modal-->>Rep: Warning banner dismissed, form remains open for editing
  end
```

---

## Flow 3: Pipeline Summary Cache-Aside with Invalidation

```mermaid
sequenceDiagram
  autonumber
  actor Manager as Sales Manager (Browser)
  participant SummaryBar as PipelineSummaryBarOrganism (COM_24)
  participant TQ as TanStack Query (usePipelineSummary, refetchInterval=30s)
  participant API as NestJS API (DealSummaryController)
  participant QH as GetPipelineSummaryQueryHandler
  participant Redis as Redis 7
  participant DB as PostgreSQL 16

  note over TQ: Auto-refetch triggered every 30 seconds

  TQ->>API: GET /deals/summary (with active filters)
  activate API
  API->>QH: GetPipelineSummaryQueryHandler.execute(managerId, filters)

  QH->>Redis: GET pipeline:summary:{managerId}

  alt Cache HIT
    Redis-->>QH: Cached JSON { total_active_deals, total_pipeline_value, win_rate, ... }
    QH-->>API: PipelineSummaryResponseDto (cached_at = original write time)
    API-->>TQ: HTTP 200 PipelineSummaryResponseDto
    deactivate API
    TQ-->>SummaryBar: Renders metrics instantly

  else Cache MISS (first load or TTL expired)
    Redis-->>QH: null
    QH->>DB: SELECT COUNT(*) active deals (no terminal stage, deleted_at IS NULL)
    DB-->>QH: { total_active_deals: 47 }
    QH->>DB: SELECT SUM(value) FROM deals WHERE active
    DB-->>QH: { total_pipeline_value: 2340000000 }
    QH->>DB: SELECT current_stage_id, SUM(value) GROUP BY current_stage_id WHERE active
    DB-->>QH: value_by_stage[]
    QH->>DB: SELECT COUNT(*) Closed Won + Closed Lost last 30 days
    DB-->>QH: { won: 12, lost: 5 }
    QH->>DB: SELECT AVG(closed_at - created_at) for Closed Won last 30 deals
    DB-->>QH: { avg_cycle_time_days: 18.4 }
    QH->>Redis: SET pipeline:summary:{managerId} {serialized} EX 30
    Redis-->>QH: OK
    QH-->>API: PipelineSummaryResponseDto
    API-->>TQ: HTTP 200 PipelineSummaryResponseDto
    deactivate API
    TQ-->>SummaryBar: Renders up-to-date metrics
  end

  note over API, Redis: Concurrent write operation (e.g., Rep transitions a deal)
  API->>Redis: DEL pipeline:summary:{managerId}
  Redis-->>API: OK (cache invalidated)
  note over TQ: Next 30s poll will trigger Cache MISS path and return fresh data
```

---

## Flow 4: Async CSV Export (>500 rows)

```mermaid
sequenceDiagram
  autonumber
  actor Manager as Sales Manager (Browser)
  participant ListPage as DealListTableOrganism (COM_25)
  participant API as NestJS API (DealExportController)
  participant ExportUC as ExportDealsCommand
  participant Bull as Bull Queue (Redis-backed)
  participant Worker as Bull Worker (ExportDealsJob)
  participant DB as PostgreSQL 16
  participant S3 as AWS S3
  participant Redis as Redis 7 (Job Status)
  participant Poll as Frontend Polling (setInterval 3s)

  Manager->>ListPage: Clicks "Export CSV" button (filtered: 750 deals)
  ListPage->>API: POST /deals/export { filters, format: 'csv' }
  activate API
  API->>ExportUC: ExportDealsCommand.execute(filters)
  ExportUC->>DB: SELECT COUNT(*) matching filters
  DB-->>ExportUC: { count: 750 }

  alt count > 500 (async path)
    ExportUC->>Bull: queue.add('export-deals', { jobId, filters }) 
    Bull->>Redis: LPUSH bull:deal-exports:wait {...}
    ExportUC->>Redis: HSET deal_export:{jobId} status PENDING
    ExportUC-->>API: { job_id: jobId }
    API-->>ListPage: HTTP 202 { job_id: jobId }
    deactivate API
    ListPage-->>Manager: Shows "Preparing export..." toast with progress indicator

    activate Poll
    loop Every 3 seconds
      Poll->>API: GET /deals/export/{jobId}/status
      API->>Redis: HGET deal_export:{jobId} status
      Redis-->>API: PENDING or PROCESSING
      API-->>Poll: { status: 'PROCESSING' }
      Poll-->>Manager: Toast still showing "Preparing..."
    end

    activate Worker
    Worker->>DB: SELECT all deals matching filters (max 1000 rows)
    DB-->>Worker: DealListItemDto[] (750 rows)
    Worker->>Redis: HSET deal_export:{jobId} status PROCESSING
    Worker->>Worker: Generate CSV via fast-csv (stream)
    Worker->>S3: PutObject(bucket=deal-exports, key={jobId}.csv, body=csvBuffer)
    S3-->>Worker: ETag confirmed
    Worker->>S3: GetSignedUrl(key={jobId}.csv, expires=3600)
    S3-->>Worker: Pre-signed URL
    Worker->>Redis: HSET deal_export:{jobId} status COMPLETED download_url {url}
    deactivate Worker

    Poll->>API: GET /deals/export/{jobId}/status
    API->>Redis: HGET deal_export:{jobId} status + download_url
    Redis-->>API: { status: COMPLETED, download_url: https://... }
    API-->>Poll: { status: 'COMPLETED', download_url }
    deactivate Poll

    Poll-->>Manager: window.open(download_url) — browser downloads CSV
    ListPage-->>Manager: Toast updated: "Export ready — downloading"

  else count <= 500 (sync path)
    ExportUC->>DB: SELECT all deals matching filters
    DB-->>ExportUC: DealListItemDto[] (≤500 rows)
    ExportUC->>ExportUC: Generate CSV via fast-csv
    API-->>ListPage: HTTP 200 Content-Type: text/csv (file download stream)
    ListPage-->>Manager: Browser triggers direct file download
  end
```

---

## Flow 5: Stale Deal Cron Execution

```mermaid
sequenceDiagram
  autonumber
  participant Scheduler as NestJS Scheduler (@Cron every hour)
  participant UseCase as UpdateDealStalenessUseCase
  participant DB as PostgreSQL 16
  participant Logger as pino Logger

  Scheduler->>UseCase: execute() triggered at top of every hour
  activate UseCase
  UseCase->>Logger: info { context: UpdateDealStalenessUseCase, msg: "Cron started" }

  UseCase->>DB: SELECT id, stage_entered_at FROM deals WHERE deleted_at IS NULL AND current_stage.is_terminal = false
  DB-->>UseCase: ActiveDealStalenessRow[] (e.g., 180 rows)

  UseCase->>UseCase: For each deal: compute staleness_level
  note over UseCase: staleness = NOW() - stage_entered_at
  note over UseCase: < 14d → NORMAL, 14–30d → WARNING, > 30d → CRITICAL

  UseCase->>DB: UPDATE deals SET staleness_level = CASE\n WHEN id IN (...NORMAL_IDS) THEN 'NORMAL'\n WHEN id IN (...WARNING_IDS) THEN 'WARNING'\n WHEN id IN (...CRITICAL_IDS) THEN 'CRITICAL'\n END\n WHERE id IN (...ALL_SCANNED_IDS)
  DB-->>UseCase: rowsAffected: 12

  UseCase->>Logger: info { context: UpdateDealStalenessUseCase, scanned: 180, updated: 12, duration_ms: 234 }
  deactivate UseCase

  alt Cron throws unhandled error
    UseCase->>Logger: error { context: UpdateDealStalenessUseCase, error: err.message, stack: err.stack }
    note over UseCase: Error is caught — process continues. Cron does not crash the API.
  end
```
