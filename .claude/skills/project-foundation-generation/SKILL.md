---
name: project-foundation-generation
description: F1. Trigger interactive Q&A to define and generate the 9 Project Foundation System files.
---

> [!CAUTION]
> **PRE-FLIGHT CHECK (MANDATORY IDEMPOTENCY)**
> Before generating any Output, you MUST read `.agents/00-system-rules/01-governance/00-idempotency-lock-rule.md` and evaluate the Hash Lock. If the source hash hasn't changed, YOU MUST HALT and skip LLM generation.


# 02. Foundation Scaffolding Generation

## 1. Interactive Parameter Resolution
The user can optionally provide the Request Code. If missing, ask for it.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-02-project-foundation.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.

