# System Boundaries

The documented system owns four internal business modules and may integrate with selected external services through explicit contracts.

## Context Boundaries

| Boundary | Context | Responsibility | Access Shape |
| --- | --- | --- | --- |
| Internal | `order` | Order capture, pricing, and payment state | Facade, query service, repository owned locally |
| Internal | `workflow` | Reusable workflow definitions and lifecycle | Facade, reader port, query service |
| Internal | `user` | Operational user identity, status, and permission checks | Reader port, permission facade |
| Internal | `project` | Project master data and membership | Reader port, membership query service |
| External | payment gateway | Optional verification of payment references | Command port / gateway adapter |

## Layer Boundaries

Every module follows the same high-level layering rule from A1:

```text
presentation -> application -> domain
infrastructure -> application / domain
```

The system documentation should therefore distinguish between:

- business behavior and domain rules
- application orchestration
- infrastructure details such as TypeORM and external integrations
- delivery concerns such as HTTP controllers and request/response mapping

## Boundary Rules

- External services are never modeled as internal modules unless A1 explicitly adds them.
- Internal modules own persistence for their aggregates only.
- Domain layers must not import NestJS, TypeORM, or delivery-specific concerns.
- Cross-boundary communication must happen through adapters, ports, facades, query services, or event contracts.
