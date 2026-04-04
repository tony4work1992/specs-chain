# Change Request Process

## Purpose

Define how development change requests are proposed, assessed, approved, implemented, and traced across software artifacts and releases.

## When To Use A CR

Use a change request when a proposed change affects one or more of these:

- business scope
- feature behavior
- domain model
- API contract
- test expectations
- release scope

Do not use a CR for purely clerical edits unless those edits still alter delivered behavior or delivery commitments.

## Core Flow

1. Register the change request with business reason and expected impact.
2. Classify whether the change is new scope, enhancement, bug-driven change, compliance change, or operationally driven change.
3. Identify affected modules and affected artifacts.
4. Decide approval outcome, target release, and implementation scope.
5. Update software-definition artifacts in dependency order.
6. Record implementation and release outcome in the CR history record.

## Required Inputs

- requester
- reason for change
- business impact
- affected modules
- affected artifacts
- urgency or target release

## Required Outputs

- CR identifier
- decision status
- traceability to affected docs
- implementation scope
- release target or disposition

## Traceability Rule

Each approved CR should point to the artifacts it changes, typically in this order:

1. BRD
2. FRD
3. A4
4. A3
5. TEST
6. release or deployment record

## Decision States

- `PROPOSED`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `IN_IMPLEMENTATION`
- `RELEASED`
- `CLOSED`

## Separation Rule

- `12-process-delivery` defines how CRs are handled.
- `14-records-history/01-change-requests` stores the history of actual CRs.
