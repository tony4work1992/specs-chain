# Strategic Design (C4 Model)
*Version: 2026.04.06 21.00.00*
*Feature: FEA-001 — Deal Pipeline Management*

---

## Context Diagram (Level 1)

```mermaid
C4Context
  title System Context — Sales Management System (FEA-001 Deal Pipeline)

  Person(salesRep, "Sales Representative", "Creates and manages own deals through the pipeline")
  Person(salesManager, "Sales Manager", "Oversees full team pipeline, views aggregate metrics")
  Person(admin, "Admin", "Configures pipeline stages, manages users")

  System(sms, "Sales Management System", "Web-based internal platform for managing the full B2B sales lifecycle from lead to deal closure")

  System_Ext(awsS3, "AWS S3", "Stores async CSV export files. Pre-signed URLs served to clients.")
  System_Ext(cloudwatch, "AWS CloudWatch", "Receives structured pino JSON logs and OpenTelemetry traces from the API")
  System_Ext(activityModule, "Activity Module API", "Separate internal module providing activity timeline records linked to deals")

  Rel(salesRep, sms, "Creates/manages own deals, views pipeline board", "HTTPS/Browser")
  Rel(salesManager, sms, "Views all deals, pipeline summary, bulk actions", "HTTPS/Browser")
  Rel(admin, sms, "Configures stages, manages system", "HTTPS/Browser")
  Rel(sms, awsS3, "Uploads async CSV exports", "HTTPS/AWS SDK")
  Rel(sms, cloudwatch, "Streams structured logs and traces", "HTTPS/OTLP")
  Rel(sms, activityModule, "Reads activity records linked to deal_id", "Internal REST")
```

---

## Container Diagram (Level 2)

```mermaid
C4Container
  title Container Diagram — FEA-001 Deal Pipeline Management

  Person(salesRep, "Sales Rep", "Daily deal operator")
  Person(salesManager, "Sales Manager", "Pipeline oversight")

  System_Boundary(sms, "Sales Management System") {

    Container(webClient, "Next.js Web Client", "Next.js 14 / TypeScript / TanStack Query / Zustand / @dnd-kit", "Renders Pipeline Board (Kanban), Deal Detail Page, Deal List View, and Pipeline Summary Bar. Handles optimistic UI for stage transitions.")

    Container(apiGateway, "NestJS REST API Gateway", "NestJS v10 / TypeScript / Clean Architecture", "Hosts DealPipelineModule with 4 clean layers. Enforces JWT auth, RBAC, ownership checks. Exposes 13 REST endpoints for deals. Runs Stale Deal Cron job internally.")

    ContainerDb(postgresDb, "PostgreSQL 16", "AWS RDS Multi-AZ", "Stores deals, pipeline_stages, deal_stage_transitions tables. pg_trgm extension for full-text search on deal titles.")

    ContainerDb(redisCache, "Redis 7", "AWS ElastiCache", "Caches pipeline summary aggregates (30s TTL per manager). Stores async CSV export job status hashes. Used for rate limiting middleware.")

    Container(cronWorker, "Stale Deal Cron Worker", "NestJS @Cron (in-process)", "Runs hourly. Scans all active deals, computes staleness_level (NORMAL/WARNING/CRITICAL), and bulk-updates the deals table.")
  }

  System_Ext(awsS3, "AWS S3", "Export CSV storage")
  System_Ext(activityApi, "Activity Module", "Activity records per deal")
  System_Ext(identityModule, "Identity Module", "User resolution (UserSummaryDto)")
  System_Ext(contactModule, "Lead & Contact Module", "Contact/Company resolution (ContactSummaryDto)")

  Rel(salesRep, webClient, "Uses pipeline board, creates deals", "HTTPS")
  Rel(salesManager, webClient, "Views full pipeline, bulk actions, summary bar", "HTTPS")

  Rel(webClient, apiGateway, "REST API calls (JWT Bearer)", "JSON/HTTPS")
  Rel(webClient, activityApi, "GET /activities?deal_id= (separate fetch)", "JSON/HTTPS")

  Rel(apiGateway, postgresDb, "Reads and writes deal data", "SQL/TCP — TypeORM")
  Rel(apiGateway, redisCache, "Cache read/write for summary + export jobs", "Redis protocol/TCP — ioredis")
  Rel(apiGateway, awsS3, "Uploads CSV export files, generates pre-signed URLs", "HTTPS/AWS SDK")
  Rel(apiGateway, identityModule, "Resolves UserSummaryDto by user_id", "In-process module interface")
  Rel(apiGateway, contactModule, "Resolves ContactSummaryDto by contact_id", "In-process module interface")

  Rel(cronWorker, postgresDb, "Bulk UPDATE deals.staleness_level", "SQL/TCP — TypeORM")
```

---

## Bounded Context Map

```mermaid
graph LR
  subgraph DealPipeline["Deal Pipeline BC (FEA-001)"]
    D[Deal Aggregate Root]
    PS[PipelineStage - Read-only Reference]
    DST[DealStageTransition - Audit Record]
  end

  subgraph Identity["Identity BC"]
    U[User Entity]
  end

  subgraph LeadContact["Lead & Contact BC"]
    C[Contact Entity]
    CO[Company Entity]
  end

  subgraph Activity["Activity BC"]
    A[Activity Entity]
  end

  D -- "assigned_rep_id (cross-BC ref)" --> U
  D -- "contact_id (cross-BC ref)" --> C
  D -- "company_id (optional cross-BC ref)" --> CO
  A -- "deal_id (cross-BC ref)" --> D

  style DealPipeline fill:#dbeafe,stroke:#2563eb
  style Identity fill:#f0fdf4,stroke:#16a34a
  style LeadContact fill:#fef9c3,stroke:#ca8a04
  style Activity fill:#fce7f3,stroke:#db2777
```

---

## Deployment Architecture

```mermaid
graph TB
  subgraph Internet
    CF[Cloudflare WAF + DNS]
  end

  subgraph AWS["AWS ap-southeast-1"]
    subgraph Public["Public Subnet"]
      ALB[Application Load Balancer]
    end

    subgraph Private["Private Subnet"]
      ECS[ECS Fargate Task: NestJS API + Cron]
    end

    subgraph Isolated["Isolated Subnet"]
      RDS[RDS PostgreSQL 16 Multi-AZ]
      EC[ElastiCache Redis 7]
    end

    S3[S3 Bucket: deal-exports]
    ECR[ECR: sales-api image]
  end

  VERCEL[Vercel CDN: Next.js Web Client]

  Browser --> CF --> ALB --> ECS
  ECS --> RDS
  ECS --> EC
  ECS --> S3
  VERCEL --> CF
```
