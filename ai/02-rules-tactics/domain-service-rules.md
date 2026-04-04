# Domain Service Rules

- Use a domain service when logic belongs to the domain but does not fit naturally on one entity.
- Keep domain services pure where possible.
- Domain services may coordinate multiple entities within the same aggregate or module.
- Cross-module orchestration belongs in application services or use cases, not domain services.
- Domain services must not import NestJS, TypeORM, or controller classes.
