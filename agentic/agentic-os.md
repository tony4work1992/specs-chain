# Agentic OS: Hybrid Domain-Driven Knowledge Pipeline

> **Do not write code first. Write structured knowledge first. Let AI generate the code.**

This document is the master blueprint for the `agentic/` directory — a hybrid architecture that fuses **Domain-Driven Design** (DDD) taxonomy with an **Agentic Operating System** (Agentic OS) pipeline. It is purpose-built for both human engineers and autonomous AI Agents to collaborate at maximum efficiency.

---

## 1. Core Philosophy

### 1.1 The Pipeline Principle

The entire folder structure mirrors a **left-to-right data pipeline**. Reading the folders from top to bottom reveals the exact lifecycle of every feature:

```
Config → Input → Engine → Draft → Knowledge → Support → Archive
  00       01       02       03       04          05       06
```

### 1.2 The Layered Model

Every artifact in this system belongs to exactly one responsibility layer:

```
WHY       → Business Requirement (BRD)
WHAT      → Functional Requirement (FRD)
DATA      → Domain Model (A4)
BEHAVIOR  → API Specification (A3)
VERIFY    → Test Specifications
BUILD     → Architecture + Code Generation (A1 + A2)
```

Each layer has a clear boundary. Layers must not overlap.

### 1.3 The Draft vs Production Rule

> **Artifacts (`03-artifacts-draft`) are DRAFTS. Knowledge (`04-knowledge-prod`) is PRODUCTION.**

- Drafts are iterative, messy, and human-owned. AI Agents must never use them as source-of-truth context.
- Knowledge is clean, decomposed, indexed, and AI-owned. AI Agents read exclusively from here.
- Promotion from Draft → Production only happens when a human explicitly triggers **Skill 19: Knowledge Sync**.

### 1.4 The Registry Rule

> **Whenever the system adds, modifies, or deletes a Domain, Layer, or Skill, the AI Agent MUST update `agentic/00-system-rules/_index/os-registry.yaml` FIRST.**

This central YAML file serves as the system's runtime self-awareness database. Without this, the AI will suffer from "blind spots" during cross-referencing and drift out of alignment with the true file structure.

### 1.5 The Explicit Audit Snapshot Rule

When an Auditor Skill (e.g. 02, 05, 07) detects holes and receives human input:
> **The original Artifact MUST remain pure. The Auditor MUST save an independent Audit Log within the `.snapshots/` folder documenting its execution trace, and explicitly store the Pre-Patch baseline alongside its Audit Summary.**

### 1.6 The Execution Chronicle Rule

Hệ thống Agentic OS được trang bị cơ chế Giám sát Vận hành (Observability) khép kín. Bất luận là chu trình Tự động (Autonomous) hay Kích hoạt chéo (Manual), các AI Agent đều bị ép buộc tuân thủ quy trình Ghi Sổ Kép (Double-Logging):
> 1. **Global Mastery Log:** Lưu vết tập trung mọi thao tác trên toàn Hệ Sinh Thái để phục vụ đo lường KPI Đội ngũ AI (`master-execution.csv`).
> 2. **Project History Log:** Bám sát từng Delivery Request để cung cấp Audit Trail minh bạch cho đội ngũ Phát triển (`HISTORY-{request}.csv`).

---

## 2. Folder Structure

