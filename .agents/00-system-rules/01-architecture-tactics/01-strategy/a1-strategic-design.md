# AIPD Design Guide for NestJS + TypeORM + Clean Architecture

## 1. Purpose

This document defines a recommended project structure for building AIPD modules with:

- **NestJS**
- **TypeORM**
- **Clean Architecture**
- **Modular Monolith**
- clear separation between:
  - business rules
  - use case orchestration
  - persistence details
  - HTTP/API delivery layer

This guide is designed to help AI agents and developers generate code in a **consistent, scalable, and maintainable** way.

---

## 2. Core Design Principles

### 2.1 Stable things stay inside
The inner layers should contain the things that are more stable over time:

- business rules
- domain concepts
- use cases
- domain policies
- domain contracts

### 2.2 Volatile things stay outside
The outer layers should contain things that are easier to change:

- NestJS controllers
- TypeORM entities
- database access implementation
- external integrations
- messaging adapters
- cache adapters
- file storage adapters

### 2.3 Dependency direction must point inward
Allowed dependency direction:

```text
presentation -> application -> domain
infrastructure -> application / domain
```

Not allowed:

```text
domain -> infrastructure
application -> controller
domain -> TypeORM
domain -> NestJS
```

### 2.4 Repository contract and repository implementation are different things
A repository should be split into:

- **Repository Interface / Port**: inner layer contract
- **Repository Implementation**: outer layer implementation

Example:

- `domain/repositories/order.repository.interface.ts`
- `infrastructure/persistence/typeorm/repositories/order.repository.impl.ts`

### 2.5 Modules own their business capability
Each module should own:

- its domain model
- its application use cases
- its persistence implementation
- its API exposure

A module should **not directly use another module's repository implementation**.

Instead, a module should expose one of these:

- facade
- application service
- query service
- port

---

## 3. High-Level Architecture

Each business module should follow this layered structure:

```text
presentation
  -> application
      -> domain
infrastructure
  -> application
  -> domain
```

### 3.1 Domain
Contains pure business concepts and business rules.

### 3.2 Application
Contains orchestration logic for use cases.

### 3.3 Infrastructure
Contains persistence and external system implementation details.

### 3.4 Presentation
Contains HTTP controllers, request models, response models, and delivery-layer mapping.

---

## 4. Recommended Project Structure

```bash
src/
├── app.module.ts
├── main.ts
│
├── shared/
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
│   │   ├── logger/
│   │   │   └── logger.service.ts
│   │   │
│   │   └── messaging/
│   │       └── event-bus.interface.ts
│   │
│   └── presentation/
│       ├── http-response.mapper.ts
│       ├── filters/
│       │   └── global-exception.filter.ts
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       └── pipes/
│           └── validation.pipe.ts
│
└── modules/
    └── order/
        ├── order.module.ts
        │
        ├── domain/
        │   ├── entities/
        │   │   └── order.entity.ts
        │   │
        │   ├── value-objects/
        │   │   ├── order-id.vo.ts
        │   │   ├── order-code.vo.ts
        │   │   └── money.vo.ts
        │   │
        │   ├── enums/
        │   │   └── order-status.enum.ts
        │   │
        │   ├── services/
        │   │   ├── order-domain.service.ts
        │   │   └── order-pricing.domain-service.ts
        │   │
        │   ├── policies/
        │   │   └── cancel-order.policy.ts
        │   │
        │   ├── repositories/
        │   │   └── order.repository.interface.ts
        │   │
        │   ├── events/
        │   │   ├── order-created.event.ts
        │   │   └── order-cancelled.event.ts
        │   │
        │   └── errors/
        │       ├── order-not-found.error.ts
        │       ├── order-already-paid.error.ts
        │       └── invalid-order-status.error.ts
        │
        ├── application/
        │   ├── dto/
        │   │   ├── create-order.dto.ts
        │   │   ├── cancel-order.dto.ts
        │   │   └── order-response.dto.ts
        │   │
        │   ├── commands/
        │   │   ├── create-order.command.ts
        │   │   └── cancel-order.command.ts
        │   │
        │   ├── use-cases/
        │   │   ├── create-order.use-case.ts
        │   │   ├── cancel-order.use-case.ts
        │   │   └── get-order-detail.use-case.ts
        │   │
        │   ├── mappers/
        │   │   └── order-application.mapper.ts
        │   │
        │   └── ports/
        │       ├── payment.gateway.interface.ts
        │       ├── inventory.gateway.interface.ts
        │       └── order-event-publisher.interface.ts
        │
        ├── infrastructure/
        │   ├── persistence/
        │   │   └── typeorm/
        │   │       ├── entities/
        │   │       │   └── order.orm-entity.ts
        │   │       │
        │   │       ├── mappers/
        │   │       │   └── order-persistence.mapper.ts
        │   │       │
        │   │       └── repositories/
        │   │           └── order.repository.impl.ts
        │   │
        │   ├── gateways/
        │   │   ├── payment.gateway.ts
        │   │   └── inventory.gateway.ts
        │   │
        │   ├── publishers/
        │   │   └── order-event.publisher.ts
        │   │
        │   └── providers/
        │       └── order.providers.ts
        │
        └── presentation/
            └── http/
                ├── controllers/
                │   └── order.controller.ts
                │
                ├── requests/
                │   ├── create-order.request.ts
                │   └── cancel-order.request.ts
                │
                ├── responses/
                │   └── order.response.ts
                │
                └── mappers/
                    └── order-http.mapper.ts
```

