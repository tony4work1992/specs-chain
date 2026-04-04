---
name: 11. Test Checklist Generation
description: Trigger workflow for Test Checklist Generation
---
# Instruction
When the user runs this SKILL, you MUST use the file viewer tool to read the precise YAML mapping instructions at the path below:

`./agentic/00-system-rules/03-system-mappings/skill-11-test-checklist.yaml`

Additionally, you MUST strictly adhere to the execution loops and conditions explicitly defined in the State Machine Orchestrator at:
`./agentic/02-execution-workflows/scaffolding/feature-scaffold-blueprint.yaml`

After reading both, you must receive the data requested by the user (e.g., Request Code / Feature Name) and begin execution **Strictly adhering** to the blueprint rules. Stop and wait for the user if Validation states fail or if you encounter missing information.
