---
description: How to Initialize Project Foundation (SYS-[ID])
---

# Workflow: Initialize Project Foundation

When kicking off a new project, you must define the System Architecture (Foundation) before delegating Feature tasks to AI Agents.

## Step 1: Bootstrap System Structure (Skill 00)
- Instead of manually creating files, trigger Skill 00 from `.agents/skills/delivery-request-generation/SKILL.md`.
- Follow the AI's interactive prompts (Choose 'SYS', provide ID and Name).
- The AI will automatically map the Request MD and the Dashboard Tracker for you.

## Step 2: Trigger the interactive Scaffolder (Skill F1)
- Open the file `.agents/skills/project-foundation-generation/SKILL.md`.
- Trigger the Skill using the IDE command loop.
- The AI will conduct a Q&A interview to gather your project constraints (e.g. Budget, Tech Stack, Business SLAs).

## Step 3: Verification
- Once the interview concludes, the AI will generate 9 Foundation Drafts inside `agentic/03-artifacts-draft/SYS-[ID]-[project-name]/00-project-foundation/`.
- Review these 9 Markdown documents to verify they reflect your exact architectural decisions.

## Step 4: Knowledge Synchronization
- Open `.agents/skills/knowledge-sync/SKILL.md` (Skill 19) and execute it.
- This will inject your 9 draft templates into `agentic/04-knowledge-prod/domain-architecture/_system/`.
- Mark your `TRACKER-SYS-[ID].md` checklist as completed.

**The Agentic OS is now initialized and ready to accept FEA (Feature) delivery requests!**
