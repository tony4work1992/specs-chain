# Flow Sequence Architecture
*Request Version: 2026.04.03 14.29.29*

## 1. Synchronous vs Asynchronous PDF Generation Flow
This diagram models the explicit race conditions managed by the `AbortController` against distant generic RPC executions.

```mermaid
sequenceDiagram
  autonumber
  actor User as Account Executive (Client)
  participant UI as React: DashboardLayout
  participant GW as NestJS: API Gateway
  participant RPC as Puppeteer Worker
  participant S3 as AWS S3 Storage
  
  User->>UI: Clicks "Export PDF"
  activate UI
  note over UI: set_isExportingPdf(true)<br/>Mount <LoadingOverlay />
  
  UI->>GW: POST /api/v1/export/pdf
  activate GW
  GW->>GW: Validate DTO (Gap > 365 days?)
  
  GW->>RPC: gRPC: dispatchRenderJob(payload)
  activate RPC
  note right of UI: AbortController(15000) waiting...

  RPC->>RPC: Launch Chrome --no-sandbox<br/>Render DOM
  RPC->>S3: PUT Blob Object
  activate S3
  S3-->>RPC: Success (Status 200)
  deactivate S3
  
  RPC-->>GW: Render Result (Object Key)
  deactivate RPC
  
  GW->>S3: Request Presigned URL (1 Hr TTL)
  activate S3
  S3-->>GW: Return PreSigned String
  deactivate S3
  
  GW-->>UI: HTTP 200 { downloadUrl }
  deactivate GW
  
  note over UI: set_isExportingPdf(false)<br/>Unmount <LoadingOverlay />
  UI->>User: Auto-trigger Download
  deactivate UI
```

## 2. Background Poller & Distributed Cache Invalidation
This diagram models the headless distributed synchronization architecture.

```mermaid
sequenceDiagram
  autonumber
  actor Cron as NestJS: Cron Scheduler
  participant GW as NestJS: Application Logic
  participant CRM as External Provider CRM
  participant DB as MongoDB 7
  participant Event as EventBus PubSub
  participant Redis as Redis Cache Cluster
  
  Cron->>GW: Trigger '*/5 * * * *'
  activate GW
  
  GW->>CRM: GET /v1/deals/delta (Bearer)
  activate CRM
  CRM-->>GW: Returns JSON Array
  deactivate CRM
  
  GW->>DB: Bulk Upsert $set mapped documents
  activate DB
  DB-->>GW: Write Acknowledgment
  deactivate DB
  
  GW->>Event: Emit 'sync.completed.invalidate_cache'
  deactivate GW
  
  activate Event
  Event->>Redis: Trigger Listener
  deactivate Event
  
  activate Redis
  note over Redis: Execute SCAN 0 MATCH sales:aggregate:*
  Redis->>Redis: Execute UNLINK on matched hashes
  deactivate Redis
```
