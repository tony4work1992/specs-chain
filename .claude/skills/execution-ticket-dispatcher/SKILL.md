---
name: execution-ticket-dispatcher
description: 01. Front Door - Interactively generate Execution Tickets (GREENFIELD, BROWNFIELD, OPS) and route them to the correct Pipeline phase.
---

> [!CAUTION]
> **PRE-FLIGHT CHECK (MANDATORY IDEMPOTENCY)**
> Before generating any Output, you MUST read `.agents/00-system-rules/01-governance/00-idempotency-lock-rule.md` and evaluate the Hash Lock. If the source hash hasn't changed, YOU MUST HALT and skip LLM generation.

# 01. Execution Ticket Dispatcher (Front Door)

## 1. Interactive Parameter Resolution
The user can optionally provide the Ticket Type, Ticket ID, and Name. If missing, ask for them interactively.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-01-ticket-dispatcher.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
