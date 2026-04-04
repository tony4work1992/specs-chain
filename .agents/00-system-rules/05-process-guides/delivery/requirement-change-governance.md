# Requirement Change Governance

## Purpose

Keep requirement changes controlled so software artifacts remain coherent and historically traceable.

## Governance Rules

- No approved behavior change should bypass CR tracking.
- A CR must identify whether it changes business intent or only technical realization.
- If business intent changes, update BRD and FRD before downstream artifacts.
- If technical realization changes without business intent change, update A4, A3, TEST, or process docs as needed.
- Emergency changes should still be backfilled into CR history after stabilization.

## Risk Levels

- `LOW`: local refinement with limited downstream impact
- `MEDIUM`: affects one module across multiple artifacts
- `HIGH`: affects multiple modules, contracts, or release risk
- `CRITICAL`: urgent production-driven change with incident or hotfix coupling

## Approval Hints

- Low-risk changes may be approved by the owning lead.
- Medium and high-risk changes should include architecture and delivery review.
- Critical changes may be approved rapidly, but documentation and traceability must be completed afterward.

## Required Trace Links

- related bug record if defect-driven
- related incident record if outage-driven
- related deployment or release record after rollout
- related software artifacts updated by the change
