<!-- Knowledge Metadata
Feature-Code: AIPD-000002
Feature-Name: Sales Dashboard
Source-File: 002.Technical Requirement Workflow/Function Specifications.md
Source-Version: 2026.04.03 13.56.27
-->

# Function Specifications (AIPD-000002)
*Request Version: 2026.04.03 13.56.27*

This document translates the purely deterministic `Function Specifications.json` into human-readable tables mapping the entire software architecture explicitly across APIs, Databases, UI States, EventBuses, and Background Jobs.

## 1. Environment Variables & Configurations
| ID | Key Name | Data Type | Required | Component Reference |
|---|---|---|---|---|
| `ENV_01` | `CRM_WEBHOOK_SECRET` | string | true | Component 7: External CRM Integration |
| `ENV_02` | `PUPPETEER_MAX_TIMEOUT_MS` | number | true | Component 8: Puppeteer PDF Worker |

## 2. React Context States & Stores
| ID | State Name | Data Type | Default Value | Component Reference |
|---|---|---|---|---|
| `UI_STATE_01` | `temporalMode` | string (WEEKLY \| MONTHLY \| QUARTERLY \| ANNUALLY) | `WEEKLY` | Component 1: React Client |
| `UI_STATE_02` | `isExportingPdf` | boolean | `false` | Component 1: React Client |

## 3. UI-to-API Action Mappings
| ID | DOM Trigger | State Mutation | API Reference | Fallback Action |
|---|---|---|---|---|
| `UIMAP_01` | onClick 'Export PDF' Button | `set_isExportingPdf(true)` | `API_01` | AbortController(15000ms) -> throw Error Toast |
| `UIMAP_02` | onChange 'Temporal Select' | `set_temporalMode(value)` | `API_03` | XHR background refresh |

## 4. Backend API Endpoints
| ID | Component Reference | URI | Method | Middleware Reference |
|---|---|---|---|---|
| `API_01` | Component 2: NestJS Gateway | `/api/v1/export/pdf` | `POST` | `MW_01 (Throttler)`, `MW_02 (JWT)` |
| `API_02` | Component 7: CRM Integration | `https://api.crm-provider.com/v1/deals/delta` | `GET` | `MW_03 (Bearer Injector)` |
| `API_03` | Component 2: NestJS Gateway | `/api/v1/dashboard/metrics` | `GET` | `MW_01`, `MW_02` |

## 5. Payload DTO Structures
| API Reference | Payload Type | Field Name | Data Type | Required | Validator |
|---|---|---|---|---|---|
| `API_01` | request | `startDate` | string | true | `IsISO8601()` |
| `API_01` | request | `endDate` | string | true | `IsISO8601() && (val - startDate <= 365 Days)` |
| `API_01` | response | `downloadUrl` | string | true | S3 Signed URL |

## 6. Middleware & Interceptors
| ID | Component Reference | Type | Logic |
|---|---|---|---|
| `MW_01` | Component 2: NestJS Gateway | RateLimit Guard | `ttl: 60s, limit: 100 requests` |
| `MW_02` | Component 2: NestJS Gateway | JWT Decoder | Intercepts Bearer, queries `TBL_01` for role. Returns HTTP 403 if invalid. |

## 7. Background Cron Actions
| ID | Component Reference | Cron Expression | Action Pipeline | Max Retries |
|---|---|---|---|---|
| `JOB_01` | Component 3: Cron Poller | `*/5 * * * *` | Executes `API_02` -> maps Delta -> Upserts `TBL_02` -> Emits `EVT_01` | 3 (Circuit Breaker Array fallbacks) |

## 8. Message EventBus/Broker
| ID | Component Reference | Topic Name | Publisher | Consumer | Payload Schema |
|---|---|---|---|---|---|
| `EVT_01` | EventBus Matrix | `sync.completed.invalidate_cache` | `JOB_01` | Component 6: Redis Cache | `{ matched_user_ids: string[] }` |

## 9. Database Entities
| ID | Table Name | Database Type | Primary Key |
|---|---|---|---|
| `TBL_01` | `postgres.users` | Relational SQL | `id (UUID)` |
| `TBL_02` | `mongodb.sales_bookings_delta` | Document NoSQL | `_id (ObjectId)` |

## 10. Database Schema Columns
| Table Reference | Column Name | Data Type | Nullable | Index Type |
|---|---|---|---|---|
| `TBL_01` | `role` | string (Account Exec \| Manager) | `false` | B-Tree (`idx_user_roles`) |
| `TBL_02` | `amount_cents` | NumberLong | `false` | None |
| `TBL_02` | `booked_at` | ISODate | `false` | Compound `{ owner_id: 1, booked_at: -1 }` |

## 11. Application Cache Policies
| ID | Key Pattern | TTL | Eviction Trigger | Stored Type |
|---|---|---|---|---|
| `CACHE_01` | `sales:aggregate:{temporalMode}:{userId}` | `-1 (Infinite)` | `EVT_01` intercepts -> runs `SCAN 0` -> `UNLINK` batches | Stringified JSON Array |
