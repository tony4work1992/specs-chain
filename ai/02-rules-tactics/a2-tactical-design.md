# NestJS Clean Architecture Guide v2
## Focus: Cross-Module Facade/Port and Token Conventions

## 1. Purpose

This document provides a practical design guide for building a **NestJS + TypeORM** application using:

- Clean Architecture
- Modular Monolith
- clear module ownership
- cross-module communication through **facades**, **ports**, and **contracts**
- consistent **token**, **provider**, and **naming conventions**

This version does **not** target any specific business domain.  
It is intended as a reusable blueprint for enterprise NestJS applications.

---

## 2. Main Problem This Guide Solves

In large NestJS projects, these problems often appear:

- service-to-service dependency chains
- circular dependency between modules
- modules directly accessing other modules' repositories
- persistence details leaking across business boundaries
- inconsistent provider token naming
- use cases tightly coupled to implementation classes

This guide solves those issues by applying the following rule:

```text
A module should expose capability, not persistence detail.
```

That means:

- do **not** expose raw repository implementations across modules
- expose **facades**, **reader ports**, **command ports**, or **query services**
- depend on **tokens/contracts**, not concrete implementation classes

---

## 3. High-Level Rules

## 3.1 Module ownership rule
Each module owns:

- its domain model
- its use cases
- its repository contracts
- its repository implementation
- its outward-facing facade / exposed ports

Other modules should not directly manipulate its persistence layer.

## 3.2 Cross-module access rule
When `ModuleA` needs something from `ModuleB`, it should use one of these:

1. **Facade**
2. **Reader Port**
3. **Command Port**
4. **Query Service**
5. **Event-based communication**

Avoid:

```text
ModuleA -> ModuleBRepositoryImpl
ModuleA -> TypeORM repository of ModuleB
```

## 3.3 Token rule
All cross-layer or cross-module dependencies should use **named injection tokens**.

Avoid magic strings scattered everywhere.

## 3.4 Facade rule
A facade should expose **business capability**, not raw database methods.

Good:
- `reserveForOrder`
- `getOrderSummary`
- `markAsPaid`
- `checkPermission`

Bad:
- `save`
- `update`
- `delete`
- `findOneById`

Those low-level methods belong to repositories, not module-facing contracts.

---

## 4. Recommended Project Structure

```bash
src/
├── app.module.ts
├── main.ts
│
├── shared/
│   ├── constants/
│   │   └── tokens/
│   │       ├── common.tokens.ts
│   │       └── external.tokens.ts
│   │
│   ├── domain/
│   │   ├── base.entity.ts
│   │   ├── aggregate-root.ts
│   │   ├── value-object.ts
│   │   └── domain-error.ts
│   │
│   ├── application/
│   │   ├── use-case.ts
│   │   ├── command.ts
│   │   ├── query.ts
│   │   └── application-error.ts
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── typeorm.config.ts
│   │   │   ├── data-source.ts
│   │   │   ├── base.repository.ts
│   │   │   └── transaction.manager.ts
│   │   │
│   │   └── messaging/
│   │       └── event-bus.interface.ts
│   │
│   └── presentation/
│       ├── filters/
│       │   └── global-exception.filter.ts
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       └── pipes/
│           └── validation.pipe.ts
│
└── modules/
    ├── user/
    │   ├── user.module.ts
    │   ├── user.tokens.ts
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   └── presentation/
    │
    ├── order/
    │   ├── order.module.ts
    │   ├── order.tokens.ts
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   └── presentation/
    │
    └── payment/
        ├── payment.module.ts
        ├── payment.tokens.ts
        ├── domain/
        ├── application/
        ├── infrastructure/
        └── presentation/
```

---

## 5. Cross-Module Design Patterns

## 5.1 Facade Pattern
Use this when another module needs a **business capability** from your module.

### Example use cases
- Payment module needs order validation
- Notification module needs user profile info
- Workflow module needs permission check
- Order module needs inventory reservation

### Facade characteristics
A facade:
- belongs to the owning module
- hides repository and internal rules
- exposes meaningful business operations
- may internally call repository, domain service, or use case

### Example

```ts
export interface OrderFacade {
  getOrderSummary(orderId: string): Promise<OrderSummaryDto | null>;
  markAsPaid(orderId: string): Promise<void>;
  canBeCancelled(orderId: string): Promise<boolean>;
}
```

Other modules depend on the facade token, not repository.

---

