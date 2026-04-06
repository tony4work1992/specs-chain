---
document_type: project-foundation
foundation_id: "06"
title: Networking & Security
version: "1.0.0"
status: draft
---

# Foundation 06: Networking & Security

## 1. Network Topology (AWS VPC)
- **VPC CIDR:** `10.0.0.0/16`
- **Public Subnets** (`10.0.1.0/24`, `10.0.2.0/24`):
  - AWS Application Load Balancer (ALB) only
  - NAT Gateway (for private subnet egress)
  - No ECS tasks or databases allowed here
- **Private Subnets** (`10.0.10.0/24`, `10.0.11.0/24`):
  - ECS Fargate tasks (NestJS API)
  - All inbound traffic exclusively from ALB via Security Group rule
- **Isolated Subnets** (`10.0.20.0/24`, `10.0.21.0/24`):
  - RDS PostgreSQL — no internet access, no NAT
  - ElastiCache Redis — accessible only from ECS Security Group
- **Outer Perimeter:**
  - Cloudflare WAF (DNS proxied) — DDoS mitigation, bot protection, OWASP ruleset enabled
  - AWS Shield Standard (included with ALB)

## 2. Authentication & JWT Strategy
- **Identity Provider (IdP):** Custom (NestJS + Passport.js) — no third-party IdP dependency for MVP
- **Protocol:** Username/password login with JWT. OAuth2 SSO (Google Workspace) deferred to post-MVP.
- **Token Security:**
  - Access Token: Short-lived (15 minutes), signed RS256, stored in memory (JavaScript variable — NOT localStorage)
  - Refresh Token: Long-lived (7 days), signed RS256, stored in HttpOnly + Secure + SameSite=Strict cookie
  - Token Rotation: Refresh token is rotated on every use (single-use refresh tokens)
  - Token Revocation: Redis allowlist for active refresh tokens — revoke on logout or password change

## 3. Authorization (RBAC)
| Role | Permissions |
|------|-------------|
| **Sales Rep** | CRUD own leads/deals/activities. Read-only contacts not owned. No access to reports. |
| **Sales Manager** | Full CRUD all leads/deals/activities. View all reports. Manage user assignments. |
| **Admin** | Full system access including user management, role assignment, system settings. |

## 4. Data Protection (Cryptography)
- **Encryption At-Rest:** AWS KMS (AES-256) for all RDS volumes and S3 buckets. ECS ephemeral storage unencrypted (no PII written to disk).
- **Encryption In-Transit:** TLS 1.2 minimum, TLS 1.3 preferred. HSTS enforced (`max-age=31536000; includeSubDomains`). All internal VPC traffic also encrypted via TLS.
- **Secret Management:** AWS Secrets Manager for all credentials (DB passwords, JWT private keys, S3 keys). Injected as environment variables at ECS task start. `dotenv` only for local dev (`.env.local`, gitignored).
- **Password Hashing:** bcrypt with cost factor 12. Never store plaintext passwords. Never log passwords.

## 5. Request Throttling & CORS
- **Rate Limit Policy:**
  - Global: 200 requests / IP / minute (Redis-backed via `nestjs-throttler`)
  - Auth endpoints (`/auth/login`, `/auth/refresh`): 10 requests / IP / minute (strict brute-force protection)
- **CORS Allowed Origins:**
  - Production: `https://sales.company.com` strictly
  - Staging: `https://sales-staging.company.com`
  - Local: `http://localhost:3000`
  - Wildcard (`*`) is STRICTLY FORBIDDEN in any environment

## 6. Audit & Security Logging
- All authentication events (login, logout, failed attempts, token refresh) logged with `userId`, `ip`, `userAgent`, `timestamp`
- All admin actions (role changes, user deletions) logged to immutable audit trail table
- Logs MUST NOT contain passwords, tokens, or PII beyond `userId`
