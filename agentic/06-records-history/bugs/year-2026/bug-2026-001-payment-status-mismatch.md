# Bug Record

## Identity

- Bug ID: `BUG-2026-001`
- Title: Payment status mismatch after payment confirmation refresh
- Reported date: 2026-03-12
- Reporter: Finance Operator
- Severity: `SEV-2`
- Priority: High

## Scope

- Affected module: `order`
- Affected feature or API: payment confirmation and order detail refresh
- Environment: Production

## Symptoms

- Observed behavior: An order briefly remained `PENDING_PAYMENT` in the detail view after payment confirmation completed.
- Expected behavior: The detail view should show `PAID` immediately after successful confirmation.
- User impact: Finance users retried confirmation unnecessarily and lost confidence in the payment state.

## Reproduction

1. Confirm payment for a pending order.
2. Refresh the order detail view within a few seconds.
3. Observe stale payment state before the read model catches up.

## Investigation

- Suspected cause: stale read path or delayed projection refresh
- Confirmed root cause: the detail query path read from a lagging projection without a temporary consistency fallback after payment confirmation.
- Related logs / traces: trace ids `ord-pay-3182`, `ord-query-4410`

## Resolution

- Fix summary: adjusted the order detail read strategy to return the persisted paid state immediately after successful confirmation.
- PR / change set: `PR-238`
- Test coverage updated: Yes, regression coverage extended in order lifecycle checks.
- Released in: `docs/ai/14-records-history/02-deployments/year-2026/rel-2026-03-23-001.md`

## Final State

- Status: `CLOSED`
- Follow-up actions: Review whether payment confirmation should publish a stronger consistency signal for downstream read models.
