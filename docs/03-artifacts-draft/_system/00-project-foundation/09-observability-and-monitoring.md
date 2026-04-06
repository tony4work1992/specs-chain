---
document_type: project-foundation
foundation_id: "09"
title: Observability & Monitoring
version: "1.0.0"
status: draft
---

# Foundation 09: Observability & Monitoring

## 1. Log Formatting Standard
- **Format:** JSON MUST be used for all production logs. Human-readable `pino-pretty` format allowed in local dev only.
- **Logging Library:** `pino` v8 (NestJS transport) — high-performance, low-overhead
- **Required Metadata Injection (every log line MUST include):**
  - `traceId`: UUID linking all log lines within one HTTP request lifecycle (injected via `AsyncLocalStorage`)
  - `userId`: Authenticated user ID (if request is authorized; omit for anonymous)
  - `context`: NestJS class name (e.g., `DealController`, `CreateDealUseCase`)
  - `timestamp`: ISO 8601 UTC
  - `level`: `trace` | `debug` | `info` | `warn` | `error` | `fatal`
  - `requestId`: ALB request ID (from `X-Amzn-Trace-Id` header)

## 2. Telemetry & Metrics (APM)
- **Tracing Library:** OpenTelemetry SDK v1.x — auto-instrumented for NestJS HTTP, TypeORM queries, Redis calls
- **Aggregation Target:** AWS CloudWatch (primary for MVP) — `aws-distro-opentelemetry` sidecar container
- **APM Dashboard:** AWS CloudWatch Container Insights (ECS metrics: CPU, memory, request count)
- **Metrics Endpoint:** Prometheus-compatible `/metrics` endpoint exposed on internal port 9090 (NOT public-facing)
- **Custom Business Metrics to Track:**
  - `deals_created_total` (counter)
  - `deals_stage_transition_total` (counter, labelled by `from_stage`, `to_stage`)
  - `pipeline_value_total` (gauge, labelled by `stage`)
  - `api_request_duration_ms` (histogram, P50/P95/P99)

## 3. Strict Rules for Data Sanitization (Masking)
- **PII Scrubbing in Logs:** NEVER log values for fields: `password`, `token`, `refreshToken`, `authorization`, `ssn`, `creditCard`, `secret`. Use `[REDACTED]` placeholder if field presence must be logged.
- **URL Sanitization:** Strip JWT tokens and API keys from URI query strings before persisting to access logs (`?token=xxx` → `?token=[REDACTED]`)
- **Request Body Logging:** Log request body ONLY at `debug` level in non-production environments. Production: log only method + path + status code + duration.
- **PII in Error Messages:** Stack traces MUST NOT propagate customer data to API error responses. Use generic error codes + internal error logging only.

## 4. Health Checks
- **Liveness Probe:** `GET /health/live` — returns `200 OK` if process is running. ECS restarts task if this fails.
- **Readiness Probe:** `GET /health/ready` — checks DB connection + Redis ping. ALB removes task from target group if this fails.
- **Health Check Library:** `@nestjs/terminus` v10

## 5. Alert Routing Matrix
| Severity | Trigger Condition | Notification Channel | Auto-Recover? |
|----------|-------------------|----------------------|---------------|
| **P1 (Fatal)** | API 5xx error rate > 5% over 5 min | `#alerts-critical` (Slack) + PagerDuty on-call | ECS auto-restart task |
| **P1 (Fatal)** | ECS task count drops to 0 | `#alerts-critical` + PagerDuty | ECS service auto-recovery |
| **P2 (Error)** | RDS CPU > 85% sustained 10 min | `#alerts-infra` (Slack) | Manual review required |
| **P2 (Error)** | Redis memory > 80% | `#alerts-infra` | Manual eviction policy review |
| **P3 (Warn)** | API 4xx rate spike > 20% over 10 min | `#alerts-warnings` (Slack) | No |
| **P3 (Warn)** | Monthly AWS cost > $800 | `#alerts-cost` (Slack) | No |
| **P4 (Info)** | Deployment succeeded/failed | `#deployments` (Slack) | N/A |

## 6. Distributed Tracing (Request Lifecycle)
```
Browser → Cloudflare WAF → ALB → ECS Task (NestJS)
                                      ↓
                              [traceId injected]
                                      ↓
                            TypeORM → PostgreSQL
                            ioredis  → Redis
                                      ↓
                              CloudWatch Traces
```
Every cross-service call propagates `X-Trace-Id` header for end-to-end trace reconstruction.
