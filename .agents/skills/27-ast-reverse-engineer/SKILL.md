---
name: 27. AST Reverse Engineer
description: The core Reverse Ingestion Agent. Takes the Human's mapping file, consumes pure physical Code AST, and reconstructs semantic architectural YAMLs directly into the Production Knowledge Base.
---

# 🧬 AST Reverse Engineer

## 1. Interactive Parameter Resolution (Target-Node Interlock)
When this Skill is invoked, you **MUST** require the user to provide a specific `--target_node` parameter (e.g., `src/controllers/payment.ts` or `POST /auth/login`).
If the user doesn't provide it, you must pause and ask them to pick an unchecked target from the Coverage Tracker.

## 2. Configuration Routing
Once parameters are resolved, dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-27-ast-reverse-engineer.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template to process the isolated target.
