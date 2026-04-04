# Foundation 07: Cost Management & Resource Ceilings

> **SA Instructions:** Often forgotten by juniors, explicit limits prevent infinite-scaling loops and unexpected cloud bills.

## 1. Financial Guardrails
- **Max Monthly Budget (Warning Level):** 
- **Max Monthly Budget (Hard Cutoff Level):** 
- **Environment Disablement Rules:** [e.g., Dev and Staging nodes auto-spin-down at 7 PM Friday]

## 2. Scalability Limits (Do NOT scale infinitely)
| Resource | Minimum | Maximum Cap | Scale Up Trigger |
|----------|---------|-------------|------------------|
| **Frontend PODs** | 2 | 10 | CPU > 70% |
| **Backend API PODs** | 2 | 20 | CPU > 70% |
| **DB Connections** | 10 | 500 (Max pool) | N/A |
| **3rd Party API** | N/A | 10,000 req/day | OpenAI Limit |

## 3. Lifecycle Policies
- **Log Retention:** [e.g., CloudWatch logs expire after 30 days to save S3 costs]
- **Archive Strategy:** [e.g., Move to S3 Glacier after 90 days]