```
agentic/
├── 00-system-rules/               ⚙️  Immutable system configuration
│   ├── 01-architecture-tactics/    Architectural and tactical ground rules
│   ├── 02-prompt-templates/        LLM prompt templates for each Skill
│   ├── 03-system-mappings/         Source mapping instructions per Skill
│   │   └── 00-common/             Shared conventions (prefixes, versioning)
│   └── 04-artifact-templates/      Output templates for each workflow
│       ├── 01-requirement-development/
│       ├── 02-technical-requirement/
│       ├── 03-testing-requirement/
│       └── 04-software-architecture/
│
├── 01-delivery-requests/           📥  Backlog — "What do we build?"
│   ├── _trackers/                  ✅  Dashboards Tracking Skill executions
│   └── {request-code}-{feature-slug}.md
│
├── 02-execution-workflows/         🏭  The Agentic Engine (Skill pipeline)
│   └── agentic-os.md              Pipeline definition, protocols, registry
│
├── 03-artifacts-draft/             📝  Human workspace — iterative drafts
│   └── ${request-code}/
│       ├── 00-project-foundation/  Architecture baseline & constraints
│       ├── 01-business-layer/      BRD, End User Req, Info Collection
│       ├── 02-technical-layer/     FRD, System Context, Func Specs
│       ├── 03-testing-layer/       Test Scope, Impact, Cases, Steps
│       ├── 04-architecture-layer/  UI, Strategic, Tactic, Flow Sequence
│       └── .snapshots/            Version history (hidden from AI search)
│
├── 04-knowledge-prod/              🧠  AI workspace — production truth
│   ├── _index/                    O(1) lookup engine for AI Agents
│   │   ├── manifest.yaml          Entry point: landscape + registry
│   │   ├── by-domain.yaml         Domain-scoped file mapping
│   │   ├── by-feature.yaml        Feature-scoped file mapping
│   │   └── by-keyword.yaml        Semantic keyword → file mapping
│   ├── domain-business/           WHY & WHAT knowledge
│   │   └── ${feature}/
│   ├── domain-technical/          HOW knowledge
│   │   └── ${feature}/
│   ├── domain-model/              CORE structures, entities, invariants
│   │   └── ${feature}/
│   ├── domain-architecture/       STRUCTURE knowledge
│   │   └── ${feature}/
│   └── domain-testing/            VERIFY knowledge
│       └── ${feature}/
│
├── 05-support-assets/              🧰  Tools, test data, and helpers
│   └── test-data-mocks/
│
└── 06-records-history/             🗄️  Historical evidence archive
    ├── deployments/
    │   └── year-${YYYY}/
    └── bugs-incidents/
```

---

## 3. Folder Purposes (Detailed)

### `00-system-rules/` — Immutable Configuration

Contains all stable rules and constraints that do **not** grow with business scope. These files govern how every downstream artifact is generated.

| Subfolder | Purpose | Grows with features? |
|---|---|---|
| `01-architecture-tactics/` | A1 (Strategic) + A2 (Tactical) design rules | No |
| `02-prompt-templates/` | LLM persona + generation instructions per Skill | Rarely |
| `03-system-mappings/` | Input/Output file mapping instructions per Skill | Rarely |
| `04-artifact-templates/` | Structural templates for every artifact type | No |

**AI Agent behavior:** Read these files to understand generation rules before producing any output. These are the "constitution" of the system.

---

### `01-delivery-requests/` — Pipeline Input

The genesis point. Each file here is a **feature request** or **operational request** that triggers the entire Agentic OS pipeline.

**Naming convention:** `${request-code}-${feature-slug}.md`
**Example:** `FEA-{request-code}-{feature-slug}.md` or `SYS-{request-code}-foundation.md`

#### Execution Dashboards
Inside `01-delivery-requests/_trackers/`, every active pipeline request has a `TRACKER-{request-code}.md` file. 
**Agent Behavior:** At the end of ANY skill execution, you MUST check off your corresponding task on this tracker to preserve Operator visibility.

**AI Agent behavior:** Read a delivery request to understand the raw user intent. This is the seed that flows through Skills 01–18.
> **Skill 00 (Front Door):** Use `.agents/skills/00-delivery-request-generation/SKILL.md` to automatically generate Request files and Trackers interactively.

---

### `02-execution-workflows/` — The Agentic Engine

Contains the pipeline definition, execution protocols, and the Skill registry. This is the "operating system" itself — the rules for how Skills chain together.

**AI Agent behavior:** Reference this folder to understand which Skill to execute next, what inputs it needs, and where to write outputs.

---

### `03-artifacts-draft/` — Human Workspace (DRAFT)

The working area for iterative artifact generation. Organized by request code, then by layer:

| Layer | Skills | Key Artifacts |
|---|---|---|
| `00-project-foundation` | Skill F1 | 9 System Foundation Architecture files |
| `01-business-layer` | Skill 01, 02, 03 | End User Requirement, Information Collection, BRD |
| `02-technical-layer` | Skill 04, 05, 06, 07, 08 | System Context, FRD, Function Specifications |
| `03-testing-layer` | Skill 09, 10, 11, 12, 13 | Test Scope, Impact, Checklist, Cases, Steps |
| `04-architecture-layer` | Skill 15, 16, 17, 18 | UI Architecture, Strategic, Tactic, Flow Sequence |

