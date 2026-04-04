# Foundation 09: Observability & Monitoring

> **SA Instructions:** Systematize how to detect failures.

## 1. Log Formatting Standard
- **Format:** [e.g., JSON MUST be used for all production logs]
- **Required Metadata Injection:**
  - `traceId`: Link all microservice spans to 1 request.
  - `userId`: If authorized, tie log to user execution.
  - `context`: [Controller Name / Service Name]

## 2. Telemetry & Metrics (APM)
- **Tracing Library Tooling:** [e.g., OpenTelemetry integrated at Application layer]
- **Aggregation Target:** [e.g., Datadog / ELK Stack / Grafana Loki]
- **Endpoints to Monitor:** [e.g., Prometheus scraping via `/metrics` endpoint]

## 3. Strict Rules for Data Sanitization (Masking)
- **PII Scrubbing in Logs:** [e.g., NEVER log payload containing `password`, `ssn`, `credit_card`, `token`]
- **URL Sanatization:** [e.g., Strip JWT tokens out of URI query paths before persisting server logs]

## 4. Alert Routing Matrix
| Severity | Trigger Condition | Notification Channel | Auto-Call? |
|----------|-------------------|----------------------|------------|
| **P1 (Fatal)** | API 5xx rate > 5% | `#alerts-critical`, PagerDuty | YES |
| **P2 (Error)** | Database CPU > 90% | `#alerts-infra` | NO |
| **P3 (Warn)** | 4xx rate spike | `#alerts-warnings` | NO |
