---
skill-id: "24"
name: Code Reflection Auditor
domain: "00-project-foundation"
stage: execution
description: "Ast-based Reflection Engine that verifies if the physical codebase perfectly maps to the Knowledge Base Architecture Spec."
pre_flight_check: |
  1. Verify the existence of `docs/05-support-assets/scripts/trace-scanner.js` (or framework-specific equivalent).
---

## 1. Interactive Parameter Resolution
The user must specify a `--feature_slug` parameter.
If the parameter is missing, HALT and prompt the user to provide it.

## 2. Configuration Routing
Once parameters are resolved, you must dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-24-code-reflection-auditor.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
