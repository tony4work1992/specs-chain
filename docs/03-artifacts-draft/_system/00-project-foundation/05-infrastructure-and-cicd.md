---
document_type: project-foundation
foundation_id: "05"
title: Infrastructure & CI/CD Pipeline
version: "1.0.0"
status: draft
---

# Foundation 05: Infrastructure & CI/CD Pipeline

## 1. Hosting Target & Compute
- **Cloud Provider:** AWS
- **Compute Strategy:**
  - Frontend: Vercel (Next.js native — zero-config CDN + Edge functions)
  - Backend API: AWS ECS Fargate (containerized, serverless compute — no EC2 management)
  - Database: AWS RDS PostgreSQL 16 (Multi-AZ for production, Single-AZ for staging)
  - Cache: AWS ElastiCache Redis 7 (cluster mode disabled for MVP)
  - File Storage: AWS S3 (private bucket, pre-signed URLs for access)

## 2. Containerization Standards
| Scope | Rule | Example |
|-------|------|---------|
| **Base Image** | Lightweight Alpine-based | `node:20-alpine` |
| **Build Strategy** | Multi-stage mandatory | Stage 1: `builder` (install + compile) → Stage 2: `runner` (prod-only artifacts, no devDeps) |
| **Image Registry** | AWS ECR (private) | `{account}.dkr.ecr.ap-southeast-1.amazonaws.com/sales-api` |
| **Local Dev** | Docker Compose | `docker-compose.yml` with hot reload via `ts-node-dev`; seeded test DB |
| **Env Injection** | Runtime only | NO secrets baked into image. All secrets injected via AWS Secrets Manager at ECS task start |

## 3. Local Development Setup
```bash
# Start all backing services locally
docker compose up -d postgres redis minio

# Run API in watch mode
pnpm --filter api dev

# Run Web in dev mode
pnpm --filter web dev
```

## 4. Automation (CI/CD) Stages
_GitHub Actions pipelines. All stages must pass before merge to `main`._

**Pre-commit (local — Husky + lint-staged):**
- ESLint auto-fix
- Prettier format check
- TypeScript incremental type-check on changed files only

**Continuous Integration (CI) — on Pull Request:**
1. `pnpm install --frozen-lockfile`
2. `turbo lint` — ESLint across all packages
3. `turbo typecheck` — `tsc --noEmit` across all packages
4. `turbo test` — Vitest unit + integration (coverage threshold: 80% lines)
5. `trivy image scan` — Security scan on built Docker image
6. `npm audit --audit-level=high` — Dependency vulnerability check

**Continuous Deployment (CD) — on merge to `main`:**
1. Build Docker image → push to AWS ECR
2. Run TypeORM migrations: `typeorm migration:run` against staging DB
3. Deploy to ECS Fargate (staging) — smoke test via health check endpoint
4. Manual approval gate (Sales Manager sign-off for production)
5. Blue/Green deployment to ECS Fargate (production) — zero downtime
6. Rollback trigger: automatic if health check fails within 5 minutes post-deploy

## 5. Environment Strategy
| Environment | Purpose | Auto-deploy | DB |
|-------------|---------|-------------|-----|
| `local` | Developer machine | N/A | Docker Compose Postgres |
| `staging` | QA & UAT | Yes (on merge to `main`) | RDS Single-AZ (seeded) |
| `production` | Live users | Manual approval gate | RDS Multi-AZ |
