# Use Case Rules

- One use case handles one business intent.
- Use cases coordinate repositories, ports, facades, and domain services.
- Use cases should be named after the action, for example `CreateOrderUseCase`.
- Use cases must enforce A4 invariants and A3 validation outcomes consistently.
- Use cases load aggregates through repository contracts, not repository implementations.
- Use cases may publish events or invoke external ports, but should not contain HTTP or TypeORM-specific code.
