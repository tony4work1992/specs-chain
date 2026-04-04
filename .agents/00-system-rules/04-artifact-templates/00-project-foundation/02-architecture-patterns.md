# Foundation 02: Architecture Patterns

> **SA Instructions:** Lock the macro and micro architecture boundaries. This prevents AI from generating spaghetti inter-module dependencies.

## 1. Macro-Architecture (System Layout)
| System Type | Chosen Strategy | Justification |
|-------------|-----------------|---------------|
| **Deployment** | [Monolith / Microservices] | [Why this over the alternatives?] |
| **Communication** | [REST / gRPC / Events] | [Sync vs Async requirements] |

## 2. Bounded Contexts (DDD)
_List the core domains of the system._
1. **[Context A - e.g., Identity]:** Handles Auth, Users, Roles.
2. **[Context B - e.g., Billing]:** Handles Invoices, Subscriptions, Payments.
3. **[Context C - e.g., Inventory]:** Handles Stock, Warehouses.

## 3. Micro-Architecture (Internal Pattern)
_Define the internal layout of a single microservice or monolith module._
- **Chosen Pattern:** [e.g., Clean Architecture, Hexagonal, CQRS]
- **Layering Stricture:** 
  - `Domain`: Enterprise business rules (No external dependencies).
  - `Application`: Use cases, interfaces.
  - `Infrastructure`: Databases, external APIs.
  - `Presentation`: Controllers, Resolvers.

## 4. Hard Anti-Patterns (Enforced by default)
> [!WARNING]
> The following actions are STRICTLY forbidden in this codebase:
- **Dependency Rule Violation:** Inner layers (Domain) importing Outer layers (Infrastructure).
- **Leaking Domain Models:** Exposing database entities directly to API responses (Must use DTOs/Mappers).
- **Cross-Domain Database Access:** Bounded Context A executing SQL on Bounded Context B's tables.
