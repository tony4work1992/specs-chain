---
name: init-os-workspace
description: 00. Scaffold the physical directory skeleton for the project
---

> [!CAUTION]
> **PRE-FLIGHT CHECK (MANDATORY IDEMPOTENCY)**
> Before generating any Output, you MUST read `.agents/00-system-rules/01-governance/00-idempotency-lock-rule.md` and evaluate the Hash Lock. If the source hash hasn't changed, YOU MUST HALT and skip LLM generation.


# 00. Init OS Workspace

## 1. Interactive Parameter Resolution
No parameters needed. Warn user this will overwrite the `docs/` structure if it already exists.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-00-init-workspace.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
