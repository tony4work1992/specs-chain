# Foundation 04: Project Structure & Conventions

> **SA Instructions:** Define the exact ASCII folder tree. The AI will output files strictly according to this tree.

## 1. Monorepo Layout
- **Strategy:** Turborepo
```text
Root
 ├── apps/
 │   ├── web/           (Next.js Frontend User/HR)
 │   ├── auth-api/      (NestJS - Identity Context)
 │   ├── attend-api/    (NestJS - Attendance Context)
 │   └── report-api/    (NestJS - Reporting Context)
 └── packages/
     ├── database/      (Prisma schema & clients)
     ├── types/         (Shared Zod schemas & TS Interfaces)
     └── ui/            (Shared Tailwind/React components library)
```

## 2. Frontend Directory Strict Schema
_Based on Feature Sliced Design (FSD)_
```text
apps/web/src/
 ├── app/       # Routing, Global Providers, Layouts
 ├── processes/ # Phối hợp các luồng (VD: Quy trình xin nghỉ OTP)
 ├── pages/     # Component Page Map trực tiếp với URL
 ├── widgets/   # Khối UI độc lập (Header, CheckinPanel)
 ├── features/  # Nghiệp vụ người dùng (CheckInButton, FilterEmployees)
 ├── entities/  # Dữ liệu & UI cốt lõi (UserCard, TimesheetRow)
 └── shared/    # API instances, Utils, Hooks, UIKit cơ bản
```

## 3. Backend Directory Strict Schema
_Based on Clean Architecture within NestJS_
```text
apps/[service-name]/src/modules/
 ├── [module-name]/
 │   ├── domain/          # Entities/Value Objects
 │   ├── application/     # Use Cases, Mappers, CQRS Handlers
 │   ├── infrastructure/  # Prisma Repos, Redis Adapters
 │   └── presentation/    # Cột thu tín hiệu (HTTP REST Controllers, DTOs)
```

## 4. Naming Conventions Lock
| Target | Casing Rule | Suffix Rule | Example |
|--------|-------------|-------------|---------|
| **Folders** | `kebab-case` | None | `leave-request/` |
| **UI Components** | `PascalCase` | `.tsx` | `TimeTracker.tsx` |
| **Backend Classes** | `PascalCase` | Layer specific | `Attendance.controller.ts`, `CheckIn.usecase.ts` |
| **Interfaces** | `PascalCase` | No Prefix `I` | `UserRepository` (not IUserRepository) |