## 5.2 Reader Port Pattern
Use this when a module needs **read-only information** from another module.

### Example
Payment needs:
- order total
- order status
- customer id

Instead of exposing full OrderRepository, expose a reader port:

```ts
export interface OrderReaderPort {
  getOrderSummary(orderId: string): Promise<OrderSummaryDto | null>;
}
```

This is safer than repository leakage.

---

## 5.3 Command Port Pattern
Use this when a module needs another module to perform an action.

Example:

```ts
export interface InventoryReservationPort {
  reserveForOrder(orderId: string, items: ReserveItemDto[]): Promise<void>;
}
```

This is better than:
- directly updating inventory entities
- directly saving inventory repository from another module

---

## 5.4 Query Service Pattern
Use this when:
- read access is common
- the result is query-focused rather than aggregate-focused
- multiple modules need a stable read model

Example:

```ts
export interface UserQueryService {
  getBasicProfile(userId: string): Promise<UserBasicProfileDto | null>;
}
```

---

## 5.5 Event Communication Pattern
Use events when:
- the dependency should be decoupled
- eventual consistency is acceptable
- multiple modules react to the same business event

Example:
- `order-created`
- `payment-completed`
- `user-role-assigned`

This avoids synchronous dependency in some cross-module flows.

---

## 6. What Should Be Exposed by a Module

A module may expose:

- facade
- reader port
- command port
- query service
- event contracts
- DTOs intended for cross-module use

A module should usually **not** expose:

- repository implementation
- ORM entity
- TypeORM repository
- internal domain service
- internal mapper

---

## 7. File Structure for a Module with Facade/Port Support

Example for `order`:

```bash
modules/order/
├── order.module.ts
├── order.tokens.ts
│
├── domain/
│   ├── entities/
│   │   └── order.entity.ts
│   ├── enums/
│   │   └── order-status.enum.ts
│   ├── repositories/
│   │   └── order.repository.ts
│   └── services/
│       └── order-domain.service.ts
│
├── application/
│   ├── dto/
│   │   ├── order-summary.dto.ts
│   │   └── reserve-order-result.dto.ts
│   │
│   ├── use-cases/
│   │   ├── create-order.use-case.ts
│   │   ├── cancel-order.use-case.ts
│   │   └── mark-order-paid.use-case.ts
│   │
│   ├── facades/
│   │   └── order.facade.ts
│   │
│   ├── ports/
│   │   ├── order-reader.port.ts
│   │   └── order-command.port.ts
│   │
│   └── services/
│       └── order-query.service.ts
│
├── infrastructure/
│   ├── persistence/
│   │   └── typeorm/
│   │       ├── entities/
│   │       │   └── order.orm-entity.ts
│   │       ├── mappers/
│   │       │   └── order-persistence.mapper.ts
│   │       └── repositories/
│   │           └── order.repository.impl.ts
│   │
│   └── providers/
│       └── order.providers.ts
│
└── presentation/
    └── http/
        ├── controllers/
        │   └── order.controller.ts
        ├── requests/
        │   └── create-order.request.ts
        └── responses/
            └── order.response.ts
```

---

## 8. Convention for Tokens

## 8.1 Why tokens matter
Using tokens gives you:

- loose coupling
- easier test mocking
- consistent DI
- easier module replacement
- clean boundary between contract and implementation

## 8.2 Recommended token naming
Use **UPPER_SNAKE_CASE** constants.

Examples:

```ts
export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
export const ORDER_FACADE = 'ORDER_FACADE';
export const ORDER_READER_PORT = 'ORDER_READER_PORT';
export const ORDER_COMMAND_PORT = 'ORDER_COMMAND_PORT';
export const ORDER_QUERY_SERVICE = 'ORDER_QUERY_SERVICE';
```

For external systems:

```ts
export const PAYMENT_GATEWAY = 'PAYMENT_GATEWAY';
export const INVENTORY_RESERVATION_PORT = 'INVENTORY_RESERVATION_PORT';
export const EVENT_BUS = 'EVENT_BUS';
```

## 8.3 Where to place tokens
Preferred:

- module-specific tokens in: `modules/<module-name>/<module-name>.tokens.ts`
- shared/global tokens in: `shared/constants/tokens/*.ts`

Example:
- `modules/order/order.tokens.ts`
- `modules/user/user.tokens.ts`
- `shared/constants/tokens/external.tokens.ts`

---

## 9. Convention for Contracts

## 9.1 Repository contract naming
Recommended:

```ts
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}
```