**Version history:** Previous versions are stored in `.snapshots/` (hidden directory). The dot-prefix ensures AI search tools automatically ignore these stale files, preventing hallucination from outdated data.

**AI Agent behavior:** Write generated artifacts here. Never read from here for context — always read from `04-knowledge-prod/`.

---

### `04-knowledge-prod/` — AI Workspace (PRODUCTION)

The single source of truth for all AI Agent queries. Contains granular, decomposed knowledge files organized by domain.

#### The `_index/` Engine

The `_index/` directory is the AI Agent's **lookup accelerator**. Instead of scanning the entire file tree, an Agent reads index files first for O(1) targeted retrieval:

```
Agent reads manifest.yaml     → Understands the landscape
Agent reads by-domain.yaml    → "Order" → 19 file paths
Agent reads by-keyword.yaml   → "cache invalidation" → 6 files
Agent reads ONLY targeted files → Full context, zero noise
```

| Index File | Purpose | When to Read |
|---|---|---|
| `manifest.yaml` | Feature registry, folder map, document count | Always (entry point) |
| `by-domain.yaml` | Domain-scoped file paths | Impact analysis, scoping |
| `by-feature.yaml` | Feature-scoped file lookup | Feature-specific tasks |
| `by-keyword.yaml` | Semantic keyword → file mapping | Search, cross-referencing |

#### Domain Organization

Knowledge files are organized by **domain** (from the DDD taxonomy), not by document type:

| Domain Folder | Content | Knowledge Categories |
|---|---|---|
| `domain-business/` | WHY & WHAT | End User Req, Info Collection, BRD |
| `domain-technical/` | HOW | System Context, FRD, Function Specs, ASI, AFI |
| `domain-model/` | CORE | Entities, Invariants, Queries |
| `domain-architecture/` | STRUCTURE | Foundation Maps, UI, C4 Strategic, Tactic Slices, Flow Sequences |
| `domain-testing/` | VERIFY | Test Scope, Impact, Checklist, Cases, Steps |

Within each domain, files are grouped by feature: `domain-business/{feature-slug}/`, `domain-technical/{feature-slug}/`, etc.

**Foundation vs Feature Routing exception:**
- **System Tasks (`SYS-*`)**: Base template rules defined by the SA are routed explicitly to `04-knowledge-prod/domain-architecture/_system/[pillar]`.
- **Feature Tasks (`FEA-*`)**: Outputs generated by AI are routed to their isolated feature subfolders (e.g. `domain-business/{feature-slug}/`).

**AI Agent behavior:** Always read `_index/` first, then fetch only the targeted knowledge files needed for the current task.

---

### `05-support-assets/` — Tools & Helpers

Contains test data mocks, generation examples, glossaries, and other supporting materials that assist but do not define the product.

---

### `06-records-history/` — Historical Archive

Stores dated evidence of real events: deployments, bugs, incidents, and change requests. Completely isolated from active specifications to prevent AI contamination.

**AI Agent behavior:** Only read when explicitly asked about historical events (e.g., "What bugs did we have last month?"). Never read during generation tasks.

---

## 4. Naming Conventions

### Folder Names
- All lowercase, `kebab-case`
- Numbered prefix for pipeline ordering: `00-`, `01-`, `02-`, etc.
- No spaces, no dots, no special characters

### File Names
- All lowercase, `kebab-case`
- Descriptive slugs: `business-requirement-document.md`, not `BRD.md`
- Knowledge files include feature code: `aipd-000002-brd-scope-and-objectives.md`

### Knowledge File Pattern
```
${FEATURE-CODE}-${ARTIFACT-CODE}-${descriptive-slug}.{yaml|md}
```

**Examples:**
```
aipd-000002-brd-business-rules.md
aipd-000002-inf-000001-fiscal-calendar-boundaries.yaml
aipd-000002-cas-000003-redis-oom-failover.yaml
aipd-000002-slice-01-export-module.yaml
```

### File Formats
- **YAML** (`.yaml`): All structured data (specs, test cases, configs, indexes)
- **Markdown** (`.md`): All narrative documents (requirements, architecture, flows)
- **No JSON**: YAML is preferred over JSON for human readability and lower token cost

