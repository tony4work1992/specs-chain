# ADR-004 Cross Module via Port and Facade

    - Status: Accepted

    ## Context

    Modules need controlled collaboration without leaking internal persistence details.

    ## Decision

    Require ports, facades, or query services for cross-module collaboration.

    ## Consequences

    - Dependencies are smaller and easier to mock.
- Boundary violations become easier to detect in review.
