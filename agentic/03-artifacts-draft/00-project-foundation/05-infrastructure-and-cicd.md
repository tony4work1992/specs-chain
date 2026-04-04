# Foundation 05: Infrastructure & CI/CD Pipeline

> **SA Instructions:** Define the execution environment. This stops AI from confusing ECS deployments with Kubernetes YAMLs.

## 1. Hosting Target & Compute
- **Cloud Provider:** On-Premise (Bare-metal server)
- **Compute Strategy:** Do yêu cầu bảo mật thông tin nội bộ và thiết lập riêng tư, hệ thống không đẩy lên Cloud.
  - Vận hành các services (Frontend, API, Postgres, Redis, RabbitMQ) bằng **Docker Compose** trên Virtual Machine / Physical Server.

## 2. Containerization Standards
| Scope | Rule | Example |
|-------|------|---------|
| **Base Image** | Ưu tiên Alpine cực kỳ tinh gọn và bảo mật | `node:20-alpine`, `postgres:16-alpine` |
| **Build Stages** | Bắt buộc chia 2 phase | Stage 1: Build TS sang JS -> Stage 2: Copy JS chạy Prod Runtime (Không mang devDependencies vào Prod) |
| **Local Dev** | Orchestrator | `docker-compose.yml` có Volume binding để code Live Reload |

## 3. Automation (CI/CD) Stages
_Specify the exact sequence of verification before code reaches production._
1. **Pre-commit:** Git Hook (Husky + lint-staged) chạy eslint và prettier.
2. **Continuous Integration (CI):** (Chạy trên On-Prem Jenkins / GitLab CI)
   - Linter (`eslint`, `prettier`)
   - Type Checking (`tsc --noEmit`)
   - Unit Tests (`vitest run --coverage > 80%`)
   - Security Scan Quét vỏ Image docker trước khi push vào Registry cục bộ.
3. **Continuous Deployment (CD):**
   - Kéo ảnh từ Local Registry về máy chủ Prod.
   - Run Migration (`npx prisma deploy`).
   - Khởi động service qua lệnh `docker compose up -d --build`.
