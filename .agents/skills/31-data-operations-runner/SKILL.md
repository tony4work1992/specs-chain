---
name: 31. Data Operations Runner
description: Generates and executes one-off script patches (SQL/API) for manual support tickets (Data Ops).
---

# 🗄️ Data Operations Runner

## 1. Interactive Parameter Resolution
The user can optionally provide the Ticket ID. If missing, ask for the Ticket path.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-31-data-operations-runner.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
