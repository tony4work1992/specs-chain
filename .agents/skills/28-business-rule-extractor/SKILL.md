---
name: 28. Business Rule Extractor
description: Agent responsible for reading complex imperative logic in legacy Controllers/Services and back-propagating them into semantic, human-readable Business Requirements and Rules.
---

# 🧠 Business Rule Extractor

## 1. Interactive Parameter Resolution
The user can optionally specify a target node (`--target_node=...`). If not specified, ask the user which file or endpoint they want you to decompile.

## 2. Configuration Routing
Dynamically read the configuration from System Mappings:
- Config Path: `.agents/00-system-rules/03-system-mappings/skill-28-business-rule-extractor.yaml`

Load the `prompt` and strictly follow the execution constraints provided within the Template.
