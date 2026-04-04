# Document Map

This file maps each major artifact layer to its intent and the expected dependencies.

## Layer Dependency

```text
A1 + A2 -> BRD -> FRD -> A4 -> A3 -> TEST
                    \
                     -> DELIVERY -> OPERATIONS -> RECORDS
```

`A1` and `A2` are structural constraints that apply to every downstream layer. They do not replace BRD, FRD, A4, A3, or TEST, but they govern how those artifacts should be written.

## Prefix Intent

- `rules-*` folders hold stable guidance and should not expand because business scope expands.
- `spec-*` folders hold the evolving definition of the software itself.
- `support-*` folders help teams and AI generate or reuse the specs.
- `process-*` folders describe management, delivery, and operations workflows outside the software definition.
- `records-*` folders hold historical evidence rather than prescriptive guidance.

## Artifact Responsibilities

| Layer | Primary Question | Contains | Must Not Contain |
| --- | --- | --- | --- |
| A1 | How is the system organized? | Module ownership, dependency direction, layered structure | Feature-level business detail |
| A2 | How should modules collaborate and be implemented? | Ports, facades, tokens, providers, naming rules | Module-specific business requirements |
| BRD | Why are we building this? | Business goals, users, success metrics | Implementation details |
| FRD | What must the system do? | Features, flows, validations, states | Storage design |
| A4 | What data and invariants exist? | Aggregates, entities, value objects, lifecycles | Transport-only API concerns |
| A3 | How is behavior exposed? | Endpoint contracts, validation, errors, process flow | New domain fields not present in A4 |
| TEST | How is behavior verified? | Success, failure, edge, validation cases | Unspecified business logic |
| DELIVERY | How is the software moved safely into use and changed over time? | CR process, release, deployment, rollback, bug triage, hotfix process | Core domain design |
| OPERATIONS | How is the software operated and recovered? | Incident response, alert handling, monitoring, RCA, on-call | Domain or API specification |
| RECORDS | What actually happened over time? | Historical CR, deploy, bug, and incident records | Prescriptive design for the software itself |

## Module Starting Points

| Module | BRD Entry | FRD Entry | Notes |
| --- | --- | --- | --- |
| order | `03-spec-business/01-business-requirements/order-management.brd.md` | `03-spec-business/02-functional-requirements/order/order.frd.md` | Sample feature available: `create-order` |
| workflow | `03-spec-business/01-business-requirements/workflow-management.brd.md` | `03-spec-business/02-functional-requirements/workflow/workflow.frd.md` | Business files intentionally blank in this draft |
| user | `03-spec-business/01-business-requirements/user-role-management.brd.md` | `03-spec-business/02-functional-requirements/user/user.frd.md` | Business files intentionally blank in this draft |
| project | `03-spec-business/01-business-requirements/project-management.brd.md` | `03-spec-business/02-functional-requirements/project/project.frd.md` | Business files intentionally blank in this draft |

## Update Rule

When a requirement changes:

1. Reconfirm A1 and A2 constraints still hold.
2. Update BRD and FRD first if business intent changed.
3. Update A4, then A3, then TEST.
4. Update DELIVERY docs if release, bug, or deployment process changes.
5. Update OPERATIONS docs if monitoring, incident, or recovery process changes.
6. Add or update RECORDS when real change, delivery, or operational events occur.
7. Verify no downstream file violates module boundaries, dependency direction, token conventions, or provider rules.

## Separation Rule

- `03-spec-business` through `06-spec-testing` define the software.
- `12-process-delivery` and `13-process-operations` define the surrounding engineering processes.
- `14-records-history` stores dated historical evidence of what actually happened, including requirement and scope changes.
- Do not mix operational workflow with business domain behavior unless the software explicitly models that workflow as a product feature.
