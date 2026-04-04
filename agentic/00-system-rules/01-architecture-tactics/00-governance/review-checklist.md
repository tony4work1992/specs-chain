# Review Checklist

## BRD

- [ ] Business goal is explicit.
- [ ] Target users are named.
- [ ] Success metrics are measurable.
- [ ] No technical implementation detail leaks in.

## FRD

- [ ] Feature list aligns with BRD goals.
- [ ] Validation rules are explicit.
- [ ] States and transitions are named.
- [ ] Cross-module interactions are described functionally, not structurally.

## A4

- [ ] Aggregate root is explicit.
- [ ] External references use ids only.
- [ ] Invariants match FRD rules.
- [ ] Repository contract is module-local.

## A3

- [ ] Endpoint matches FRD behavior.
- [ ] No new fields appear outside A4.
- [ ] Errors are testable.
- [ ] Cross-module calls use ports or facades.

## TEST

- [ ] Success and failure cases exist.
- [ ] Validation rules are covered.
- [ ] Expected results are explicit.
- [ ] Referenced APIs and FRDs are correct.

## Global

- [ ] No cross-module repository leakage.
- [ ] Naming follows the documented conventions.
- [ ] Every A3 is covered by at least one test artifact.
- [ ] Updated files remain connected to upstream and downstream artifacts.
