# ADR-003 Repository Per Module

    - Status: Accepted

    ## Context

    Each module owns different aggregates and invariants.

    ## Decision

    Keep repositories local to the owning module.

    ## Consequences

    - Cross-module storage coupling is reduced.
- Consumers use ports and facades instead of repositories.
