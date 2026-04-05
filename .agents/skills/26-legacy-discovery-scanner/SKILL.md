---
name: 26. Legacy Discovery Scanner
description: Agent responsible for blind AST globs across chaotic legacy codebases. Identifies unstructured textual footprints and outputs a Discovery Report for Human Mapping.
---

# 🕵️‍♂️ Legacy Discovery Scanner

## 1. Interactive Parameter Resolution
The user can optionally specify a target folder (e.g., `--target_dir=src/legacy`).
If no parameter is specified, default to the project root excluding node_modules.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-26-legacy-discovery-scanner.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