File:
- `domain/repositories/order.repository.ts`

Do not use suffix `Interface` unless your team explicitly prefers it.

## 9.2 Port naming
Use explicit names that describe intent.

Good:
- `OrderReaderPort`
- `OrderCommandPort`
- `InventoryReservationPort`
- `UserPermissionPort`

Bad:
- `OrderPort`
- `GeneralPort`
- `SharedServicePort`

## 9.3 Facade naming
Use:

- `OrderFacade`
- `UserFacade`
- `PermissionFacade`

A facade is a capability API for the module.

## 9.4 Query service naming
Use:
- `OrderQueryService`
- `UserQueryService`

Only use query service when the contract is truly read-focused.

---

## 10. Convention for Providers

## 10.1 Use dedicated provider files
For medium and large modules, provider wiring should be grouped in:

```bash
infrastructure/providers/
```

Example:
- `order.providers.ts`
- `user.providers.ts`

## 10.2 Provider groups
Recommended grouping:

- repository providers
- facade providers
- port providers
- gateway providers

Example:

```ts
export const orderProviders: Provider[] = [
  {
    provide: ORDER_REPOSITORY,
    useClass: OrderRepositoryImpl,
  },
  {
    provide: ORDER_FACADE,
    useClass: OrderFacadeImpl,
  },
  {
    provide: ORDER_READER_PORT,
    useExisting: OrderFacadeImpl,
  },
  {
    provide: ORDER_COMMAND_PORT,
    useExisting: OrderFacadeImpl,
  },
];
```

## 10.3 `useExisting` vs `useClass`
Use `useExisting` when one implementation class fulfills multiple contracts.

Example:
- one facade class implements both `OrderReaderPort` and `OrderCommandPort`

This avoids creating multiple instances.

---

## 11. Recommended Structure of a Facade

A facade should live in the application layer.

Reason:
- it exposes business capability
- it coordinates use cases or query services
- it should not be a persistence detail

### Example contract

```ts
export interface OrderFacade {
  getOrderSummary(orderId: string): Promise<OrderSummaryDto | null>;
  markAsPaid(orderId: string): Promise<void>;
}
```

### Example implementation

```ts
@Injectable()
export class OrderFacadeImpl implements OrderFacade, OrderReaderPort, OrderCommandPort {
  constructor(
    private readonly getOrderSummaryUseCase: GetOrderSummaryUseCase,
    private readonly markOrderPaidUseCase: MarkOrderPaidUseCase,
  ) {}

  async getOrderSummary(orderId: string): Promise<OrderSummaryDto | null> {
    return this.getOrderSummaryUseCase.execute(orderId);
  }

  async markAsPaid(orderId: string): Promise<void> {
    await this.markOrderPaidUseCase.execute(orderId);
  }
}
```

### Placement
Contract:
- `application/facades/order.facade.ts`

Implementation:
- either
  - `application/facades/order.facade.impl.ts`
- or
  - `application/services/order-facade.service.ts`

Recommended:
- keep both in `application/facades/`

---

## 12. Recommended Structure of a Reader Port

### Contract
```ts
export interface OrderReaderPort {
  getOrderSummary(orderId: string): Promise<OrderSummaryDto | null>;
}
```

### Use
Inject into another module's use case:

```ts
constructor(
  @Inject(ORDER_READER_PORT)
  private readonly orderReaderPort: OrderReaderPort,
) {}
```

### Benefit
The consuming module knows only:
- what information it can read
- not how order persistence is implemented

---

## 13. Recommended Structure of a Command Port

### Contract
```ts
export interface OrderCommandPort {
  markAsPaid(orderId: string): Promise<void>;
}
```

### Benefit
A consuming module requests a business action instead of mutating foreign data directly.

---

## 14. Cross-Module Example

## 14.1 Scenario
`PaymentModule` needs to:
- read order summary
- mark order as paid

## 14.2 Wrong design

```text
PaymentModule
  -> OrderRepositoryImpl
  -> OrderOrmEntity
```

Problems:
- direct persistence coupling
- boundary leak
- future microservice split becomes hard

## 14.3 Correct design

```text
PaymentModule
  -> ORDER_READER_PORT
  -> ORDER_COMMAND_PORT
```

Order module provides those contracts.

---

## 15. Example File Set for `order` Exports

### `modules/order/order.tokens.ts`

