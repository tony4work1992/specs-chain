# Release Process

## Purpose

Describe the standard path for moving approved changes into production.

## Release Stages

1. Confirm scope and release candidate contents.
2. Verify tests, migration readiness, and rollback path.
3. Announce planned release window and impact.
4. Deploy to the target environment.
5. Run smoke checks and high-risk validation.
6. Confirm release health and close the window.

## Entry Criteria

- target changes are approved
- required tests have passed
- migrations and configuration changes are reviewed
- rollback plan exists

## Exit Criteria

- deployment completed
- smoke checks passed
- critical monitoring signals are healthy
- stakeholders informed of final status
