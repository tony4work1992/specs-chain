---
document_type: project-foundation
foundation_id: "03"
title: Technology Stack
version: "1.0.0"
status: draft
---

# Foundation 03: Technology Stack

## 1. Core Languages
| Tier | Language/Runtime | Exact Version | Justification |
|------|------------------|---------------|---------------|
| **Frontend** | TypeScript | v5.4.x | Strict typing reduces runtime errors in complex form-heavy UI |
| **Backend** | Node.js | v20.x LTS | Team familiarity; shares TypeScript across stack; strong NestJS ecosystem |

## 2. Frontend Ecosystem
| Category | Technology & Version | Do NOT Use |
|----------|----------------------|------------|
| **Framework** | Next.js 14 (App Router) | Pages Router |
| **State Management** | Zustand v4 | Redux, MobX |
| **Server State / Data Fetching** | TanStack Query v5 | SWR, raw fetch, Axios without query layer |
| **Styling** | TailwindCSS v3 | CSS Modules, Styled Components, Emotion |
| **Component Library** | Shadcn/ui (Radix Primitives) | Ant Design, MUI |
| **Form Handling** | React Hook Form v7 + Zod v3 | Formik, uncontrolled forms |
| **Table / Data Grid** | TanStack Table v8 | AG Grid (licensing), react-table v6 |
| **Charts / Visualization** | Recharts v2 | Chart.js, D3 (too low-level) |

## 3. Backend Ecosystem
| Category | Technology & Version | Do NOT Use |
|----------|----------------------|------------|
| **Framework** | NestJS v10 | Express raw, Fastify raw |
| **ORM** | TypeORM v0.3.x | Prisma (migration control issues), Sequelize |
| **Validation** | class-validator v0.14 + class-transformer v0.5 | Zod on backend, joi |
| **API Documentation** | @nestjs/swagger v7 (OpenAPI 3.0) | Manual Postman collections |
| **Authentication** | @nestjs/jwt + Passport.js (passport-jwt) | Session-based auth, firebase-admin |
| **WebSocket** | @nestjs/websockets (Socket.IO adapter) | ws raw |

## 4. Backing Services
| Category | Technology & Version | Purpose |
|----------|----------------------|---------|
| **Relational DB** | PostgreSQL 16 | Primary ACID persistence for all domain entities |
| **Caching** | Redis 7 (ioredis v5) | Session tokens, rate limiting, dashboard KPI cache |
| **Search** | PostgreSQL Full-Text Search (pg_trgm) | MVP-level contact/deal search; Elasticsearch deferred to post-MVP |
| **File Storage** | AWS S3 (or MinIO for local dev) | Deal attachments, exported reports |
| **Email (Future)** | N/A (post-MVP) | Deferred — no email sending in MVP |

## 5. Developer Tooling
| Category | Tool & Version |
|----------|----------------|
| **Package Manager** | pnpm v9 |
| **Monorepo** | Turborepo v2 |
| **Linter** | ESLint v9 (flat config) + @typescript-eslint |
| **Formatter** | Prettier v3 |
| **Git Hooks** | Husky v9 + lint-staged v15 |
| **Testing** | Vitest v1 (unit/integration) + Playwright v1.44 (E2E) |
| **API Client (Dev)** | Bruno (open source Postman alternative) |
