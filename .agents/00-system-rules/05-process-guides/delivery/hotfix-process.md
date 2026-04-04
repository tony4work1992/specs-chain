# Hotfix Process

## When To Use

Use a hotfix only when the normal release cadence is too slow for the business or operational impact.

## Criteria

- active production defect
- meaningful user or business impact
- clear owner and narrowed fix scope
- rollback path exists

## Flow

1. Confirm that the issue qualifies as a hotfix.
2. Reduce scope to the smallest safe corrective change.
3. Validate the fix on the impacted flow.
4. Deploy with elevated monitoring.
5. Merge the fix back into the main development line if a separate branch was used.

## Guardrails

- Avoid opportunistic refactors in hotfix scope.
- Keep the change reversible.
- Create follow-up work for anything deferred.
