# Token Conventions

| Kind | Example | Rule |
| --- | --- | --- |
| Repository token | `ORDER_REPOSITORY` | Upper snake case, module first |
| Reader port token | `PROJECT_READER_PORT` | Upper snake case, target capability last |
| Command port token | `PAYMENT_GATEWAY` | Upper snake case, external capability last |
| Facade token | `USER_PERMISSION_FACADE` | Upper snake case, facade purpose explicit |
| Query service token | `ORDER_QUERY_SERVICE` | Upper snake case, read capability explicit |

- Keep tokens stable and implementation-agnostic.
- Do not reuse one token for multiple unrelated contracts.
- Prefer one token per repository, port, facade, or provider contract.
- Module-specific tokens should live in `modules/<module-name>/<module-name>.tokens.ts`.
- Shared or external tokens should live under `shared/constants/tokens/`.
- Export tokens, not concrete implementation classes, across module boundaries.

## Example

```ts
export const ORDER_REPOSITORY = "ORDER_REPOSITORY";
export const ORDER_FACADE = "ORDER_FACADE";
export const ORDER_READER_PORT = "ORDER_READER_PORT";
export const ORDER_QUERY_SERVICE = "ORDER_QUERY_SERVICE";
export const PAYMENT_GATEWAY = "PAYMENT_GATEWAY";
```
