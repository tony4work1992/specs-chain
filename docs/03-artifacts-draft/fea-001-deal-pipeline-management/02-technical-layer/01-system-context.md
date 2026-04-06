# **SYSTEM CONTEXT INFORMATION**

**Request Version:** 2026.04.06 21.00.00
**Version:** 2026.04.06 21.00.00
**Parent Version:** 2026.04.06 21.00.00

## **Project / Feature: FEA-001 — Deal Pipeline Management**

---

## **1. Document Purpose**

This document outlines the high-level technical context, architectural constraints, and system environment for **FEA-001 — Deal Pipeline Management**. It serves as a foundational reference for Technical Requirement Workflows (FRD generation, Tactic Architecture, Code Generation) by Solution Architects and System Builders. All implementation decisions for this feature must be bounded strictly by the specifications in this document.

---

## **2. Core Technology Stack**

* **Frontend Framework:** Next.js 14 (App Router, TypeScript v5.4.x)
* **Backend Framework:** NestJS v10 (TypeScript v5.4.x, Node.js v20.x LTS)
* **Programming Languages:** TypeScript v5.4.x (full-stack)
* **Mobile Environment:** Not applicable — web-only for MVP
* **UI/UX Core Libraries:** TailwindCSS v3, Shadcn/ui (Radix Primitives), @dnd-kit/core + @dnd-kit/sortable (drag-and-drop), Recharts v2 (summary bar metrics), React Hook Form v7 + Zod v3 (deal form validation), TanStack Table v8 (deal list view), TanStack Query v5 (server state), Zustand v4 (local board UI state), Framer Motion v11 (card animations)

---

## **3. Database & Storage Architecture**

* **Primary Relational Database:** PostgreSQL 16 — stores all deal entities, stage configuration, and stage transition history
* **Primary NoSQL Database:** Not applicable for this feature
* **Caching & In-Memory Store:** Redis 7 (ioredis v5) — caches Pipeline Summary Bar aggregates (30-second TTL); cache invalidated on any deal stage transition or creation
* **File & Object Storage:** AWS S3 — future deal attachments (not in MVP scope); S3 client wired but no upload endpoints in this feature
* **Message Broker / Streaming:** Not applicable for this feature — no async event dispatch required in MVP

---

## **4. System Architecture & Design Patterns**

* **Architecture Style:** Modular Monolith — `deal-pipeline` is a self-contained NestJS module with strict boundaries; no cross-module DB access
* **Core Design Patterns:**
  - Domain-Driven Design (DDD): `Deal` is the Aggregate Root; `DealStageTransition` is a Value Object audit record
  - Clean Architecture: 4-layer strict separation (Domain → Application → Infrastructure → Presentation)
  - CQRS (lightweight): Write operations (create, update, transition stage) use Command Use Cases; Read operations (list, pipeline board, summary) use Query Use Cases with dedicated read DTOs
  - Repository Pattern: `IDealRepository` interface in Domain; `DealTypeOrmRepository` in Infrastructure
* **Communication Protocols:** REST API (JSON/HTTPS) — primary CRUD; no WebSocket for MVP (board uses TanStack Query polling at 30s interval for summary bar only)
* **Authentication & Authorization:** JWT RS256 (short-lived 15m access token). `JwtAuthGuard` on all endpoints. `RolesGuard` enforcing Sales Rep (own deals only) / Sales Manager (all deals) / Admin (all deals + config) via `@Roles()` decorator.

---

## **5. Infrastructure & Deployment Environment**

* **Hosting Provider:** AWS (ap-southeast-1 region)
* **Containerization & Orchestration:** Docker (multi-stage Alpine build), ECS Fargate (no EC2 management), AWS ECR (image registry)
* **CI/CD Pipeline:** GitHub Actions — lint → typecheck → test (Vitest, 80% coverage threshold) → Docker build → ECR push → ECS deploy (Blue/Green)
* **Environment Setup:** 3 tiers — `local` (Docker Compose), `staging` (ECS Fargate Single-AZ RDS), `production` (ECS Fargate Multi-AZ RDS + Redis ElastiCache)

---

## **6. Integration & External Dependencies**

* **Payment Gateways:** Not applicable
* **Communication Services:** Not applicable (email integration deferred to post-MVP)
* **Internal Core Systems:**
  - **Identity Module (`identity`):** Provides `UserEntity` and JWT validation. The `deal-pipeline` module consumes `IUserRepository` interface to resolve deal owner names for response DTOs. MUST NOT import `UserEntity` directly — use `UserSummaryDto` cross-module interface.
  - **Lead & Contact Module (`lead-contact`):** Provides `ContactEntity` and `CompanyEntity`. Deals must link to a valid Contact UUID. `deal-pipeline` module reads contact display data via `IContactQueryService` interface — MUST NOT join directly against `contacts` table in deal queries.
  - **Activity Module (`activity`):** Not yet built. Deal Detail Page will embed activity timeline via a separate API call from the frontend directly to `/activities?deal_id=`. No backend coupling in this feature.
