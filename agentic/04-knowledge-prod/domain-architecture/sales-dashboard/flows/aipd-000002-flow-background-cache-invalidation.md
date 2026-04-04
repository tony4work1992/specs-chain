<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 003.Software Architecture Workflow/Flow Sequence Architecture.md
Source-Version: 2026.04.03 14.29.29
Sections: Background Poller & Distributed Cache Invalidation
-->

# **Flow: Background Cache Invalidation (AIPD-000002)**

## Background Poller & Distributed Cache Invalidation
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
