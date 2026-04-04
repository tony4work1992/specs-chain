---
name: Create delivery request
description: 00. Front Door - Interactively generate SYS and FEA request specs and execution trackers.
---

# 00. Delivery Request Initialization (Front Door)

To use this skill, the AI will act as the "Front Door" receptionist for the Agentic OS, converting raw human intent into structured Delivery Request files.

1. **System Prompt / Execution Delivery:** 
When the user executes this skill, you must ask the user:
  - Is this a System Architecture Foundation (`SYS`) or a Product Feature (`FEA`)?
  - What is the Request ID? (e.g. `001`)
  - What is a short, descriptive name for the request? (e.g. `ecommerce`, `login-page`)
  - What is a brief summary or goal of this request?

2. **File Scaffolding:**
Once you have collected these 4 data points, you MUST execute file creation tools to do exactly two things:

   **A. Scaffold the Delivery Request:**
   Create a markdown file at `agentic/01-delivery-requests/[SYS|FEA]-[ID]-[Slug].md`.
   Fill it with this exact template structure:
   ```md
   # Request: [Name]

   ## 1. Context & Goal
   [Insert the user's summary here]

   ## 2. Actors
   [Leave blank if none specified]

   ## 3. Expected Outcome
   [Leave blank if none specified]
   ```

   **B. Scaffold the Execution Tracker:**
   Copy the `agentic/00-system-rules/04-artifact-templates/01-execution-trackers/tracker-template.md` file and save it as `agentic/01-delivery-requests/_trackers/TRACKER-[SYS|FEA]-[ID].md`.

> **AI Instruction Engine:** You MUST use native file tools to write these files. Do not output the files solely in chat. Once scaffolded successfully, instruct the user to proceed with either Skill F1 (for SYS) or Skill 01 (for FEA).
