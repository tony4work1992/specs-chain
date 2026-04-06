---
document_type: project-foundation
foundation_id: "02"
title: Architecture Patterns
version: "1.0.0"
status: draft
---

# Foundation 02: Architecture Patterns

## 1. Macro-Architecture (System Layout)
| System Type | Chosen Strategy | Justification |
|-------------|-----------------|---------------|
| **Deployment** | Modular Monolith | Team size is small-to-medium. Microservices overhead is unjustified at this scale. Monolith with strict module boundaries allows future extraction if needed. |
| **Communication** | REST (primary) + WebSocket (real-time dashboard) | Synchronous REST for CRUD operations; WebSocket for live pipeline board updates and notification pushes. |

## 2. Bounded Contexts (DDD)
1. **Identity & Access:** Handles authentication, user accounts, roles (Sales Rep, Manager, Admin), and permission enforcement.
2. **Lead & Contact:** Manages raw leads from inbound sources, contact profiles, company records, and ownership assignment.
3. **Deal Pipeline:** Handles deal lifecycle (stages: New → Qualified → Proposal → Negotiation → Closed Won/Lost), deal value, and probability tracking.
4. **Activity & Timeline:** Logs all touchpoints — calls, emails, meetings, notes — anchored to a Contact or Deal entity.
5. **Reporting & Analytics:** Aggregates cross-context data for KPI dashboards, win-rate reports, and pipeline revenue projections. Read-model only.
6. **Notification:** Handles in-app alerts, reminders (follow-up due dates), and future email/Slack webhook dispatch.

## 3. Micro-Architecture (Internal Pattern)
- **Chosen Pattern:** Clean Architecture (strict layering per bounded context module)
- **Layering Stricture:**
  - `Domain`: Entities, Value Objects, Domain Events, Repository Interfaces. Zero external dependencies.
  - `Application`: Use Cases (Commands + Queries), DTOs, Port interfaces. Depends only on Domain.
  - `Infrastructure`: TypeORM repositories, external adapters, cache clients. Implements Domain ports.
  - `Presentation`: NestJS Controllers, Guards, Pipes, Swagger decorators. Depends only on Application DTOs.

## 4. Hard Anti-Patterns (Enforced by default)
> [!WARNING]
> The following actions are STRICTLY forbidden in this codebase:
- **Dependency Rule Violation:** Domain or Application layers MUST NOT import from Infrastructure or Presentation.
- **Leaking Domain Models:** Database entities (`*.entity.ts`) MUST NEVER be returned directly from Controllers. All API responses MUST go through Response DTOs + Mappers.
- **Cross-Domain Database Access:** The `deal-pipeline` module MUST NOT execute raw SQL against the `activity` module's tables. Cross-context reads go through Application Service interfaces.
- **Fat Controllers:** Business logic MUST live in Use Cases, never inside NestJS controllers.
- **God Services:** A single service class MUST NOT exceed one use case boundary (e.g., `DealService` must not also handle Contact queries).
