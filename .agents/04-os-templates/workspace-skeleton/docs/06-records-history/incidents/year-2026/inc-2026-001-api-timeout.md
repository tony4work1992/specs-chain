# Incident Record

## Identity

- Incident ID: `INC-2026-001`
- Title: API timeout spike during evening traffic window
- Severity: `SEV-2`
- Started at: 2026-03-20 19:12 ICT
- Resolved at: 2026-03-20 19:46 ICT
- Incident commander: Engineering Manager

## Impact

- Affected services: public API gateway and order API
- Affected users: sales and finance users attempting order creation or refresh
- Business impact: elevated timeout rate on order-related screens for about 34 minutes

## Timeline

1. Detection: timeout alert fired on API latency and error threshold
2. Escalation: on-call engineer confirmed real degradation and opened incident bridge
3. Mitigation: traffic shaping and short-term cache tuning reduced pressure on the order read path
4. Recovery: timeout rate returned to normal and smoke checks passed

## Technical Summary

- Immediate trigger: traffic burst combined with an expensive order detail query path
- Root cause summary: insufficiently optimized query path under burst conditions
- Contributing factors: missing warm-cache expectation and delayed alert correlation between API and read model metrics

## Recovery

- Mitigation applied: temporary cache tuning and query timeout threshold review
- Rollback used: No
- Validation after recovery: API latency, create-order smoke check, and order detail refresh all returned healthy

## Follow-Up

- Linked postmortem: pending
- Linked RCA: pending
- Action items: optimize the hot query path, tighten alert correlation, and review release-time smoke coverage for burst traffic scenarios
