# AI Documentation System (AI-First SDLC)

## 1. Overview

This folder (`docs/ai`) is the **central knowledge system** for AI-assisted software development.

It defines how:

* business requirements are structured
* domain models are designed
* APIs are specified
* code is generated
* tests are validated
* delivery and release work is governed
* operational incidents and follow-up are handled
* change requests and development history are traceable

This system enables a **consistent, scalable, and AI-driven development workflow**.

---

## 2. Core Philosophy

This system is built around a layered model:

```text
WHY     → BRD
WHAT    → FRD
DATA    → A4 (Domain Model)
BEHAVIOR→ A3 (API Spec)
VERIFY  → TEST
BUILD   → A2 + A1
```

Each layer has a clear responsibility and must not overlap.

---

## 3. Folder Structure

```text
docs/ai/

00-rules-governance/   → rules, conventions, quality control
01-rules-strategy/     → A1 (Strategic Design)
02-rules-tactics/      → A2 (Tactical Design)
03-spec-business/     → BRD & FRD
04-spec-domain-models/→ A4 (Domain/Data)
05-spec-api-specs/    → A3 (API)
06-spec-testing/      → Test specs
07-support-generation/   → checklists
08-support-playbooks/    → workflows
09-support-prompts/      → reusable prompts
10-support-examples/     → end-to-end samples
11-shared-glossary/     → shared language
12-process-delivery/     → delivery, release, deployment, hotfix, rollback
13-process-operations/   → incident, monitoring, alerting, RCA, on-call
14-records-history/      → historical CR, deployment, bug, and incident records
```

### 3.1 Prefix Meaning

- `rules-*`:
  stable rules and constraints that guide how documentation and implementation should be produced
- `spec-*`:
  software-definition artifacts that describe the product, behavior, contracts, and tests
- `support-*`:
  helper material used to generate, explain, reuse, or operationalize the specs
- `shared-*`:
  shared vocabulary and language
- `process-*`:
  delivery and operational workflows around the software, not inside the software definition
- `records-*`:
  historical evidence of real changes, releases, defects, and incidents

---

## 4. Core Artifacts

### 4.1 A1 - Strategic Design

Defines:

* system architecture
* module boundaries
* ownership rules
* dependency direction

📍 Location:

```
01-rules-strategy/a1-strategic-design.md
```

---

### 4.2 A2 - Tactical Design

Defines:

* how to write code
* DI tokens
* providers
* facade / port / query service
* cross-module interaction

📍 Location:

```
02-rules-tactics/a2-tactical-design.md
```

---

### 4.3 BRD (Business Requirement)

Defines:

* business goals
* user problems
* success criteria

📍 Location:

```
03-spec-business/01-business-requirements/
```

---

### 4.4 FRD (Functional Requirement)

Defines:

* features
* validation rules
* user flows
* system behaviors

📍 Location:

```
03-spec-business/02-functional-requirements/
```

---

### 4.5 A4 - Domain Model

Defines:

* aggregate roots
* entities
* value objects
* invariants
* relationships
* persistence assumptions

📍 Location:

```
04-spec-domain-models/
```

---

### 4.6 A3 - API Specification

Defines:

* API behavior
* request/response
* business rules
* process flow
* cross-module interactions

📍 Location:

```
05-spec-api-specs/
```

---

### 4.7 Test Specifications

Defines:

* test cases
* edge cases
* expected outputs
* validation scenarios

📍 Location:

```
06-spec-testing/
```

---

### 4.8 Delivery Process

Defines:

* bug and defect handling
* release and deployment flow
* hotfix rules
* rollback steps
* change governance around software delivery
* change request process

📍 Location:

```
12-process-delivery/
```

---

### 4.9 Operations Process

Defines:

* incident response
* monitoring and alert handling
* on-call expectations
* postmortem and RCA workflow
* maintenance window process

📍 Location:

```
13-process-operations/
```

---

### 4.10 Historical Records

