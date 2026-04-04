# Facade Example

## Example: User Permission Facade

A `UserPermissionFacade` may expose a single method such as `canConfirmOrderPayment(actorUserId)` while internally checking:

- user exists
- user status is ACTIVE
- user has an allowed finance role

Consumers only depend on the facade contract, not on user storage details.

Good facade methods:

- `checkPermission`
- `getOrderSummary`
- `markAsPaid`

Bad facade methods:

- `save`
- `update`
- `delete`
