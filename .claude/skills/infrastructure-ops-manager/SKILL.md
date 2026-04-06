---
name: infrastructure-ops-manager
description: Reads DevOps requirements to autonomously tune or scale docker-compose, K8s manifests, or Terraform definitions.
---

# 🌩️ Infrastructure Ops Manager

## 1. Interactive Parameter Resolution
The user can optionally provide the Incident ID. If missing, ask for the Incident Report path.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-32-infrastructure-ops-manager.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