Defines:

* change request history
* deployment history
* confirmed bug history
* incident history
* dated evidence of what actually happened in delivery and operations

📍 Location:

```
14-records-history/
```

---

## 5. How to Use This System with AI

### 5.1 Generating a New Module

Use:

* A1 (structure)
* A2 (coding rules)
* A4 (domain)

```text
Use A1 for architecture.
Use A2 for tactical design.
Use A4 to generate the module.
```

---

### 5.2 Generating an API

Use:

* A3 (API spec)
* A4 (domain)
* A2 (rules)
* A1 (structure)

```text
Use A1 for structure.
Use A2 for coding conventions.
Use A4 as domain model.
Use A3 to generate the API.
```

---

### 5.3 Generating Tests

Use:

* A3 (API)
* A4 (domain)
* FRD (behavior)

```text
Generate test cases based on A3 and FRD.
```

---

### 5.4 Updating Existing Feature

Use:

* existing A3
* existing A4
* new requirement

```text
Update implementation without breaking A1/A2 rules.
```

---

## 6. Standard Workflow

```text
1. Write BRD
2. Write FRD
3. Generate A4 (Domain)
4. Generate A3 (API)
5. Generate Test Specs
6. Generate Code (A1 + A2 + A3 + A4)
7. Run tests
8. Release and deploy through delivery process
9. Operate, monitor, and respond through operations process
10. Record important CR, deployment, bug, and incident history
11. Refine docs if needed
```

---

## 7. File Granularity Rules

### API (A3)

* 1 API = 1 file

Example:

```
create-order.api.yaml
cancel-order.api.yaml
```

---

### Domain (A4)

* 1 domain/module = 1 file (or small group)

Example:

```
order.domain.yaml
workflow.domain.yaml
```

---

### Tests

* 1 API = multiple test files

Example:

```
create-order.unit-test.yaml
create-order.integration-test.yaml
```

---

## 8. Design Principles

### 8.1 Single Source of Truth

* A4 is the source of truth for data
* A3 must not redefine domain logic

---

### 8.2 No Repository Leakage

* modules interact via:

  * facade
  * port
  * query service

---

### 8.3 Explicit > Implicit

* never rely on AI guessing behavior
* always define rules clearly

---

### 8.4 Separation of Concerns

| Layer | Responsibility |
| ----- | -------------- |
| BRD   | why            |
| FRD   | what           |
| A4    | data           |
| A3    | behavior       |
| Test  | verify         |
| A2    | how            |
| A1    | structure      |

---

## 9. AI Prompting Guidelines

### Always include:

* A1 (implicitly)
* A2 (implicitly)
* A3 (explicit)
* A4 (explicit)

---

### Recommended Prompt Pattern

```text
Use A1 for architecture.
Use A2 for tactical rules.
Use A4 as domain model.
Use A3 as API spec.

Generate implementation.
```

---

## 10. Common Mistakes

### ❌ Missing A4

→ wrong data model

### ❌ Missing A3

→ AI guesses API logic

### ❌ Mixing modules

→ boundary broken

### ❌ Exposing repository across modules

→ tight coupling

---

## 11. Scaling Strategy

### Small project

* minimal structure
* few A3/A4 files

### Medium project

* separate modules
* multiple A3 per module

### Large system (recommended)

* full structure
* strict governance
* playbooks + templates

---

## 12. End-to-End Example

Each feature should map like this:

```text
BRD → order-management.brd.md
FRD → create-order.feature.md
A4  → order.domain.yaml
A3  → create-order.api.yaml
TEST→ create-order.test.yaml
CODE→ generated
```

---

## 13. Final Summary

This system transforms development into:

```text
Documentation → AI → Code → Test → Feedback → Improve
```

It enables:

* consistent architecture
* faster development
* better code quality
* scalable team collaboration

---

## 14. Key Principle

```text
Do not write code first.
Write structured knowledge first.
Let AI generate the code.
```

---
