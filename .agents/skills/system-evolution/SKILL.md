---
name: Agentic OS upgrade
description: 99. Meta-Skill - Perform structural upgrades, add new Skills, or modify the OS architecture safely.
---

> [!CAUTION]
> **PRE-FLIGHT CHECK (MANDATORY IDEMPOTENCY)**
> Before generating any Output, you MUST read `.agents/00-system-rules/01-governance/00-idempotency-lock-rule.md` and evaluate the Hash Lock. If the source hash hasn't changed, YOU MUST HALT and skip LLM generation.


# 99. Agentic OS System Evolution

## 1. Interactive Parameter Resolution
The user can optionally provide the nature of the OS upgrade (e.g. "Add a new skill"). If not specified, ask what system modification is required.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-99-system-evolution.yaml`

Load the `prompt` and strictly follow the Symmetrical Execution Protocol provided within the Template.

