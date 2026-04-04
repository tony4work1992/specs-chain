# Prompt: Generate Module

```text
Use A1 and A2 as structural constraints.
Generate BRD, FRD, A4, A3, and TEST for one module in that order.
Do not invent new modules or cross-module repositories.
Keep external references as ids.
If implementation is requested, use domain/application/infrastructure/presentation layering.
Place repository contracts in domain/repositories/.
Place repository implementations in infrastructure/persistence/.
Use named tokens in <module-name>.tokens.ts and group providers in infrastructure/providers/.
Expose module capability through facades, reader ports, command ports, or query services instead of raw persistence methods.
```
