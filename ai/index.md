# AI Docs Index

This index is the working entry point for the documentation system under `docs/ai`.

## Scope In This Draft

- Governance, strategy, tactics, templates, playbooks, prompts, examples, and glossary files are populated.
- Business-heavy files are intentionally left blank for now, except one sample feature: `create-order`.
- Technical feature artifacts are intentionally populated for `create-order` only.
- Delivery and operations folders are populated to cover non-software process work such as bugs, deployment, rollback, incidents, and postmortems.
- Records folders are populated to store historical CR, deployment, bug, and incident logs.

## Top-Level Map

- `00-rules-governance`: naming, review, prompt, and quality rules
- `01-rules-strategy`: A1 strategic design and architecture boundaries
- `02-rules-tactics`: A2 tactical rules for ports, facades, tokens, providers, and implementation conventions
- `03-spec-business`: BRD, FRD, business rules, and user stories
- `04-spec-domain-models`: A4 domain and data model artifacts
- `05-spec-api-specs`: A3 API specifications
- `06-spec-testing`: test strategy, templates, and test specs
- `07-support-generation`: generation workflow, checklists, and done criteria
- `08-support-playbooks`: repeatable working playbooks
- `09-support-prompts`: reusable AI prompt patterns
- `10-support-examples`: end-to-end examples
- `11-shared-glossary`: shared business and technical vocabulary
- `12-process-delivery`: CR, bug, release, deployment, hotfix, rollback, and change-management process docs
- `13-process-operations`: incident, monitoring, alert, on-call, maintenance, postmortem, and RCA process docs
- `14-records-history`: historical records of actual change, delivery, and operational events

## Prefix Legend

- `rules`: stable rules and constraints that should not grow with business scope
- `spec`: software-definition artifacts that describe the product itself
- `support`: helper layers for generation, reuse, and working practices around the specs
- `shared`: shared vocabulary used across the documentation system
- `process`: delivery and operational processes that surround the software but are not the software itself
- `records`: historical evidence of what actually happened over time

## Structural Constraints From A1 And A2

- Treat A1 as the source of truth for module ownership, dependency direction, and layered structure.
- Treat A2 as the source of truth for facade, port, query service, token, provider, and naming conventions.
- Apply A1 and A2 to every downstream artifact, even when BRD, FRD, A4, A3, and TEST are generated incrementally.

## Generation Order

1. BRD
2. FRD
3. A4 (Domain Model)
4. A3 (API Spec)
5. TEST
6. CODE (only when explicitly requested)

## Recommended Starting Points

- Read `00-rules-governance/` for rules.
- Read `01-rules-strategy/` and `02-rules-tactics/` for architectural and tactical constraints.
- Use `04-spec-domain-models/order/`, `05-spec-api-specs/order/create-order.api.yaml`, and `06-spec-testing/.../create-order...` as the concrete sample chain.
- Use `07-support-generation/`, `08-support-playbooks/`, `09-support-prompts/`, `10-support-examples/`, and `11-shared-glossary/` as supporting layers around generation and reuse.
- Use `12-process-delivery/` for change-request, release, deployment, rollback, bug, and hotfix process guidance.
- Use `13-process-operations/` for incident, alert, monitoring, on-call, and RCA guidance.
- Use `14-records-history/` for dated historical records of change requests, deployments, bugs, and incidents.

## Quick Mapping

- A1 shapes `module-boundaries.md`, `system-boundaries.md`, and `dependency-rules.md`.
- A2 shapes `token-conventions.md`, `provider-conventions.md`, `facade-port-query-service-conventions.md`, `repository-conventions.md`, and `module-template-rules.md`.
- `create-order` is the sample feature that shows how upstream A1/A2 constraints appear in FRD, A3, and TEST.

## Process Layers Beyond Software Artifacts

- `12-process-delivery` contains process docs for software delivery work that happens around the system, not inside the system definition itself.
- `13-process-operations` contains process docs for running and supporting the software after release.
- `14-records-history` contains historical records of real CR, deployment, defect, and incident events.

## Records Breakdown

- `14-records-history/01-change-requests`: history of development change requests and affected artifacts
- `14-records-history/02-deployments`: deployment and release execution history
- `14-records-history/03-bugs`: confirmed bug history and fix outcome
- `14-records-history/04-incidents`: incident history, recovery, and follow-up links
