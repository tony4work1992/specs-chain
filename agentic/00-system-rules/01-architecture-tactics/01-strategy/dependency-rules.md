# Dependency Rules

## Allowed Direction

- `presentation -> application -> domain`
- `infrastructure -> application / domain`
- Application layer may depend on domain contracts inside the same module.
- Infrastructure may depend on application and domain contracts inside the same module.
- Cross-module reads use ports, facades, or query services.
- Cross-module writes use command ports, facades, or event-based communication.
- Shared value objects and enums may be referenced when they remain genuinely shared.

## Forbidden Direction

- Domain layer must not depend on infrastructure, NestJS, or TypeORM.
- Application layer must not depend on controllers or HTTP request models.
- No direct cross-module repository access.
- No direct dependency on another module's ORM entity or TypeORM repository.
- No controller-to-controller calls across modules.
- No API layer creating domain rules that contradict A4.
- No circular module dependencies.

## Repository Rule

- Repository interfaces or ports belong to the inner layer.
- Repository implementations belong to infrastructure.
- Export contracts or tokens, not concrete repository implementation classes.
