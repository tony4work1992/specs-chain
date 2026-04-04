# Module Boundaries

| Module | Owns | Out of Scope | Published Contracts | Must Not Expose |
| --- | --- | --- | --- | --- |
| `order` | Orders, order items, payment state | User identity master, project master data | `OrderFacade`, `OrderReaderPort`, `OrderQueryService` | Repository implementation, TypeORM repository |
| `workflow` | Workflow templates and steps | Project master data, user identity master | `WorkflowFacade`, `WorkflowReaderPort`, `WorkflowQueryService` | Internal persistence model |
| `user` | Users and role assignments | Project membership, order data | `UserReaderPort`, `UserPermissionFacade` | Raw user repository |
| `project` | Project master data and membership | User identity master beyond referenced ids | `ProjectReaderPort`, `ProjectMembershipQueryService` | Project persistence entities |

## Ownership Rule

Each module owns:

- its domain model
- its application use cases
- its repository contracts
- its repository implementation
- its outward-facing facade, ports, or query services

## Boundary Rules

- Do not move entity ownership across modules without an ADR.
- Do not store another module's aggregate inside the current module.
- Do not depend on another module's repository implementation or ORM model.
- Keep published contracts smaller than the internal aggregate whenever possible.
- Prefer business-capability contracts such as `checkPermission`, `getOrderSummary`, or `reserveForOrder` over raw CRUD-style exposure.
