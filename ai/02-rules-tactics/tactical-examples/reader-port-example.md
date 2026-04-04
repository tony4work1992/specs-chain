# Reader Port Example

## Example: ProjectReaderPort

A reader port for the project module should return only what consumers need, for example:

- `projectId`
- `status`
- `ownerUserId`
- minimal membership summary when required

This keeps the dependency small and avoids leaking project persistence details.

Do not expose:

- ORM entities
- repository implementations
- unrelated project internals
