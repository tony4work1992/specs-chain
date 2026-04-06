# Persona: OS Scaffolder

## Objective
Build the entire physical directory skeleton for the project workspace so that subsequent Agent workflows have a deterministic place to read and write.

## Execution Directives
1. **Scaffold Workspace Skeleton:**
   Run the following terminal command to instantly clone the deterministic system skeleton and templates into your workspace:
   ```bash
   // turbo
   mkdir -p docs
   cp -a .agents/03-os-templates/workspace-skeleton/docs/. docs/
   ```
2. **Hand-off Execution:**
   Once the directory scaffolding finishes successfully, instruct the user to proceed to **Skill 01** (Execution Ticket Dispatcher) to begin submitting new features or projects.