```ts
export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
export const ORDER_FACADE = 'ORDER_FACADE';
export const ORDER_READER_PORT = 'ORDER_READER_PORT';
export const ORDER_COMMAND_PORT = 'ORDER_COMMAND_PORT';
export const ORDER_QUERY_SERVICE = 'ORDER_QUERY_SERVICE';
```

### `modules/order/application/ports/order-reader.port.ts`

```ts
import { OrderSummaryDto } from '../dto/order-summary.dto';

export interface OrderReaderPort {
  getOrderSummary(orderId: string): Promise<OrderSummaryDto | null>;
}
```

### `modules/order/application/ports/order-command.port.ts`

```ts
export interface OrderCommandPort {
  markAsPaid(orderId: string): Promise<void>;
}
```

### `modules/order/application/facades/order.facade.ts`

```ts
import { OrderSummaryDto } from '../dto/order-summary.dto';

export interface OrderFacade {
  getOrderSummary(orderId: string): Promise<OrderSummaryDto | null>;
  markAsPaid(orderId: string): Promise<void>;
}
```

### `modules/order/application/facades/order.facade.impl.ts`

```ts
@Injectable()
export class OrderFacadeImpl implements OrderFacade, OrderReaderPort, OrderCommandPort {
  constructor(
    private readonly getOrderSummaryUseCase: GetOrderSummaryUseCase,
    private readonly markOrderPaidUseCase: MarkOrderPaidUseCase,
  ) {}

  async getOrderSummary(orderId: string): Promise<OrderSummaryDto | null> {
    return this.getOrderSummaryUseCase.execute(orderId);
  }

  async markAsPaid(orderId: string): Promise<void> {
    await this.markOrderPaidUseCase.execute(orderId);
  }
}
```

### `modules/order/infrastructure/providers/order.providers.ts`

```ts
import { Provider } from '@nestjs/common';
import {
  ORDER_COMMAND_PORT,
  ORDER_FACADE,
  ORDER_QUERY_SERVICE,
  ORDER_READER_PORT,
  ORDER_REPOSITORY,
} from '../../order.tokens';
import { OrderRepositoryImpl } from '../persistence/typeorm/repositories/order.repository.impl';
import { OrderFacadeImpl } from '../../application/facades/order.facade.impl';
import { OrderQueryServiceImpl } from '../../application/services/order-query.service.impl';

export const orderProviders: Provider[] = [
  {
    provide: ORDER_REPOSITORY,
    useClass: OrderRepositoryImpl,
  },
  {
    provide: ORDER_FACADE,
    useClass: OrderFacadeImpl,
  },
  {
    provide: ORDER_READER_PORT,
    useExisting: OrderFacadeImpl,
  },
  {
    provide: ORDER_COMMAND_PORT,
    useExisting: OrderFacadeImpl,
  },
  {
    provide: ORDER_QUERY_SERVICE,
    useClass: OrderQueryServiceImpl,
  },
];
```

---

## 16. Example Consumer Module

### `modules/payment/application/use-cases/complete-payment.use-case.ts`

```ts
@Injectable()
export class CompletePaymentUseCase {
  constructor(
    @Inject(ORDER_READER_PORT)
    private readonly orderReader: OrderReaderPort,
    @Inject(ORDER_COMMAND_PORT)
    private readonly orderCommand: OrderCommandPort,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderReader.getOrderSummary(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'PENDING') {
      throw new Error('Order cannot be paid');
    }

    await this.orderCommand.markAsPaid(orderId);
  }
}
```

### `modules/payment/payment.module.ts`

```ts
@Module({
  imports: [OrderModule],
  providers: [CompletePaymentUseCase],
})
export class PaymentModule {}
```

---

## 17. Export Convention in Module Files

A module should export only what other modules need.

### Example `order.module.ts`

```ts
@Module({
  imports: [TypeOrmModule.forFeature([OrderOrmEntity])],
  providers: [
    ...orderProviders,
    CreateOrderUseCase,
    GetOrderSummaryUseCase,
    MarkOrderPaidUseCase,
  ],
  exports: [
    ORDER_FACADE,
    ORDER_READER_PORT,
    ORDER_COMMAND_PORT,
    ORDER_QUERY_SERVICE,
  ],
})
export class OrderModule {}
```

Do not export:
- `OrderRepositoryImpl`
- `OrderOrmEntity`
- internal mappers

---

## 18. Convention for DTOs Used Across Modules

When DTOs are shared across modules:
- keep them in the owner module's application layer
- make them stable and intentional
- avoid exposing raw domain entity or ORM entity

