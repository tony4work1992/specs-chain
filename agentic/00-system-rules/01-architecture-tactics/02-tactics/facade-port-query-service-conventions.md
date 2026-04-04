# Facade, Port, and Query Service Conventions

## Port

Use a port when the current module needs a stable contract from another module or external system.

### Reader Port

Use a reader port for read-only cross-module information such as project status or user status.

### Command Port

Use a command port when the module must trigger an external side effect or invoke a narrow cross-module action.

## Facade

Use a facade when the provider module wants to expose a curated surface that combines multiple internal checks.

## Query Service

Use a query service when the interaction is read-only and optimized for retrieval rather than domain mutation.

## Event-Based Communication

Use event-based communication when the collaboration is asynchronous or should avoid direct request/response coupling between modules.

## Rules

- Commands do not call another module's repository directly.
- Query services do not mutate domain state.
- Facades should hide internal composition but keep outputs stable and documented.
- Facades should expose business capability, not raw persistence methods like `save`, `update`, or `delete`.
- Ports and facades should depend on named tokens or contracts, not concrete classes.
- Query services should return DTO-style read models rather than domain entities from another module.
