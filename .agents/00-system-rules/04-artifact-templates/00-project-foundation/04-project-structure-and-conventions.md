# Foundation 04: Project Structure & Conventions

> **SA Instructions:** Define the exact ASCII folder tree. The AI will output files strictly according to this tree.

## 1. Monorepo Layout
- **Strategy:** [e.g., Turborepo]
```text
Root
 ├── apps/
 │   ├── web/ (Frontend Application)
 │   └── api/ (Backend Application)
 └── packages/
     ├── database/ (Shared Prisma schema)
     └── ui/ (Shared component library)
```

## 2. Frontend Directory Strict Schema
_Based on Feature Sliced Design (FSD)_
```text
apps/web/src/
 ├── app/       # Routing, Global Providers
 ├── processes/ # Complex inter-feature workflows
 ├── pages/     # Page compositions
 ├── widgets/   # Cross-domain standalone UI components
 ├── features/  # Business value operations
 ├── entities/  # Business data models & UI representations
 └── shared/    # Generic UIKit, helpers, utils
```

## 3. Backend Directory Strict Schema
_Based on Clean Architecture_
```text
apps/api/src/modules/[bounded-context]/
 ├── domain/          # Entities, Value Objects, Domain Events
 ├── application/     # Use Cases (Commands/Queries), DTOs, Port Interfaces
 ├── infrastructure/  # Repositories, External Service Adapters
 └── presentation/    # HTTP Controllers, GraphQL Resolvers
```

## 4. Naming Conventions Lock
| Target | Casing Rule | Suffix Rule | Example |
|--------|-------------|-------------|---------|
| **Folders** | `kebab-case` | None | `user-profile/` |
| **UI Components** | `PascalCase` | `.tsx` | `UserProfile.tsx` |
| **Backend Classes** | `PascalCase` | Layer specific | `UserService.ts` -> `User.service.ts` |
| **Interfaces** | `PascalCase` | Prefix `I` (Optional) | `IUserRepository` |
