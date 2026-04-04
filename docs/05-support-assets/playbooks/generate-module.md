# Generate Module

## Purpose

Generate a new bounded context without skipping documentation layers or violating A1/A2 structure.

## Steps

1. Read A1 to confirm module ownership, boundaries, and dependency direction.
2. Read A2 to confirm ports, facades, tokens, providers, and naming conventions.
3. Create or update BRD for the module.
4. Create FRD module overview and feature files.
5. Create A4 model files, invariants, lifecycle rules, and query patterns.
6. Create A3 endpoint files and TEST artifacts.
7. If implementation generation is requested, map the design into `domain/`, `application/`, `infrastructure/`, and `presentation/`, plus `<module-name>.tokens.ts` and `infrastructure/providers/`.

## Expected Outputs

- Complete module artifact chain from BRD to TEST
- Structural alignment with A1 layered design
- Tactical alignment with A2 token, provider, and cross-module conventions
