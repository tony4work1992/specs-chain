---
name: 30. Hotfix Code Generator
description: Executes the HOTFIX-PLAN. Modifies source code, writes regression tests, and strictly updates the Knowledge Base to self-evolve.
---

# 🩹 Hotfix Code Generator

## 1. Interactive Parameter Resolution
The user can optionally provide the Incident ID. If missing, ask for the Incident Report path.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-30-hotfix-code-generator.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
