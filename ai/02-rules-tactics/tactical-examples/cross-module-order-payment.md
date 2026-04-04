# Cross-Module Order Payment Example

## Scenario

`pay-order` needs order state from the order module, actor permission from the user module, and optional payment verification from an external gateway.

## Interaction Shape

1. Order use case loads the `Order` aggregate from `OrderRepository`.
2. Order use case asks `UserPermissionFacade` whether the actor can confirm payment.
3. Order use case asks `PaymentGatewayPort` to verify the payment reference when required.
4. Order aggregate transitions from `PENDING_PAYMENT` to `PAID`.

## Why This Is Safe

- No cross-module repository call occurs.
- External verification remains behind a port.
- Permission rules stay owned by the user module.