---

## 5. AI Agent Query Protocol

When an AI Agent needs context to perform any task, it follows this exact sequence:

```
Step 1: READ  00-system-rules/         → Load generation rules (constitution)
Step 2: READ  01-delivery-requests/    → Understand what to build (input)
Step 3: READ  04-knowledge-prod/_index/ → Load the knowledge map
Step 4: READ  targeted knowledge files  → Fetch only what's needed
Step 5: WRITE 03-artifacts-draft/       → Generate artifact (draft output)
Step 6: NEVER read from 03-artifacts-draft/ for context
```

### Impact Analysis Flow (Detailed)

```
1. Agent reads _index/manifest.yaml          → Feature landscape (5KB)
2. Agent reads _index/by-domain.yaml         → "Redis Cache" → 19 file paths
3. Agent reads _index/by-keyword.yaml        → "cache invalidation" → 6 more files
4. Agent reads ONLY 25 targeted files         → Full impact context
5. Agent executes task with production-grade knowledge awareness
```

---

## 6. Project Initialization Workflow (Foundation)

Before building features, the System Architecture must be established so downstream AI Agents are not flying blind.

**Step 1:** Trigger Skill 00 from `.agents/skills/00-delivery-request-generation/SKILL.md`. The AI will ask for your inputs and bootstrap the Dashboard and Request files.
**Step 2:** Open `.agents/skills/f1-project-foundation-generation/SKILL.md` and trigger Skill F1. Answer the chat interview.
**Step 3:** The AI outputs 9 system drafts into `03-artifacts-draft/{request-code}/00-project-foundation/`.
**Step 4:** Trigger Skill 19 (`knowledge-sync`) to push the drafts to `04-knowledge-prod/domain-architecture/_system/`.

For a dedicated guide, refer to: `.agents/workflows/01-init-foundation.md`

---

## 7. Skill Pipeline (The State Machine)

The Agentic OS is driven by an autonomous **Orchestrator State Machine**. The exact states, loops, and routing logic are defined in `02-execution-workflows/scaffolding/feature-scaffold-blueprint.yaml`.

Do not assume a linear execution order. The Orchestrator engine evaluates conditional boundaries (e.g. `If Fail -> Wait for User -> Auditor captures Pre-Patch Snapshot -> Auditor updates Base Artifact -> Loop back to Validate`).
Reference the `execution-workflow` block inside the blueprint YAML to understand the precise lifecycle.

---

## 7. Knowledge Sync (Skill 19)

Skill 19 is the deliberate, user-triggered promotion gate between Draft and Production.

### Why Not Automatic?
- Artifacts are iterative drafts — they may contain errors or placeholders
- Knowledge is the AI's source of truth — only approved content belongs here
- The human decides when artifacts are ready for promotion

### What Skill 19 Does
1. Scans all artifacts under `03-artifacts-draft/${request-code}/`
2. Decomposes each artifact into granular knowledge files (1 API = 1 file, 1 test case = 1 file)
3. Applies naming convention: `${feature-code}-${artifact-code}-${slug}.{yaml|md}`
4. Writes files to `04-knowledge-prod/domain-*/` organized by domain
5. Updates all `04-knowledge-prod/_index/` files (manifest, domain, feature, keyword)
6. Verifies file count and searchability

### Decomposition Strategy

| Skill Source | Knowledge Domain | Strategy |
|---|---|---|
| Skill F1 (Foundation) | `domain-architecture/` | 9 System Architecture files mapping |
| Skill 01 (End User Req) | `domain-business/` | 1 file (whole document) |
| Skill 02 (Info Collection) | `domain-business/` | Each YAML array item → 1 file |
| Skill 03 (BRD) | `domain-business/` | Split by section → 4 files |
| Skill 04 (System Context) | `domain-technical/` | Split by section → 5 files |
| Skill 06 (FRD) | `domain-technical/` | Split by section → 4 files |
| Skill 08 (Func Specs) | `domain-technical/` | 2 files (YAML + MD) |
| Skill 12 (Test Cases) | `domain-testing/` | Each test case → 1 file |
| Skill 15 (UI Arch) | `domain-architecture/` | Split by Atomic level → 5 files |
| Skill 16 (Strategic Arch) | `domain-architecture/` | Split by C4 level → 2 files |
| Skill 17 (Tactic Arch) | `domain-architecture/` | Each Vertical Slice → 1 file |
| Skill 18 (Flow Sequence) | `domain-architecture/` | Each Mermaid diagram → 1 file |

