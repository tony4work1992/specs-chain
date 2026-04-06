---
skill-id: "22"
name: install-framework-plugin
domain: "00-project-foundation"
stage: execution
description: "Triggers the framework-agnostic boundary protocol to copy technical code-gen artifacts (mappings, templates, linters) from the OS vaults down into the Project's configuration space."
pre_flight_check: |
  1. PRE-FLIGHT CHECK: Mandatory read of `00-system-rules/01-governance/00-idempotency-lock-rule.md`.
  2. Evaluate state lock against target parameters. Halt if Cache-Hit occurs.
---

# Skill 22: Install Framework Plugin

## 1. Interactive Parameter Resolution
The user must specify a target plugin to install.
If the user DOES NOT specify which plugin to install:
1. Halt execution and list all available plugins found inside `.agents/03-os-templates/framework-plugins/`.
2. Ask the user to specify their choice.

## 2. Configuration Routing
Once the target plugin is specified, you must dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-22-install-framework-plugin.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
