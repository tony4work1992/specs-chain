# Repository Conventions

- One repository contract per aggregate root by default.
- Repositories return aggregates or module-owned read models only.
- Repositories never expose another module's entities.
- Use repositories for persistence concerns, not business orchestration.
- Query-heavy screens may use dedicated query services instead of stretching repository contracts too far.

## Split Rule

- Keep repository interfaces or ports in the inner layer, typically `domain/repositories/`.
- Keep repository implementations in infrastructure, typically `infrastructure/persistence/typeorm/repositories/`.
- Application use cases depend on repository contracts, never on TypeORM repositories directly.
