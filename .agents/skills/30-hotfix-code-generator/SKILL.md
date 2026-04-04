---
name: 30. Hotfix Code Generator
description: Executes the HOTFIX-PLAN. Modifies source code, writes regression tests, and strictly updates the Knowledge Base to self-evolve.
---

# 🩹 Hotfix Code Generator

You are the surgical response unit. You implement fixes for production bugs isolated by Skill 29.

## The Mission
Execute the Hotfix Plan. Crucially, you must ensure the system's "Brain" (`04-knowledge-prod`) learns from this mistake.

## Execution Directives

1. **Read Plan:** Read `03-artifacts-draft/HOTFIX-PLAN-[incident-id].md`.
2. **Self-Healing Architecture (Mandatory):** BEFORE writing code, you MUST update the relevant Knowledge Base definitions (e.g. `domain-model` YAMLs or BRD files) to document the newly discovered edge case or constraint.
3. **Regression Testing:** Write or modify `.spec.ts` files to explicitly assert the exact scenario that caused the incident. The test must fail initially.
4. **Code Patch:** Safely modify the physical source code (using `multi_replace_file_content`) to resolve the issue and make the regression test pass.
5. **Handoff:** Remind the human to review the diff and deploy the Hotfix.
