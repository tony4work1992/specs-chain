# Rollback Playbook

## Trigger Conditions

- smoke checks fail on critical flow
- severe error rate spike after deployment
- data contract mismatch blocks core usage
- incident commander or release owner calls rollback

## Rollback Steps

1. Stop further rollout activity.
2. Decide whether rollback is application-only, config-only, or full release rollback.
3. Restore the previous safe version or configuration.
4. Validate health on critical flows.
5. Communicate rollback status and next steps.

## Notes

- If a database migration is not backward compatible, the rollback plan must explicitly describe the safe recovery path.
- Rollback is a stabilization action, not root cause analysis.
