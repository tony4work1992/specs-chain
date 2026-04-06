---
name: autonomous-test-generation
description: Dynamically reads Knowledge Base Test Specs into Framework-Specific physical test suites (.spec.ts) based on the test_routing mappings.
---

# Skill 25: Autonomous Test Generation

## 1. Interactive Parameter Resolution
The user must specify a `--feature_slug` parameter.
If the parameter is missing, HALT and prompt the user to provide it.

## 2. Configuration Routing
Once parameters are resolved, you must dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-25-autonomous-test-generation.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
