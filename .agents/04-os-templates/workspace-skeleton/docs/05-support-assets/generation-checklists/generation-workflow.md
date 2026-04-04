# Generation Workflow

1. Confirm the target module and requested mode: full generation, feature generation, or refinement.
2. Read A1 and A2 first to confirm module ownership, dependency direction, and tactical conventions.
3. Read upstream artifacts in order: BRD, FRD, A4, A3, TEST.
4. Update business artifacts first when the behavior changes.
5. Generate or refine A4, then A3, then TEST.
6. If code generation is requested, map the artifacts into `domain/`, `application/`, `infrastructure/`, and `presentation/`.
7. Verify naming, token placement, provider grouping, coverage, and boundary rules.
8. Generate code only when explicitly requested.