---

## 5. Detailed Explanation of Each Layer

## 5.1 `shared/`
The `shared` folder contains reusable cross-cutting technical and architectural components.

### `shared/domain/`
Contains reusable domain primitives:
- `base.entity.ts`
- `aggregate-root.ts`
- `value-object.ts`
- `domain-error.ts`

Use this area only for general abstractions that are common across many modules.

### `shared/application/`
Contains general application-level abstractions:
- `use-case.ts`
- `command.ts`
- `query.ts`
- `application-error.ts`

These can be used as base types or conventions.

### `shared/infrastructure/`
Contains reusable technical implementation helpers:
- TypeORM config
- database helpers
- transaction manager
- logging
- messaging abstraction

Do **not** place business-specific repositories here.

### `shared/presentation/`
Contains reusable HTTP delivery utilities:
- exception filter
- logging interceptor
- validation pipe
- response mapper helpers

---

## 5.2 `modules/<module-name>/domain/`
This is the business core of the module.

### Responsibilities
- define business entities
- define value objects
- define domain rules
- define repository contracts
- define business errors
- define domain events

### Rules
- do not import NestJS decorators
- do not import TypeORM classes
- do not import HTTP request/response types
- do not access database directly

### Typical files
- `entities/*.entity.ts`
- `value-objects/*.vo.ts`
- `enums/*.enum.ts`
- `services/*.domain-service.ts`
- `policies/*.policy.ts`
- `repositories/*.interface.ts`
- `events/*.event.ts`
- `errors/*.error.ts`

---

## 5.3 `modules/<module-name>/application/`
This layer orchestrates the business flow.

### Responsibilities
- coordinate use cases
- load aggregate(s) through repository interface
- call domain services or policies
- call external ports
- return result DTO or domain object as needed

### Rules
- do not import TypeORM repository directly
- do not contain database query code
- do not contain HTTP-specific decorators
- do not perform framework-specific presentation logic

### Typical files
- `commands/*.command.ts`
- `dto/*.dto.ts`
- `use-cases/*.use-case.ts`
- `ports/*.interface.ts`
- `mappers/*.ts`

---

## 5.4 `modules/<module-name>/infrastructure/`
This layer contains implementation details.

### Responsibilities
- implement repository interfaces using TypeORM
- map domain object <-> ORM entity
- call external services
- publish events
- wire providers for dependency injection

### Rules
- may depend on domain and application
- may depend on NestJS and TypeORM
- should not be imported by domain

### Typical files
- `persistence/typeorm/entities/*.orm-entity.ts`
- `persistence/typeorm/repositories/*.impl.ts`
- `persistence/typeorm/mappers/*.ts`
- `gateways/*.ts`
- `publishers/*.ts`
- `providers/*.ts`

