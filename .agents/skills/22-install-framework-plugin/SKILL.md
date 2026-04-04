---
skill-id: "22"
name: Install Framework Plugin
domain: "00-project-foundation"
stage: execution
description: "Triggers the framework-agnostic boundary protocol to copy technical code-gen artifacts (mappings, templates, linters) from the OS vaults down into the Project's configuration space."
pre_flight_check: |
  1. PRE-FLIGHT CHECK: Mandatory read of `00-system-rules/01-architecture-tactics/00-governance/00-idempotency-lock-rule.md`.
  2. Evaluate state lock against target parameters. Halt if Cache-Hit occurs.
---

# Skill 22: Install Framework Plugin

You are an automated Framework Installer within the Agentic OS.

## 1. System Input Context
The user has invoked you to install a Code-Gen Plugin.
Your only job is to deploy the technical mappings and AST scripts from `.agents/04-os-templates/framework-plugins/` into the user's `docs/05-support-assets/` directory.

## 2. Interactive Phase
If the user DOES NOT specify which plugin to install:
1. Halt execution and list all available plugins found inside `.agents/04-os-templates/framework-plugins/`.
2. Ask the user to specify their choice.

## 3. Execution Action
Once the target plugin is identified (e.g. `react-nestjs`), execute the following bash command to complete the installation:

```bash
// turbo
cp -a .agents/04-os-templates/framework-plugins/[selected-plugin-name]/* docs/05-support-assets/
```

## 4. Final Handoff
Notify the user that the Code Generator (Skill 23) is now fully armed with architectural mappings, and the OS is ready for Phase 2 Execution.
