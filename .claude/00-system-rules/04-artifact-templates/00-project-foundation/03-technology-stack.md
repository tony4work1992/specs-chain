# Foundation 03: Technology Stack

> **SA Instructions:** Lock exact versions. Failing to specify a version will cause AI agents to hallucinate legacy syntax or incompatible libraries.

## 1. Core Languages
| Tier | Language/Runtime | Exact Version | Justification |
|------|------------------|---------------|---------------|
| **Frontend** | [e.g., TypeScript] | [e.g., v5.4.x] | Strict typing |
| **Backend** | [e.g., Go / Node] | [e.g., 1.22 / 20.x] | Concurrency |

## 2. Frontend Ecosystem
| Category | Technology & Version | Do NOT Use |
|----------|----------------------|------------|
| **Framework** | [e.g., Next.js 14 App Router] | [Pages Router] |
| **State Mgt** | [e.g., Zustand v4] | [Redux] |
| **Data Fetch** | [e.g., TanStack Query v5] | [SWR / raw fetch] |
| **Styling** | [e.g., TailwindCSS v3] | [CSS Modules] |

## 3. Backend Ecosystem
| Category | Technology & Version | Do NOT Use |
|----------|----------------------|------------|
| **Framework** | [e.g., NestJS v10] | [Express raw] |
| **ORM/Query** | [e.g., Prisma v5] | [TypeORM] |
| **Validation** | [e.g., Zod v3] | [class-validator] |

## 4. Backing Services
| Category | Technology & Version | Purpose |
|----------|----------------------|---------|
| **Relational DB** | [e.g., PostgreSQL 16] | Primary ACID persistence |
| **NoSQL DB** | [e.g., MongoDB 7] | High-volume read storage |
| **Caching** | [e.g., Redis 7] | Session / Query caching |
| **Message Broker** | [e.g., RabbitMQ 3.x] | Async event distribution |
