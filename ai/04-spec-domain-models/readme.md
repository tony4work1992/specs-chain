# A4 Domain Models Guide

A4 files describe aggregate roots, entities, value objects, enums, invariants, lifecycle rules, repository contracts, and persistence assumptions.

Rules:

- define the aggregate root first
- use ids for external references
- keep invariants explicit
- separate lifecycle, invariant, and query concerns when the model becomes large

## Recommended A4 Coverage

An A4 artifact set should collectively answer:

- what the business data looks like
- which module owns that data
- which entity is the aggregate root
- which entities are internal children
- which references are external and id-only
- which invariants and lifecycle transitions must always hold
- which persistence and ORM assumptions are safe to generate from

## Template Sections To Cover

- `domain_name`
- `summary`
- `owner_module`
- `bounded_context`
- `aggregate_roots`
- `entities`
- `value_objects`
- `enums`
- `relationships`
- `ownership_rules`
- `invariants`
- `lifecycle_rules`
- `identifiers`
- `auditing`
- `soft_delete`
- `persistence`
- `repositories`
- `cross_module_references`
- `query_patterns`
- `security_and_visibility`
- `notes`
- `expected_generated_files`

These sections may live in one file or be split across a small file group, but the total A4 package for a domain should cover them explicitly.
