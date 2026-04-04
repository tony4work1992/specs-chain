# Foundation 05: Infrastructure & CI/CD Pipeline

> **SA Instructions:** Define the execution environment. This stops AI from confusing ECS deployments with Kubernetes YAMLs.

## 1. Hosting Target & Compute
- **Cloud Provider:** [e.g., AWS, GCP, Azure, Bare-metal]
- **Compute Strategy:**
  - Frontend: [e.g., Vercel, AWS Amplify, CloudFront + S3]
  - Backend API: [e.g., EKS (Kubernetes), ECS Fargate, Serverless Lambda]
  - Database: [e.g., AWS RDS Multi-AZ, DynamoDB]

## 2. Containerization Standards
| Scope | Rule | Example |
|-------|------|---------|
| **Base Image** | [Exact lightweight image] | `node:20-alpine`, `gcr.io/distroless` |
| **Build Stages** | [Multi-stage mandate] | Stage 1: Build -> Stage 2: Prod Runtime |
| **Local Dev** | [Orchestrator] | `docker-compose.yml` with hot reload |

## 3. Automation (CI/CD) Stages
_Specify the exact sequence of verification before code reaches production._
1. **Pre-commit:** [e.g., Husky + lint-staged]
2. **Continuous Integration (CI):**
   - Linter (`eslint`, `prettier`)
   - Type Checking (`tsc --noEmit`)
   - Unit Tests (`vitest run --coverage > 80%`)
   - Security Scan (`npm audit`, `trivy`)
3. **Continuous Deployment (CD):**
   - Database Migration Stage ([e.g., Prisma Deploy])
   - Blue/Green Deployment strategy (Zero downtime).
