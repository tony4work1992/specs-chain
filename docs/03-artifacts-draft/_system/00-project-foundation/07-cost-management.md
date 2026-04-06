---
document_type: project-foundation
foundation_id: "07"
title: Cost Management & Resource Ceilings
version: "1.0.0"
status: draft
---

# Foundation 07: Cost Management & Resource Ceilings

## 1. Financial Guardrails
- **Max Monthly Budget (Warning Level):** $800/month — triggers Slack alert to Engineering Lead
- **Max Monthly Budget (Hard Cutoff Level):** $1,200/month — triggers AWS Budget action to throttle non-critical services
- **Environment Disablement Rules:**
  - Staging ECS tasks auto-scale to 0 at 8 PM weekdays and all day weekends (EventBridge Scheduler)
  - RDS staging instance pauses after 30 minutes of inactivity (RDS auto-pause enabled)
  - ElastiCache staging node stops on weekends via scheduled Lambda

## 2. Scalability Limits (Do NOT scale infinitely)
| Resource | Minimum | Maximum Cap | Scale Up Trigger |
|----------|---------|-------------|------------------|
| **Frontend (Vercel)** | Serverless | Vercel team plan limit | Automatic (managed) |
| **Backend API Tasks (ECS)** | 1 task | 10 tasks | CPU > 65% for 3 consecutive minutes |
| **DB Connections (RDS)** | 10 | 200 (max_connections) | N/A — use PgBouncer if exceeded |
| **Redis Memory** | 512 MB | 2 GB | Memory > 75% triggers LRU eviction |
| **S3 Storage** | N/A | 50 GB (soft warning) | Alert at 80% of quota |
| **ECS Task vCPU** | 0.25 vCPU | 2 vCPU per task | N/A (fixed task definition) |
| **ECS Task Memory** | 512 MB | 2048 MB per task | N/A (fixed task definition) |

## 3. Cost Allocation Tagging Strategy
All AWS resources MUST be tagged:
```
Project: sales-management
Environment: production | staging | local
Team: engineering
CostCenter: internal-tools
```
Untagged resources will trigger a weekly AWS Config compliance alert.

## 4. Lifecycle Policies
- **CloudWatch Log Retention:** 30 days for all application logs; 90 days for security/audit logs
- **S3 Archive Strategy:** Deal attachments older than 1 year → transition to S3 Glacier Instant Retrieval (70% cost reduction)
- **RDS Backups:** Automated daily snapshots retained for 7 days (production); 3 days (staging). Manual snapshot before each production deployment.
- **ECR Image Cleanup:** Keep only the 10 most recent images per repository. Untagged images deleted after 1 day via ECR Lifecycle Policy.
