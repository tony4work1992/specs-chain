---
document_type: project-foundation
foundation_id: "01"
title: Business & Constraints
version: "1.0.0"
status: draft
---

# Foundation 01: Business & Constraints

## 1. Product Vision & Target Audience
| Attribute | Definition |
|-----------|------------|
| **Product Name** | Sales Management System |
| **Primary Goal** | Centralize and automate the full B2B sales lifecycle — from lead capture to deal closure — eliminating manual tracking via spreadsheets and fragmented tools |
| **Target Audience** | B2B Internal (Sales teams, Sales Managers, C-level executives of a mid-size company) |
| **Scale Expectation** | 500 internal users at launch; target 2,000 users within 12 months across multiple branches |

## 2. Hard Non-Functional Requirements (SLAs)
- **Uptime / Availability:** 99.9% (8.7 hours downtime/year) — acceptable for internal tooling
- **Latency (P99):** <300ms for read APIs (pipeline views, contact lists); <800ms for write APIs (create deal, log activity)
- **Throughput:** 500 concurrent users; peak 1,000 RPS during end-of-quarter reporting surges
- **Data Freshness:** Near real-time — dashboard KPIs refresh within 10 seconds; eventual consistency tolerance < 10s for reporting aggregates

## 3. Compliance & Legal Framework
- [x] **GDPR / CCPA:** Customer PII (name, email, phone) must support Right to Erasure. Hard deletes on request. Consent logs retained.
- [ ] **PCI-DSS:** System does NOT process payments directly. Payment data must never be stored.
- [ ] **HIPAA:** Not applicable.
- **Data Residency:** All PII data must reside within the organization's designated cloud region (e.g., ap-southeast-1). No cross-region PII replication without explicit DPA.

## 4. Rollout Strategy
- **Day 1 (MVP) Scope:**
  - Lead & Contact Management (CRUD)
  - Deal Pipeline (Kanban board with stage transitions)
  - Activity Logging (calls, emails, meetings)
  - Basic Dashboard (deal count, win rate, revenue pipeline by stage)
  - Role-based access: Sales Rep, Sales Manager, Admin
- **Day 100 (Post-MVP) Scope — OUT of scope for now:**
  - Email integration (Gmail / Outlook sync)
  - AI-powered lead scoring
  - Forecasting & advanced analytics
  - Mobile native app
  - Third-party CRM migration tools