---

## 5.5 `modules/<module-name>/presentation/`
This is the delivery layer.

### Responsibilities
- define controller endpoints
- define request classes
- define response classes
- map request -> command
- map result -> response

### Rules
- do not place core business logic here
- do not place repository access here
- do not perform complex orchestration here

### Typical files
- `controllers/*.controller.ts`
- `requests/*.request.ts`
- `responses/*.response.ts`
- `mappers/*.ts`

---

## 6. File-by-File Intent

Below is the intent of the most important file types.

### `*.entity.ts`
A domain entity. Represents business state and behavior.

### `*.orm-entity.ts`
A TypeORM persistence model. Represents database structure.

### `*.vo.ts`
A value object. Encapsulates validation and invariants for immutable concepts.

### `*.enum.ts`
A set of allowed business states or classifications.

### `*.policy.ts`
A focused rule object used to validate business actions.

### `*.domain-service.ts`
Domain logic that does not belong naturally to a single entity.

### `*.repository.interface.ts`
A repository contract visible to inner layers.

### `*.repository.impl.ts`
Infrastructure implementation of repository behavior.

### `*.command.ts`
Input model for a use case.

### `*.dto.ts`
Application-level data transfer object.

### `*.use-case.ts`
The main orchestration unit for a business action.

### `*.gateway.interface.ts`
An application-layer port for calling an external system.

### `*.gateway.ts`
An infrastructure implementation of an external integration.

### `*.controller.ts`
An HTTP endpoint handler.

### `*.request.ts`
HTTP request validation model.

### `*.response.ts`
HTTP response model.

### `*.mapper.ts`
A mapping file used to transform data between layers.

---

## 7. Recommended Implementation Rules

## 7.1 Controller Rules
A controller should only:
- receive request
- validate request
- transform request into command or dto
- call use case
- transform result into response

A controller should not:
- access database directly
- contain domain rules
- coordinate multiple repositories
- call another module's repository

---

## 7.2 Use Case Rules
A use case should:
- represent one clear business action
- coordinate domain rules and dependencies
- depend on interfaces, not implementations

A use case should not:
- contain raw TypeORM query logic
- return HTTP-specific objects
- depend directly on controllers

Recommended naming:
- `create-order.use-case.ts`
- `cancel-order.use-case.ts`
- `approve-project.use-case.ts`
- `assign-role-to-user.use-case.ts`

---

## 7.3 Repository Rules
A repository should:
- hide persistence details
- expose intent-focused methods
- belong to its own module domain

A repository should not:
- be treated as a global shared module for all domains
- be directly used by unrelated modules
- contain unrelated business decisions

Good examples:
- `findById`
- `save`
- `findPendingOrders`
- `findByWorkflowId`

Bad examples:
- putting all repositories under one global root business module
- allowing all modules to freely update each other's aggregates through raw repository access

---

## 7.4 Domain Service Rules
A domain service should exist when:
- business logic does not belong naturally to one entity
- logic spans multiple value objects or domain rules
- logic is business-focused, not technical

A domain service should not:
- send HTTP requests
- write SQL
- handle controller concerns

---

## 7.5 Mapper Rules
A mapper should be used when crossing boundaries between:
- HTTP request -> command
- domain entity -> response
- domain entity -> ORM entity
- ORM entity -> domain entity

Do not place mapping logic in random files repeatedly.

---

## 8. Cross-Module Interaction Rules

## 8.1 Do not directly call another module's repository implementation
Bad:

```text
PaymentModule -> OrderRepositoryImpl
```

This breaks module boundary and couples domains to persistence details.

## 8.2 Expose capability, not data access detail
A module should expose:
- facade
- use case
- query service
- port

Good:

```text
PaymentModule -> OrderFacade
```

or:

```text
NotificationModule -> UserReaderPort
```

## 8.3 Common patterns for cross-module calls
Preferred options:
1. **Facade**
2. **Application service**
3. **Query service**
4. **Port interface**
5. **Event-driven communication**

---

## 9. Practical Folder Generation Rules for AI

When generating a new module, follow this checklist.

### 9.1 Always generate these top-level module folders

