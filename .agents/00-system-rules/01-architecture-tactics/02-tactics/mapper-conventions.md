# Mapper Conventions

- Mappers translate between transport DTOs, persistence records, and domain objects.
- Do not hide business decisions inside mappers.
- Mapping must be deterministic and side-effect free.
- Keep naming explicit, for example `OrderApiMapper` or `ProjectPersistenceMapper`.

## Typical Mapping Paths

- request DTO -> application DTO
- domain entity -> response DTO
- domain entity -> ORM entity
- ORM entity -> domain entity

Keep HTTP mapping in presentation or application-facing mappers, and keep persistence mapping in infrastructure.
