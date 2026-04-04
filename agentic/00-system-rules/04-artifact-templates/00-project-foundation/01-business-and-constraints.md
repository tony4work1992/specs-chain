# Foundation 01: Business & Constraints

> **SA Instructions:** Define measurable business boundaries. AI agents will use these constraints to make tradeoff decisions (e.g., favoring performance over feature richness if latency is prioritized).

## 1. Product Vision & Target Audience
| Attribute | Definition |
|-----------|------------|
| **Product Name** | [Name] |
| **Primary Goal** | [What is the #1 problem this solves?] |
| **Target Audience** | [B2B / B2C / Internal] |
| **Scale Expectation** | [e.g., Target 1M users in Year 1] |

## 2. Hard Non-Functional Requirements (SLAs)
_Provide exact numbers. Do not use "fast" or "secure"._
- **Uptime / Availability:** [e.g., 99.99% (52.6 min downtime/year)]
- **Latency (P99):** [e.g., <200ms for read APIs, <500ms for write APIs]
- **Throughput:** [e.g., 5,000 Requests Per Second (RPS) at peak]
- **Data Freshness:** [e.g., Real-time vs eventual consistency tolerance (< 5s)]

## 3. Compliance & Legal Framework
_Check all that apply and define the strict enforcement mechanism._
- [ ] **GDPR / CCPA:** [e.g., Requires 'Right to be Forgotten' hard deletes]
- [ ] **PCI-DSS:** [e.g., System must NEVER touch credit card PANs]
- [ ] **HIPAA:** [e.g., Medical records must be encrypted at-rest and in-transit]
- **Data Residency:** [e.g., PII data must physically reside in EU regions]

## 4. Rollout Strategy
- **Day 1 (MVP) Scope:** [Strictly define what is IN scope]
- **Day 100 (Post-MVP) Scope:** [Strictly define what is OUT of scope for now]
