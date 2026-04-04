# Command Port Example

## Example: PaymentGatewayPort

Use a command port when the module needs to trigger an external side effect such as verifying or recording a payment.

Rules:

- keep the contract explicit
- map remote failures into local application errors
- keep retries and idempotency outside the aggregate when they are infrastructure concerns
- inject the contract through a named token rather than a concrete class
