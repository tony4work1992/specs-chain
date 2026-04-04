# Foundation 03: Technology Stack

> **SA Instructions:** Lock exact versions. Failing to specify a version will cause AI agents to hallucinate legacy syntax or incompatible libraries.

## 1. Core Languages
| Tier | Language/Runtime | Exact Version | Justification |
|------|------------------|---------------|---------------|
| **Frontend** | TypeScript | v5.4.x | Cú pháp tĩnh (Strict typing) giảm lỗi frontend |
| **Backend** | Node.js | v20.x LTS | Hệ sinh thái Non-blocking IO mạnh, phù hợp xử lý hàng ngàn request chấm công đồng thời |

## 2. Frontend Ecosystem
| Category | Technology & Version | Do NOT Use |
|----------|----------------------|------------|
| **Framework** | Next.js 14 App Router | Pages Router, Create React App |
| **State Mgt** | Zustand v4 | Redux, Context API (for global volatile state) |
| **Data Fetch** | TanStack Query v5 | SWR, raw fetch/axios in components |
| **Styling** | TailwindCSS v3 | CSS Modules, SASS |

## 3. Backend Ecosystem
| Category | Technology & Version | Do NOT Use |
|----------|----------------------|------------|
| **Framework** | NestJS v10 | Express raw, Fastify raw |
| **ORM/Query** | Prisma v5 | TypeORM, Sequelize |
| **Validation** | Zod v3 | class-validator, Joi |

## 4. Backing Services
| Category | Technology & Version | Purpose |
|----------|----------------------|---------|
| **Relational DB** | PostgreSQL 16 | Lưu trữ gốc, bảo toàn tính ACID cho dữ liệu công. Mạng lưới CSDL chia theo Microservice |
| **NoSQL DB** | N/A | (Chưa áp dụng ở scope này) |
| **Caching** | Redis 7 | Lưu Rate-limiting, cấu hình công ty, User Session |
| **Message Broker** | RabbitMQ 3.12 | Phân tán sự kiện Check-in bất đồng bộ xuống Reporting Service để giảm tải cho DB. |