Example:
- `application/dto/order-summary.dto.ts`

Good DTO content:
- id
- code
- status
- totalAmount

Bad:
- TypeORM relation objects
- internal metadata not meant for consumers

---

## 19. Convention for Query Services vs Facades

Use **Facade** when:
- you expose multiple business capabilities
- you want a module-level API
- commands and reads are both included

Use **Reader Port / Query Service** when:
- cross-module need is read-only
- the operation is query-specific
- you want narrower contract exposure

### Recommended strategy
- expose narrow ports by default
- expose facade only when broader module API is truly needed

---

## 20. Convention for Internal vs External Ports

## 20.1 Internal ports
Used for module-to-module calls inside the app.

Examples:
- `OrderReaderPort`
- `UserPermissionPort`

## 20.2 External ports
Used for integration with outside systems.

Examples:
- `PaymentGateway`
- `NotificationSender`
- `InventoryApiPort`

Naming idea:
- internal: business-oriented names
- external: technical integration names

---

## 21. Suggested Default Conventions

### 21.1 File suffixes
- `.entity.ts` -> domain entity
- `.orm-entity.ts` -> TypeORM entity
- `.repository.ts` -> repository contract
- `.repository.impl.ts` -> repository implementation
- `.port.ts` -> narrow capability contract
- `.facade.ts` -> broader module capability contract
- `.facade.impl.ts` -> facade implementation
- `.query-service.ts` -> query contract
- `.query-service.impl.ts` -> query implementation
- `.use-case.ts` -> application orchestration
- `.tokens.ts` -> DI tokens

### 21.2 Folder conventions
- `domain/repositories/`
- `application/ports/`
- `application/facades/`
- `application/services/`
- `infrastructure/providers/`

---

## 22. Testing Benefits of This Style

This structure makes testing easier.

Example:
- in a unit test for `CompletePaymentUseCase`, you can mock:

```ts
{
  provide: ORDER_READER_PORT,
  useValue: fakeOrderReaderPort,
},
{
  provide: ORDER_COMMAND_PORT,
  useValue: fakeOrderCommandPort,
}
```

No need to instantiate:
- TypeORM repository
- database
- actual order module internals

This is one of the biggest advantages of port-based cross-module design.

---

## 23. Common Mistakes to Avoid

### 23.1 Exposing repositories from modules
Bad:
```ts
exports: [OrderRepositoryImpl]
```

### 23.2 Reusing one giant shared service
Bad:
- `CommonService`
- `SharedBusinessService`
- `CoreModuleService`

These usually become unbounded god services.

### 23.3 Facade that mirrors repository
Bad facade:

```ts
findById()
save()
update()
delete()
```

That is just repository leakage with a different name.

### 23.4 Too many broad ports
Bad:
- one `OrderPort` with 20 unrelated methods

Prefer:
- `OrderReaderPort`
- `OrderCommandPort`
- `OrderPricingPort`

### 23.5 Exporting ORM entities
Other modules should not depend on foreign ORM entities.

---

## 24. Recommended AI Generation Checklist

When generating a new module with cross-module support:

1. create `<module-name>.tokens.ts`
2. define repository contract in `domain/repositories/`
3. define exposed ports in `application/ports/`
4. define facade only if broader API is needed
5. create repository implementation in `infrastructure/persistence/typeorm/repositories/`
6. create provider mapping in `infrastructure/providers/`
7. export only tokens, not concrete classes
8. use `useExisting` when one class implements multiple contracts
9. create cross-module DTOs intentionally
10. keep repository private to the owner module

---

## 25. Final Recommendation

The recommended default for medium and large NestJS systems is:

- repository per module
- repository kept private
- module capability exposed via facade or narrow ports
- consistent token constants
- provider registration grouped in dedicated files
- cross-module communication through contracts, not persistence leakage

Use this mental model:

```text
Repository = private persistence detail
Port = narrow exposed capability
Facade = broader exposed capability
Token = DI contract key
Provider = implementation binding
```

And this cross-module rule:

```text
Module A needs something from Module B
-> inject B's port or facade token
-> do not inject B's repository
```

---

## 26. Short Summary

### Preferred dependency style

```text
Controller
  -> UseCase
      -> Port / Facade
          -> Owner Module Implementation
              -> Repository
                  -> TypeORM
```

### Preferred export style

```text
export: tokens
do not export: repository implementation
```

### Preferred contract style

```text
Expose business capability, not persistence detail.
```
