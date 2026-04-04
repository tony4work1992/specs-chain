# Bug Triage

## Purpose

Create a consistent way to classify and route defects without mixing defect process into software definition artifacts.

## Triage Inputs

- bug report
- reproduction steps
- environment and release version
- severity and user impact
- evidence such as logs or trace ids

## Triage Outcome

- confirm defect or reject as non-bug
- assign severity and priority
- identify owning team or module
- decide whether the path is normal fix, hotfix, or operational mitigation

## Severity Guide

- `SEV-1`: production outage, data corruption, or critical revenue stop
- `SEV-2`: major user-facing degradation without total outage
- `SEV-3`: important defect with workaround
- `SEV-4`: minor defect or cosmetic issue

## Routing Rules

- Product behavior misunderstanding goes to requirement clarification first.
- Reproducible code or config defect goes to engineering backlog.
- Release-blocking defect goes to hotfix evaluation.
- Incident symptom without root cause certainty is tracked jointly with operations until confirmed.
