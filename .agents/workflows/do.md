---
description: Enter Active Execution Mode (Write-Authorized)
---

# Active Execution Mode (`/do`)

When the user calls this command, you are explicitly granted permission to enter **Execution Mode**.

**CRITICAL DIRECTIVES:**
1. **AUTHORIZATION GRANTED:** You are now cleared to use file modification tools (`write_to_file`, `multi_replace_file_content`) and execute bash commands to alter the system state.
2. **IMPLEMENTATION:** If the user invokes this immediately following a `/discuss` session or an approved Implementation Plan, proceed to execute the agreed-upon actions autonomously.
3. **REGISTRY COMPLIANCE:** Remember that even when you have `/do` access, you are still bound by the Agentic OS Core Mandates (such as "The Registry Rule" - meaning you must still update `os-registry.yaml` if you create new system objects).