* **Third-Party APIs:** Not applicable for this feature

---

## **7. Key Technical Mechanisms**

* **Background Processing & Cron Jobs:**
  - **Stale Deal Flagging Cron:** Scheduled NestJS `@Cron` task running every hour. Scans active deals where `(NOW() - stage_entered_at) > 14 days`. Updates a computed `staleness_level` field (`NORMAL | WARNING | CRITICAL`) on the `deals` table. This avoids real-time calculation on every board load.
  - **Pipeline Summary Cache Warmer:** Redis cache for pipeline summary is written on-demand (cache-aside pattern). No dedicated warmer cron needed — first request after TTL expiry triggers a fresh DB aggregate query and re-populates cache.

* **Data Migration & Synchronization:** TypeORM `migration:generate` CLI MUST be used for all schema changes (per System Rule 2.9). No hand-authored migration files. Seed data for `pipeline_stages` table is injected via a TypeORM seeder script run on first deployment.

* **Logging & Monitoring:** `pino` v8 structured JSON logs. Every request logs `traceId`, `userId`, `context: DealController | CreateDealUseCase`, HTTP method, path, status, duration. AWS CloudWatch aggregation. OpenTelemetry traces for DB query spans.

* **Error Handling & Retry Mechanisms:**
  - HTTP 422 Unprocessable Entity returned for invalid stage transitions (with machine-readable error code `INVALID_STAGE_TRANSITION`)
  - HTTP 403 Forbidden for rep accessing another rep's deal
  - HTTP 409 Conflict for duplicate deal detection (non-blocking — returns warning in response body alongside 200 OK on creation)
  - No retry/circuit breaker needed for this feature (no external API calls in MVP)

---

## **8. Constraints & Assumptions**

* **Technical Constraints:**
  - Maximum 200 active deals rendered on the pipeline board in a single load. Pagination is applied per-stage column (load more per column) for boards exceeding this limit.
  - CSV export is capped at 1,000 rows; exports > 500 rows are processed as background jobs returning a download URL (S3 pre-signed).
  - All deal IDs are UUIDs v4 — no sequential integer IDs exposed in URLs.
  - The `deals` table MUST include `deleted_at` (soft-delete column) managed by TypeORM `@DeleteDateColumn`. Hard deletes are forbidden.
  - Stage transition validation MUST be enforced at the Application layer (Use Case), NOT solely at the Controller or DB constraint level.

* **Technical Assumptions:**
  - `pipeline_stages` table is pre-seeded with the 6 canonical stages at deployment time and is read-only at runtime for this feature.
  - `contacts` table and its UUID primary keys exist and are stable before deal creation is enabled.
  - Redis is available and healthy; if Redis is down, pipeline summary falls back to direct DB query (graceful degradation — no 500 error).

---

## **9. Specific Feature Configurations**

* **@dnd-kit/core + @dnd-kit/sortable:** Used exclusively for the Kanban board drag-and-drop. `DragOverlay` component provides ghost card during drag. `useSortable` hook wraps each `DealCard`. Collision detection strategy: `closestCenter`.
* **TanStack Query v5 `useInfiniteQuery`:** Used for per-stage column infinite scroll (load more deals per stage). `queryKey: ['deals', 'stage', stageId]`. Invalidated on any deal mutation.
* **class-validator + class-transformer (NestJS):** All incoming request DTOs decorated with `@IsUUID()`, `@IsPositive()`, `@IsEnum(DealStageEnum)` etc. `ValidationPipe` set globally with `whitelist: true, forbidNonWhitelisted: true`.
* **Zustand v4 `usePipelineBoardStore`:** Local ephemeral state for optimistic UI during drag. Stores `pendingTransitions: Map<dealId, targetStage>`. Cleared on server confirmation or rollback.

---

## **10. Component Registry**

The following is the finite, canonical list of all architectural components involved in FEA-001. All Functional Specifications, Testing Requirements, and Tactic Architecture files MUST reference these component identifiers.

* **Component 1: Next.js Web Client** — React frontend application served via Vercel. Hosts the Pipeline Board page, Deal Detail page, and Deal List page.
* **Component 2: NestJS REST API Gateway** — The primary backend. Hosts the `DealPipelineModule`. Handles all CRUD, stage transitions, and aggregate queries for deals.
* **Component 3: PostgreSQL 16 Database** — Primary persistence. Stores `deals`, `pipeline_stages`, `deal_stage_transitions` tables.
* **Component 4: Redis 7 Cache** — Caches pipeline summary aggregates. Key: `pipeline:summary:{managerId}`. TTL: 30 seconds.
* **Component 5: Stale Deal Cron Worker** — NestJS `@Cron` scheduler (runs inside the same API process for MVP). Updates `staleness_level` on deals hourly.
* **Component 6: S3 Export Storage** — Stores async CSV export files. Pre-signed URLs returned to client for download. Used only for exports > 500 rows.
