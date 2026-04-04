# Naming Conventions

## Document Naming

- Use lowercase kebab-case for all filenames, including `readme.md`, `a1-*`, `a2-*`, `a3-*`, `a4-*`, `t1-*`, and `adr-*`.
- Use ordered purpose prefixes for grouped folders when the folder role should be obvious at a glance, for example `01-business-requirements`, `02-functional-requirements`, `01-unit-tests`, or `01-change-requests`.
- Keep module folder names singular: `order`, `workflow`, `user`, `project`.
- Use `year-YYYY` for record-year folders, for example `year-2026`.
- Use suffixes to signal artifact type: `.brd.md`, `.frd.md`, `.feature.md`, `.domain.yaml`, `.api.yaml`, `.test.yaml`.

## Identifier Naming

- Aggregate identifiers use `<module>Id`, for example `orderId`, `projectId`, `workflowId`, `userId`.
- Business-readable codes use stable prefixes when helpful, such as `orderNumber` or project `code`.
- External references always use the foreign aggregate id, not embedded objects.

## Rule Naming

- Use short imperative wording for rules, for example `Require active project before order creation`.
- Prefix test case codes with module and scope, for example `ORD_CREATE_UNIT_001`.
