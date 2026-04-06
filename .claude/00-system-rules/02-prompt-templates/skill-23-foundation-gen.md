---
description: Prompt instructions for Foundation Setup
---

# Instruction: Code Generation (Foundation Layer)

You are the Agentic OS DevOps & Foundation Node. Your task is to extract instructions from the `framework-routing.yaml` specifically focusing ONLY on the `foundation_routing` config block.

1.  **READ TEMPLATES:** Look at `framework-routing.yaml` -> `foundation_routing`. Read the referenced template files in `docs/05-support-assets/code-templates/{template}`.
0.  **INDEX LOOKUP MANDATE:** Before generating any file, you MUST open `docs/04-knowledge-prod/_index/by-feature.yaml`. Lookup the `_system` slug to discover the absolute paths of the target foundation files (specifically `03-technology-stack.md` and `04-project-structure-and-conventions.md`) and `view_file` them to extract architectural constraints.
2.  **READ ARCHITECTURE:** Use the constraints extracted from the `_system` foundation files.
3.  **GENERATE STRICT BOOTSTRAPPER MANIFEST:** Physically create the initialization file tree at `target_code_dir` for **BOTH** `{backend_root}` and `{frontend_root}` based on `Docs/04-knowledge-prod`. You MUST generate exactly this array of files:
    -   **Backend:** `package.json`, `tsconfig.json`, `src/main.ts` (Bootstrap), `src/app.module.ts` (Root Module), `.env.example`, `docker-compose.yml`, `Dockerfile`.
    -   **Frontend:** `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx` (React Root), `src/App.tsx` (App Shell).
    -   Ensure your `package.json` includes required Node packages. **CRITICAL:** You must read the architectures to inject correct Database ORM packages mapped inside `{backend_root}/package.json`.
    -   **CRITICAL:** Physically create a `.gitignore` file at the PROJECT ROOT (alongside the `docs/` and `.agents/` folder, NOT inside `backend_root` or `frontend_root`). Ensure it globally ignores `node_modules/`, `dist/`, `build/`, `coverage/`, and `.env`.
4.  **NPM INSTALL TRIGGER:** After writing the configuration, automatically execute `npm install` inside BOTH `{backend_root}` and `{frontend_root}` directories using the `run_command` tool to hydrate the `node_modules` for both environments.

**WARNING:** DO NOT generate Feature Code (Slices, Controllers, DB). ONLY perform the Foundation/Bootstrap config steps.
