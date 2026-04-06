---
name: 101. Initialize Project Foundation
description: Fast-track macro agent to initialize all 9 system architecture foundation files strictly following templates.
---

> [!CAUTION]
> **ZERO-HALLUCINATION PROTOCOL (STRICT MANDATE)**
> You are ABSOLUTELY FORBIDDEN from improvising structure, file-paths, or format. You MUST operate sequentially according to the Algorithmic Instructions below.

> [!CAUTION]
> **FATAL ERROR PROTOCOL (STRICT MANDATE)**
> If you attempt to use `view_file` or `list_dir` on ANY of the paths listed in these instructions and receive a "File not found" or identical error, you must **IMMEDIATELY ABORT THE ENTIRE WORKFLOW**. Do not attempt to guess, skip, or infer the contents. Report the exact broken path to the user and yield control.

# OVERVIEW
You are the Foundation Construction Macro-Agent (101). Your sole objective is to scaffold the 9 foundational architecture files of the target system in one single execution loop.

# [STEP 1] KNOWLEDGE INGESTION (MANDATORY)
**Tool to use:** `view_file` (DO NOT skip this step. You must run the tool sequentially to load the following files into your context).

1. Read Prompt Directive:
   - `view_file(.agents/00-system-rules/02-prompt-templates/skill-02-project-foundation.md)`

2. Read Strict Structural Templates:
   - `view_file(.agents/00-system-rules/04-artifact-templates/00-project-foundation/01-business-and-constraints.md)`
   - `view_file(.agents/00-system-rules/04-artifact-templates/00-project-foundation/02-architecture-patterns.md)`
   - `view_file(.agents/00-system-rules/04-artifact-templates/00-project-foundation/03-technology-stack.md)`
   - `view_file(.agents/00-system-rules/04-artifact-templates/00-project-foundation/04-project-structure-and-conventions.md)`
   - `view_file(.agents/00-system-rules/04-artifact-templates/00-project-foundation/05-infrastructure-and-cicd.md)`
   - `view_file(.agents/00-system-rules/04-artifact-templates/00-project-foundation/06-networking-and-security.md)`
   - `view_file(.agents/00-system-rules/04-artifact-templates/00-project-foundation/07-cost-management.md)`
   - `view_file(.agents/00-system-rules/04-artifact-templates/00-project-foundation/08-design-system-and-ui.md)`
   - `view_file(.agents/00-system-rules/04-artifact-templates/00-project-foundation/09-observability-and-monitoring.md)`

# [STEP 2] INPUT VALIDATION
1. Identify the target project you are initializing. If the user provided no context, default to initializing the `_system` core definitions.

# [STEP 3] EXECUTION: FOUNDATION GENERATION (DEEP ITERATION PROTOCOL)
**Tool to use:** `write_to_file`
**Target Path:** `docs/03-artifacts-draft/_system/00-project-foundation/{filename}.md`
**Constraint:** Use the `write_to_file` tool. DO NOT use bash `cat` or `echo` commands.

> [!CAUTION]
> **DEEP ITERATION PROTOCOL (MANDATORY)**
> - You are STRICTLY FORBIDDEN from generating multiple files in parallel.
> - You MUST execute exactly ONE `write_to_file` call per file.
> - You MUST maximize tokens and thought depth for each file. Provide exhaustive detail, address all edge cases, and ensure no placeholders remain. Truncation or brief summaries are considered fatal errors.
> - Call `write_to_file` for file #1. Await completion. Proceed to file #2. Repeat sequentially.

**Files to generate sequentially:**
Generate the 9 files out exactly following the format you read in Step 1.2, strictly one by one.
*Each generated file MUST contain the exact YAML frontmatter (document_type, version, status: draft) as mandated by the templates.*

# [STEP 4] POST-FLIGHT: IDEMPOTENCY LOCK
**Tool to use:** `write_to_file`
**Target Path:** `docs/03-artifacts-draft/_system/.snapshots/state-lock.yaml`
**Action:** Update or create the state-lock file. Write the key `idempotency_lock: _system:` and note the `completed_skills: ["101"]` alongside a generated ISO timestamp.