```bash
modules/<module-name>/
├── <module-name>.module.ts
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

### 9.2 Minimum recommended files for a small module

```bash
modules/<module-name>/
├── <module-name>.module.ts
├── domain/
│   ├── entities/
│   │   └── <module-name>.entity.ts
│   ├── repositories/
│   │   └── <module-name>.repository.interface.ts
│   └── enums/
│       └── <module-name>-status.enum.ts
├── application/
│   └── use-cases/
│       ├── create-<module-name>.use-case.ts
│       └── get-<module-name>-detail.use-case.ts
├── infrastructure/
│   └── persistence/typeorm/
│       ├── entities/
│       │   └── <module-name>.orm-entity.ts
│       └── repositories/
│           └── <module-name>.repository.impl.ts
└── presentation/
    └── http/
        ├── controllers/
        │   └── <module-name>.controller.ts
        ├── requests/
        │   └── create-<module-name>.request.ts
        └── responses/
            └── <module-name>.response.ts
```

### 9.3 Add these folders only when needed
Generate only when there is real business need:

- `value-objects/`
- `services/`
- `policies/`
- `events/`
- `errors/`
- `ports/`
- `gateways/`
- `publishers/`
- `mappers/`
- `dto/`
- `commands/`

---

## 10. Naming Conventions

### 10.1 Files
Use kebab-case for file names.

Examples:
- `create-order.use-case.ts`
- `order.repository.interface.ts`
- `order.repository.impl.ts`
- `cancel-order.policy.ts`

### 10.2 Classes
Use PascalCase.

Examples:
- `CreateOrderUseCase`
- `OrderRepositoryInterface`
- `OrderRepositoryImpl`
- `CancelOrderPolicy`

### 10.3 Interfaces / tokens
Recommended patterns:
- interface name: `OrderRepository`
- DI token: `ORDER_REPOSITORY`
- or
- interface file: `order.repository.interface.ts`
- token file: `order.tokens.ts`

For larger projects, string literals should be replaced by constants.

Example:
- `ORDER_REPOSITORY`
- `PAYMENT_GATEWAY`
- `ORDER_EVENT_PUBLISHER`

---

## 11. Dependency Injection Guidance

Avoid using magic strings everywhere.

Recommended structure:

```bash
modules/order/
├── order.tokens.ts
```

Example:

```ts
export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
export const PAYMENT_GATEWAY = 'PAYMENT_GATEWAY';
```

Then in use case:

```ts
constructor(
  @Inject(ORDER_REPOSITORY)
  private readonly orderRepository: OrderRepository,
) {}
```

And in provider config:

```ts
{
  provide: ORDER_REPOSITORY,
  useClass: OrderRepositoryImpl,
}
```

---

## 12. Example Development Flow for a New Feature

Example feature: **Cancel Order**

### Step 1. Define domain rule
Create:
- `domain/policies/cancel-order.policy.ts`
- or add behavior to `domain/entities/order.entity.ts`

### Step 2. Define repository contract methods
Update:
- `domain/repositories/order.repository.interface.ts`

Add methods such as:
- `findById`
- `update`

### Step 3. Create use case
Create:
- `application/use-cases/cancel-order.use-case.ts`

Responsibilities:
- load order
- validate policy
- execute domain behavior
- persist result

### Step 4. Implement infrastructure repository if needed
Update:
- `infrastructure/persistence/typeorm/repositories/order.repository.impl.ts`

### Step 5. Add HTTP request and controller endpoint
Create or update:
- `presentation/http/requests/cancel-order.request.ts`
- `presentation/http/controllers/order.controller.ts`

### Step 6. Register providers in module
Update:
- `order.module.ts`

---

## 13. Provider Registration Example

Example:

```ts
@Module({
  imports: [TypeOrmModule.forFeature([OrderOrmEntity])],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    CancelOrderUseCase,
    OrderRepositoryImpl,
    {
      provide: ORDER_REPOSITORY,
      useExisting: OrderRepositoryImpl,
    },
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrderModule {}
```

Recommended improvement:
- move reusable provider declarations to `infrastructure/providers/`

---

## 14. Example of Good Separation

## 14.1 Good
```text
Controller
  -> CreateOrderUseCase
      -> OrderRepository (interface)
      -> PaymentGateway (interface)
      -> OrderDomainService
Infrastructure
  -> OrderRepositoryImpl
  -> PaymentGatewayImpl
```

## 14.2 Bad
```text
Controller
  -> TypeORM Repository
  -> external HTTP client
  -> business validation
  -> response formatting
```

---

## 15. Guidance for AIPD-Specific Domains

For AIPD, typical modules may include:

- project
- role
- workflow
- stage
- feature
- artifact
- ticket
- checklist
- template
- agent
- prompt
- integration
- user
- permission
- notification
- audit-log

Each of these should follow the same design style.

### Example
For `workflow` module:

- `domain/entities/workflow.entity.ts`
- `domain/repositories/workflow.repository.interface.ts`
- `application/use-cases/create-workflow.use-case.ts`
- `infrastructure/persistence/typeorm/entities/workflow.orm-entity.ts`
- `presentation/http/controllers/workflow.controller.ts`

### Special note for AIPD workflow hierarchy
If the domain hierarchy is:

```text
stage -> role -> workflow -> feature -> step
```

then:
- treat each aggregate carefully
- avoid letting every module directly mutate the whole hierarchy
- define ownership clearly
- expose capability through use cases or facades

---

## 16. When to Simplify

Not every module needs the full structure from day one.

For a very simple CRUD module, this reduced form is acceptable:

```bash
modules/simple-item/
├── simple-item.module.ts
├── domain/
│   ├── entities/simple-item.entity.ts
│   └── repositories/simple-item.repository.interface.ts
├── application/
│   └── use-cases/
│       ├── create-simple-item.use-case.ts
│       └── get-simple-item-detail.use-case.ts
├── infrastructure/
│   └── persistence/typeorm/
│       ├── entities/simple-item.orm-entity.ts
│       └── repositories/simple-item.repository.impl.ts
└── presentation/
    └── http/
        ├── controllers/simple-item.controller.ts
        ├── requests/create-simple-item.request.ts
        └── responses/simple-item.response.ts
```

Only add deeper folders when the domain complexity grows.

---

## 17. Common Mistakes to Avoid

### 17.1 Fat service layer
Do not put all orchestration in one giant `*.service.ts` file.

Instead, split into:
- use cases
- domain services
- policies
- facades
- query services

### 17.2 Repository leakage across modules
Do not let unrelated modules directly use each other's repository implementation.

### 17.3 Mixing domain entity and ORM entity
Do not use one class for both pure business behavior and database mapping if the goal is clean architecture.

### 17.4 Putting business logic in controller
Controllers should remain thin.

### 17.5 Global repository module for all business repositories
Do not create one root business repository module that every other module uses freely.

A shared **technical database module** is good.  
A shared **business repository module** is not recommended.

---

## 18. Suggested AI Generation Behavior

When an AI agent is asked to create a new AIPD module, it should:

1. identify the module name
2. create the standard layer structure
3. create minimal required files first
4. keep business contracts inside `domain/` or `application/`
5. keep TypeORM details inside `infrastructure/`
6. keep HTTP delivery files inside `presentation/`
7. wire DI in `<module-name>.module.ts`
8. avoid direct cross-module repository access
9. generate interfaces before implementations
10. generate mappers when crossing layer boundaries

---

## 19. Final Recommendation

For AIPD, the recommended default is:

- **Modular Monolith**
- **Clean Architecture per module**
- **Repository per module**
- **Use case-oriented application layer**
- **TypeORM implementation in infrastructure**
- **Thin controller layer**
- **Cross-module interaction through capability, not repository leakage**

The architecture should optimize for:
- maintainability
- team scalability
- module ownership
- easier future migration to microservices if needed
- easier AI-assisted code generation

---

## 20. Short Summary

Use this rule of thumb:

```text
Domain = what the business means
Application = what the system does
Infrastructure = how it is done technically
Presentation = how it is exposed
```

And this dependency rule:

```text
presentation -> application -> domain
infrastructure -> application / domain
```

Never the other way around.
