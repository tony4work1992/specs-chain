# Provider Conventions

- Name providers after the contract they satisfy, for example `OrderRepositoryProvider`.
- Keep cross-module adapters in the consuming module, not in the provider module.
- External integration providers must translate remote errors into local application errors.
- Prefer constructor injection and explicit provider registration per module.

## Placement

- For medium and large modules, group provider wiring under `infrastructure/providers/`.
- Keep repository providers, facade providers, port providers, and gateway providers explicit.
- Prefer `useExisting` when one class implements multiple exposed contracts.

## Export Rule

- Export tokens and curated module-facing contracts.
- Do not export repository implementations or ORM repositories to other modules.
