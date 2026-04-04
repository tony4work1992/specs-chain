# ADR-002 Clean Architecture

    - Status: Accepted

    ## Context

    The team needs a repeatable way to separate business logic from transport and infrastructure.

    ## Decision

    Use clean architecture layering inside each module.

    ## Consequences

    - Domain logic becomes easier to test.
- Infrastructure can change with less business impact.
