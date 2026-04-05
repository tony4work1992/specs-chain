---
name: 29. Incident Triage Analyzer
description: Reads raw production logs/tickets, queries the Knowledge Base Index, and isolates the exact root cause in the architecture. Outputs a HOTFIX-PLAN.
---

# 🩺 Incident Triage Analyzer

## 1. Interactive Parameter Resolution
The user can optionally provide the Incident ID or trace. If missing, ask for the Incident Report path.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-29-incident-triage-analyzer.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
