# Change Request Record

## Identity

- CR ID: `CR-2026-001`
- Title: Add order discount support for create-order flow
- Requested by: Product Manager
- Requested at: 2026-03-18
- Change type: `ENHANCEMENT`
- Priority: High
- Status: `RELEASED`

## Business Context

- Reason for change: Sales teams need a controlled discount field during order creation for negotiated commercial deals.
- Expected business outcome: Reduce manual post-processing for discounted orders and improve pricing transparency.
- Urgency: Target next planned release window.

## Scope

- Affected modules: `order`
- In scope: create-order behavior, order domain pricing rules, API request and response contract, test coverage, and release notes.
- Out of scope: promotion engine, approval workflow, and retroactive discount changes on existing paid orders.

## Affected Artifacts

- BRD: `docs/ai/03-spec-business/01-business-requirements/order-management.brd.md`
- FRD: `docs/ai/03-spec-business/02-functional-requirements/order/create-order.feature.md`
- A4: `docs/ai/04-spec-domain-models/order/order.domain.yaml`
- A3: `docs/ai/05-spec-api-specs/order/create-order.api.yaml`
- TEST: `docs/ai/06-spec-testing/01-unit-tests/order/create-order.unit-test.yaml`
- Other docs: `docs/ai/12-process-delivery/change-request-process.md`

## Decision

- Decision date: 2026-03-19
- Approved by: Product Lead and Engineering Lead
- Decision summary: Approved for the March release with a narrow scope limited to order creation.

## Implementation

- Owner: Order module team
- Related PRs / change sets: `PR-241`, `PR-244`
- Related bug records: none
- Related incident records: none

## Release Tracking

- Target release: `REL-2026-03-23-001`
- Actual deployment / release: `docs/ai/14-records-history/02-deployments/year-2026/rel-2026-03-23-001.md`
- Rollback involved: No

## Final Outcome

- Outcome summary: Discount support shipped successfully in the planned release with updated API and unit coverage.
- Follow-up actions: Evaluate whether discount approval should become a separate change request in a later quarter.
