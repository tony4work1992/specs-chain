# Module Template Rules

A generated module should include:

- `domain/`
- `application/`
- `infrastructure/`
- `presentation/`

## Minimum Internal Structure

```text
modules/<module-name>/
  <module-name>.module.ts
  <module-name>.tokens.ts
  domain/
    entities/
    value-objects/
    enums/
    services/
    policies/
    repositories/
    events/
    errors/
  application/
    dto/
    commands/
    use-cases/
    ports/
    facades/
    services/
    mappers/
  infrastructure/
    persistence/
    gateways/
    providers/
    mappers/
  presentation/
    http/
```

## Required Rules

- Keep repository contracts in `domain/repositories/`.
- Keep repository implementations in `infrastructure/persistence/...`.
- Keep provider wiring in `infrastructure/providers/` for medium and large modules.
- Keep controllers and transport mapping in `presentation/`.
- Keep use case orchestration in `application/`.
- Keep ports, facades, and query services explicit when cross-module access is needed.
- Keep API specs, domain specs, and test specs aligned with the module.

Keep the documentation artifact set complete before asking for implementation generation.
