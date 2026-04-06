---
document_type: project-foundation
foundation_id: "04"
title: Project Structure & Conventions
version: "1.0.0"
status: draft
---

# Foundation 04: Project Structure & Conventions

## 1. Monorepo Layout
- **Strategy:** Turborepo (pnpm workspaces)
```text
sales-management/
 ├── apps/
 │   ├── web/          # Next.js 14 Frontend
 │   └── api/          # NestJS Backend
 ├── packages/
 │   ├── database/     # TypeORM entities + migrations (shared)
 │   ├── ui/           # Shared Shadcn/ui component library
 │   └── types/        # Shared TypeScript interfaces & enums
 ├── docs/             # Agentic OS artifacts, knowledge base
 ├── turbo.json
 ├── pnpm-workspace.yaml
 └── package.json
```

## 2. Frontend Directory Strict Schema
_Based on Feature Sliced Design (FSD)_
```text
apps/web/src/
 ├── app/                    # Next.js App Router — layouts, pages, route groups
 │   ├── (auth)/             # Auth route group (login, forgot-password)
 │   ├── (dashboard)/        # Protected route group
 │   │   ├── leads/
 │   │   ├── deals/
 │   │   ├── contacts/
 │   │   ├── activities/
 │   │   └── reports/
 │   └── layout.tsx
 ├── widgets/                # Cross-domain standalone blocks
 │   ├── deal-pipeline-board/
 │   ├── activity-timeline/
 │   └── kpi-summary-bar/
 ├── features/               # Business operations (user-triggered actions)
 │   ├── create-deal/
 │   ├── log-activity/
 │   ├── assign-lead/
 │   └── export-report/
 ├── entities/               # Business data models + API hooks
 │   ├── deal/
 │   ├── lead/
 │   ├── contact/
 │   └── user/
 └── shared/                 # Generic utilities, UI primitives, constants
     ├── ui/                 # Base Shadcn components re-exports
     ├── lib/                # axios instance, queryClient, date utils
     ├── hooks/              # Generic hooks (useDebounce, usePagination)
     └── constants/          # Enums, route paths, config keys
```

## 3. Backend Directory Strict Schema
_Based on Clean Architecture — per bounded context module_
```text
apps/api/src/
 ├── modules/
 │   ├── identity/            # Auth, Users, Roles
 │   │   ├── domain/
 │   │   ├── application/
 │   │   ├── infrastructure/
 │   │   └── presentation/
 │   ├── lead-contact/        # Leads, Contacts, Companies
 │   │   ├── domain/
 │   │   ├── application/
 │   │   ├── infrastructure/
 │   │   └── presentation/
 │   ├── deal-pipeline/       # Deals, Stages, Pipeline
 │   │   ├── domain/
 │   │   ├── application/
 │   │   ├── infrastructure/
 │   │   └── presentation/
 │   ├── activity/            # Calls, Emails, Meetings, Notes
 │   │   ├── domain/
 │   │   ├── application/
 │   │   ├── infrastructure/
 │   │   └── presentation/
 │   ├── reporting/           # Read models, aggregated queries
 │   │   ├── application/
 │   │   ├── infrastructure/
 │   │   └── presentation/
 │   └── notification/        # In-app alerts, reminder scheduler
 │       ├── domain/
 │       ├── application/
 │       ├── infrastructure/
 │       └── presentation/
 ├── shared/
 │   ├── guards/              # JwtAuthGuard, RolesGuard
 │   ├── decorators/          # @CurrentUser(), @Roles()
 │   ├── filters/             # GlobalExceptionFilter
 │   ├── interceptors/        # LoggingInterceptor, TransformInterceptor
 │   └── pipes/               # ValidationPipe config
 └── main.ts
```

## 4. Naming Conventions Lock
| Target | Casing Rule | Suffix Rule | Example |
|--------|-------------|-------------|---------|
| **Folders** | `kebab-case` | None | `deal-pipeline/` |
| **UI Components** | `PascalCase` | `.tsx` | `DealCard.tsx` |
| **Page files** | `kebab-case` | `page.tsx` | `app/(dashboard)/deals/page.tsx` |
| **Feature hooks** | `camelCase` | `use` prefix | `useCreateDeal.ts` |
| **Backend Classes** | `PascalCase` | Layer-specific | `CreateDealUseCase.ts`, `DealRepository.ts` |
| **Entities** | `PascalCase` | `.entity.ts` | `Deal.entity.ts` |
| **DTOs** | `PascalCase` | `.dto.ts` | `CreateDealDto.ts`, `DealResponseDto.ts` |
| **Interfaces** | `PascalCase` | `I` prefix | `IDealRepository` |
| **Enums** | `PascalCase` | `Enum` suffix | `DealStageEnum` |
| **Constants** | `SCREAMING_SNAKE_CASE` | None | `MAX_DEALS_PER_PAGE` |
| **Database Migrations** | `timestamp-kebab` | None | `1714000000000-create-deals-table.ts` |
