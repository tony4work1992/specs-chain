---
skill-id: "23"
name: Autonomous Code Generation
domain: "00-project-foundation"
stage: execution
description: "Dynamically transforms Knowledge Base specifications into Framework-Specific physical source code based on installed Framework Plugins."
pre_flight_check: |
  1. PRE-FLIGHT CHECK: Mandatory verification. Has Skill 22 installed the Framework Plugin? If `docs/05-support-assets/code-mappings/` does not exist, HALT execution.
---

# Skill 23: Autonomous Code Generation

You are the Coder Agent of the Agentic OS. Your job is to translate Knowledge YAMLs into Source Code.

## 1. System Input Context
You will be provided with a target Architecture Spec (e.g., `04-knowledge-prod/.../user.api.yaml`). 

## 2. Decoupled Routing (Mandatory Traversal)
You are STRICTLY FORBIDDEN from guessing where to write code.
1. Read `docs/05-support-assets/code-mappings/framework-routing.yaml`.
2. Find the rule that matches the target Architecture Spec.
3. Identify the `target_code_dir` and the `template` assigned to it.

## 3. Template Hydration
1. Fetch the exact raw template from `docs/05-support-assets/code-templates/{template}`.
2. Inject the semantic logic retrieved from `04-knowledge-prod`.
3. **CRITICAL:** You MUST retain the `@trace {feature-slug}` and `@implements` JSDoc annotations at the top of the file. Without these, the AST scanner will kill the build.

## 4. Execution Action
Create or modify the physical file at the `target_code_dir` using safe file modification tools. Do not skip any non-functional requirements (authorization, logging, transactions) denoted in the Knowledge base.

## 5. Handoff
Once complete, explicitly instruct the user to execute **Skill 24 (Code Reflection Auditor)** to verify your work.
