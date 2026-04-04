# A4 Domain Data Model Spec Template

Use this outline when creating a new domain spec:

1. Domain name, summary, owner module, and bounded context
2. Aggregate roots and entity list
3. Fields, behaviors, and internal children
4. Value objects and enums
5. Relationships and ownership rules
6. Invariants and lifecycle rules
7. Identifier strategy, auditing, and soft delete
8. Persistence assumptions, repositories, and query patterns
9. Cross-module references, security and visibility, notes
10. Expected generated files

## Minimum YAML Shape

```yaml
domain_name: ""
summary: ""
owner_module: ""

bounded_context:
  name: ""
  description: ""

aggregate_roots: []
entities: []
value_objects: []
enums: []
relationships: []
ownership_rules: []
invariants: []
lifecycle_rules: []

identifiers:
  strategy: ""
  fields: []

auditing:
  enabled: true
  fields: []

soft_delete:
  enabled: false
  field: ""

persistence:
  database_type: ""
  tables: []
  indexes: []
  unique_constraints: []
  foreign_keys: []
  orm_notes: []

repositories: []
cross_module_references: []
query_patterns: []
security_and_visibility: []
notes: []
expected_generated_files: []
```

## Split-File Guidance

When the model is large, keep the aggregate overview in `<domain>.domain.yaml` and split supporting detail into:

- `<domain>-invariants.yaml`
- `<domain>-lifecycle.yaml`
- `<domain>-query-patterns.yaml`
- child entity specs such as `order-item.domain.yaml`

The split files should still preserve the same information as the full A4 template, only distributed more readably.
