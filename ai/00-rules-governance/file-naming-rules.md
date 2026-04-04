# File Naming Rules

## Required Patterns

- Shared index file: `readme.md`
- Strategic and tactical anchor files: `a1-*.md`, `a2-*.md`, `a3-*.md`, `a4-*.md`, `t1-*.yaml`
- ADR files: `adr-###-short-title.md`
- BRD: `<module-or-capability>.brd.md`
- FRD module overview: `<module>.frd.md`
- FRD feature detail: `<action>-<module>.feature.md` or an equivalent action-first name such as `create-order.feature.md`
- Domain model: `<entity>.domain.yaml`
- API spec: `<action>-<module>.api.yaml`
- Test spec: `<action>-<module>.<level>-test.yaml`
- Record files: `cr-YYYY-###-short-slug.md`, `bug-YYYY-###-short-slug.md`, `inc-YYYY-###-short-slug.md`, `rel-YYYY-MM-DD-###.md`

## Practical Rules

- One API file describes one endpoint only.
- One feature file describes one user-visible behavior only.
- Prefer singular nouns for aggregate names and module folders.
- Use numbered purpose folders for grouped collections, for example `01-business-requirements`, `02-integration-tests`, or `03-bugs`.
- Do not introduce new modules through file naming alone; modules must exist in A1 first.
