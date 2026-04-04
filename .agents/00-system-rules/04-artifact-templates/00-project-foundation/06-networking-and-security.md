# Foundation 06: Networking & Security

> **SA Instructions:** Security is non-negotiable. Define cryptographic standards and network isolation perimeters.

## 1. Network Topology
- **VPC Subnets:** 
  - Public Subnets: [e.g., Only Load Balancers (ALB) and NAT Gateways]
  - Private Subnets: [e.g., EKS Worker Nodes, ECS Tasks]
  - Isolated Subnets: [e.g., RDS Databases, ElastiCache (No NAT access)]
- **Outer Perimeter:** [e.g., Cloudflare WAF, AWS Shield]

## 2. Authentication & JWT Strategy
- **Identity Provider (IdP):** [e.g., Auth0, Keycloak, Custom]
- **Protocol:** [e.g., OAuth 2.0 Authorization Code Flow with PKCE]
- **Token Security:**
  - Access Token: [e.g., Short-lived (15m), stored in memory]
  - Refresh Token: [e.g., Long-lived (7d), HttpOnly, Secure, SameSite=Strict cookie]

## 3. Data Protection (Cryptography)
- **Encryption At-Rest:** [e.g., AWS KMS with AES-256 for all EBS and RDS volumes]
- **Encryption In-Transit:** [e.g., TLS 1.2 minimum, TLS 1.3 preferred. HSTS enforced]
- **Secret Management:** [e.g., AWS Secrets Manager injected at runtime. `dotenv` only for local dev]

## 4. Request Throttling & CORS
- **Rate Limit Policy:** [e.g., 100 requests / IP / minute via Redis rate limiter]
- **CORS Allowed Origins:** [e.g., `https://app.production.com` strictly]
