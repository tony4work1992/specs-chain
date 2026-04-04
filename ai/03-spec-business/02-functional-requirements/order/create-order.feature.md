# Create Order Feature FRD

## Context

- Module: Order
- Feature ID: ORD-F001
- Type: command
- Summary: Create a new order for an active project.

## Actors

- Sales Operator

## Trigger

Operator submits a confirmed order form.

## Preconditions

- Project exists and is `ACTIVE`.
- Requester user exists.
- At least one order item is provided.

## Inputs

| Field | Type | Description |
| --- | --- | --- |
| `projectId` | `string` | Target project identifier. |
| `requestedByUserId` | `string` | User requesting the order. |
| `currency` | `CurrencyCode` | Commercial currency for the order. |
| `items` | `array<OrderItemInput>` | Line items with `sku`, `name`, `quantity`, and `unitPrice`. |
| `note` | `string?` | Optional commercial note. |

## Functional Flow

1. Validate request payload and normalize money fields.
2. The presentation layer delegates to a single `CreateOrderUseCase`.
3. The use case reads project and user context via `ProjectReaderPort` and `UserReaderPort`.
4. Instantiate the `Order` aggregate with calculated totals.
5. Persist through the order repository contract and return the created summary.

## Validation Rules

- `projectId` and `requestedByUserId` are required.
- `items` must contain at least one element.
- `quantity` must be an integer greater than zero.
- `unitPrice.amountMinor` must be greater than zero.
- All items must use the same currency as the order currency.

## Business Rules

- Order total is derived from item quantities and unit prices.
- The requester must be an `ACTIVE` user.
- The project must allow commercial ordering.

## States / Transitions

- `NONE -> PENDING_PAYMENT`

## Outputs

| Field | Type | Description |
| --- | --- | --- |
| `orderId` | `string` | Generated aggregate identifier. |
| `orderNumber` | `string` | Generated business number. |
| `status` | `OrderStatus` | Initial lifecycle state `PENDING_PAYMENT`. |
| `totalAmount` | `Money` | Calculated total amount. |
| `createdAt` | `datetime` | Creation timestamp. |

## Error Scenarios

| Code | HTTP | Meaning |
| --- | --- | --- |
| `PROJECT_NOT_FOUND` | `404` | Project does not exist. |
| `USER_NOT_FOUND` | `404` | Requester does not exist. |
| `INVALID_ORDER_ITEM` | `422` | One or more line items violate quantity or price rules. |