---

## 8. Execution Protocols

The Engine strictly follows two execution modes defined in the Blueprint:

### Protocol A: Autonomous Loop (State Machine)

```text
1. READ 01-delivery-requests/
2. READ feature-scaffold-blueprint.yaml
3. ENTER internal loop (Generate -> Validate -> Wait & Patch -> Finalize)
   - If a Validation Skill (e.g. 02, 05, 07) fails, HALT.
   - Wait for User Input.
   - Backup active draft into `.snapshots/`.
   - The Auditor Skill triggers the **Self-Reflecting Patch** (captures Pre-Patch snapshot, writes Audit Summary log to the snapshot, and patches the pure baseline Document).
   - Return to Validation.
4. PRODUCE exactly 18 standard artifacts in `03-artifacts-draft/`
```

### Protocol B: Manual Sequential

```text
1. FORBID State Machine feedback loops.
2. FORCE execution of Skills numerically from 01 to 18 sequentially.
3. Designed for batch testing or manual override pipeline modes.
```

### Protocol C: Knowledge Sync (Skill 19 — User-Triggered)

```text
1. RECEIVE request code from user.
2. READ 00-system-rules/03-system-mappings/skill-19-knowledge-sync.yaml
3. SCAN all artifacts under 03-artifacts-draft/${request-code}/
4. DECOMPOSE each artifact into granular knowledge files
5. WRITE to 04-knowledge-prod/domain-*/${feature}/
6. UPDATE 04-knowledge-prod/_index/ (manifest, domain, feature, keyword)
7. VERIFY file count and searchability
8. REPORT completion with stats
```

---

## 9. Design Principles

### 9.1 Single Source of Truth
- `04-knowledge-prod/` is the ONLY source of truth for AI context
- `03-artifacts-draft/` is NEVER used as context input

### 9.2 Token Efficiency
- All names are `kebab-case` — minimal tokenizer fragmentation
- YAML over JSON — fewer brackets, lower token cost
- `.snapshots/` uses dot-prefix — invisible to AI file search tools
- `_index/` enables O(1) lookup — no full directory scanning

### 9.3 Domain-Driven Organization
- Knowledge is organized by **domain** (business, technical, architecture, testing)
- Within each domain, files are grouped by **feature**
- This enables both index-based lookup AND folder-based fallback

### 9.4 Noise Isolation
- Historical records are quarantined in `06-records-history/`
- Draft snapshots are hidden in `.snapshots/`
- AI Agents never encounter stale data during generation tasks

### 9.5 Explicit > Implicit
- Never rely on AI guessing behavior
- Always define rules clearly in `00-system-rules/`
- Every Skill has a mapping file, a prompt template, and an artifact template

---

## 10. Scaling Strategy

### Adding a New Feature
1. Create a delivery request in `01-delivery-requests/`
2. Run Skills 01–18 to generate artifacts in `03-artifacts-draft/${new-request}/`
3. Review and iterate
4. Trigger Skill 19 to sync to `04-knowledge-prod/domain-*/${new-feature}/`

### Adding a New Domain
1. Create `04-knowledge-prod/domain-${name}/` folder
2. Update `_index/by-domain.yaml` with the new domain entry
3. Update Skill 19 mapping table

### Growing the Team
- Each AI Agent role reads only its relevant domain:
  - **Product Owner Agent** → `domain-business/`
  - **Architect Agent** → `domain-architecture/`
  - **Developer Agent** → `domain-technical/`
  - **QA Agent** → `domain-testing/`
- Agents never step on each other's territory

---

## 11. Quick Reference Card

| I want to... | Go to... |
|---|---|
| Understand the system rules | `00-system-rules/` |
| See what features are requested | `01-delivery-requests/` |
| Understand the Skill pipeline | `02-execution-workflows/` |
| Read/write draft artifacts | `03-artifacts-draft/` |
| Query production knowledge (AI) | `04-knowledge-prod/_index/` → targeted files |
| Find test data or helpers | `05-support-assets/` |
| Audit past deployments or bugs | `06-records-history/` |
