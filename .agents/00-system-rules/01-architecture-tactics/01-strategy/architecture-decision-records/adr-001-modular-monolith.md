# ADR-001 Modular Monolith

    - Status: Accepted

    ## Context

    The system needs strong boundaries without distributed-system overhead.

    ## Decision

    Adopt a modular monolith with four bounded contexts documented in A1.

    ## Consequences

    - Boundaries are explicit and locally testable.
- Cross-module interactions remain in-process but contract-driven.
