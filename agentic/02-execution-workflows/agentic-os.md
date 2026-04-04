# Agentic OS: Document Generation & Knowledge Pipeline

This document visualizes the complete end-to-end autonomous documentation pipeline (Agentic OS), illustrating how Agent Skills generate structured artifacts (drafts), and how a dedicated Knowledge Sync skill promotes reviewed artifacts into a production-grade, searchable Knowledge Base.

> **Core Principle:** Artifacts (`005.Artifacts`) are **DRAFTS**. Knowledge (`006.Knowledge`) is **PRODUCTION**. Sync only happens when the user explicitly invokes **Skill 19: Knowledge Sync**.

---

## 1. System Architecture Overview

```mermaid
graph TD
    classDef input fill:#2c3e50,stroke:#34495e,stroke-width:2px,color:#ecf0f1;
    classDef workflow fill:#8e44ad,stroke:#9b59b6,stroke-width:2px,color:#fff;
    classDef artifact fill:#27ae60,stroke:#2ecc71,stroke-width:2px,color:#fff;
    classDef auxiliary fill:#d35400,stroke:#e67e22,stroke-width:2px,color:#fff;
    classDef knowledge fill:#2980b9,stroke:#3498db,stroke-width:2px,color:#fff;
    classDef index fill:#c0392b,stroke:#e74c3c,stroke-width:2px,color:#fff;
    classDef sync fill:#f39c12,stroke:#e67e22,stroke-width:3px,color:#2c3e50;

    Input[("Raw User Request / Context")]:::input

    subgraph "Phase 1: Requirement Development"
        S01[Skill 01: End User Req]:::workflow
        A01(End User Requirement.md):::artifact
        S02[Skill 02: Info Collection]:::workflow
        A02(Information Collection.json):::artifact
        S03[Skill 03: BRD]:::workflow
        A03(Business Req Document.md):::artifact
        Input --> S01 --> A01 --> S02 --> A02 --> S03 --> A03
    end

    subgraph "Phase 2: Technical Requirement"
        S04[Skill 04: System Context]:::workflow
        A04(System Context Info.md):::artifact
        S05[Skill 05: Add System Info]:::workflow
        A05(Additional System Info.json):::artifact
        S06[Skill 06: FRD]:::workflow
        A06(Functional Req Document.md):::artifact
        S07[Skill 07: Add Functional Info]:::workflow
        A07(Additional Functional Info.json):::artifact
        S08[Skill 08: Function Specs]:::workflow
        A08(Function Specifications.json):::artifact
        A03 --> S04 --> A04 --> S05 --> A05 --> S06 --> A06 --> S07 --> A07 --> S08 --> A08
    end

    subgraph "Phase 3: Testing Requirement"
        S09[Skill 09: Test Scope]:::workflow
        A09(Test Scope.json):::artifact
        S10[Skill 10: Test Impact]:::workflow
        A10(Test Impact.json):::artifact
        S11[Skill 11: Test Checklist]:::workflow
        A11(Test Checklist.json):::artifact
        S12[Skill 12: Test Cases]:::workflow
        A12(Test Cases.json):::artifact
        S13[Skill 13: Test Steps]:::workflow
        A13(Test Steps.json):::artifact
        A08 --> S09 --> A09 --> S10 --> A10 --> S11 --> A11 --> S12 --> A12 --> S13 --> A13
    end

    subgraph "Phase 4: Architecture Generation"
        S15[Skill 15: UI Arch]:::workflow
        A15(UI Architecture.json):::artifact
        S16[Skill 16: Strategic Arch]:::workflow
        A16(Strategic Architecture.md):::artifact
        S17[Skill 17: Tactic Arch]:::workflow
        A17(Tactic Architecture.json):::artifact
        S18[Skill 18: Flow Sequence]:::workflow
        A18(Flow Sequence.md):::artifact
        A08 --> S15 --> A15
        A08 --> S16 --> A16 --> S17 --> A17 --> S18 --> A18
    end

    %% Refinement
    S14[[Skill 14: Doc Refinement]]:::auxiliary
    A02 -.-> |Gap Trigger| S14
    A05 -.-> |Gap Trigger| S14
    A07 -.-> |Gap Trigger| S14
    S14 -.-> |Patch| A03
    S14 -.-> |Patch| A04
    S14 -.-> |Patch| A06

    %% Implementation
    subgraph "Phase 5: Implementation"
        S00[Skill 00: Implementation Roadmap]:::workflow
        A00(Code Generation Pipeline):::artifact
        A15 & A18 & A13 --> S00 --> A00
    end

    %% Knowledge Sync (Skill 19 — user-triggered only)
    subgraph "Phase 6: Knowledge Sync"
        S19[["⚡ Skill 19: Knowledge Sync"]]:::sync
        KB[("006.Knowledge — PRODUCTION")]:::knowledge
        IDX["_index/"]:::index
        IDX --> |manifest.json| KB
        IDX --> |by-component.json| KB
        IDX --> |by-feature.json| KB
        IDX --> |by-keyword.json| KB
    end

    %% Skill 19 reads from Artifacts, writes to Knowledge
    A01 & A03 & A08 & A13 & A15 & A18 -.-> |User triggers| S19
    S19 ==> |Decompose & SYNC| KB
    S19 ==> |Update| IDX

    %% Knowledge Reference (KB feeds READ-ONLY context into generation Skills)
    KB -.-> |READ reference| S04
    KB -.-> |READ reference| S09
    KB -.-> |READ reference| S10
    KB -.-> |READ reference| S14
    KB -.-> |READ reference| S16
```

---

## 2. Data Flow Architecture

```mermaid
graph LR
    classDef store fill:#1a1a2e,stroke:#16213e,color:#e94560;
    classDef process fill:#0f3460,stroke:#533483,color:#e94560;
    classDef output fill:#533483,stroke:#e94560,color:#fff;
    classDef gate fill:#f39c12,stroke:#e67e22,color:#1a1a2e;

    subgraph "Storage Layer"
        T[("001.Artifact Templates")]:::store
        P[("002.LLM Prompts")]:::store
        M[("003.Source Mappings")]:::store
        D[("004.Delivery Requests")]:::store
        ART[("005.Artifacts — DRAFT")]:::store
        K[("006.Knowledge — PROD")]:::store
    end

    subgraph "Generation Skills (01-18)"
        SKILL["AI Agent Skill"]:::process
    end

    subgraph "Artifact Output"
        GEN["Generate / Update Artifact"]:::output
        SNAP["Snapshot to 000.Snapshots"]:::output
    end

    subgraph "Knowledge Gate"
        S19[["⚡ Skill 19: Knowledge Sync"]]:::gate
        IDX["Update _index/ Files"]:::output
    end

    T --> SKILL
    P --> SKILL
    M --> SKILL
    D --> SKILL
    K -.-> |READ reference| SKILL

    SKILL --> GEN --> ART
    GEN --> SNAP

    ART -.-> |User triggers Skill 19| S19
    S19 ==> K
    S19 ==> IDX
```

---

## 3. Knowledge Base Architecture

```mermaid
graph TD
    classDef cat1 fill:#e74c3c,stroke:#c0392b,color:#fff;
    classDef cat2 fill:#3498db,stroke:#2980b9,color:#fff;
    classDef cat3 fill:#e67e22,stroke:#d35400,color:#fff;
    classDef cat4 fill:#e74c3c,stroke:#c0392b,color:#fff,stroke-dasharray: 5 5;
    classDef idx fill:#2c3e50,stroke:#34495e,color:#ecf0f1;

    IDX["_index/"]:::idx
    IDX --> MAN["manifest.json"]:::idx
    IDX --> COMP["by-component.json"]:::idx
    IDX --> FEAT["by-feature.json"]:::idx
    IDX --> KEY["by-keyword.json"]:::idx

    subgraph "what-we-build (WHY & WHAT)"
        K01["001. End User Requirement"]:::cat1
        K02["002. End User Information Collection"]:::cat1
        K03["003. Business Requirement Document"]:::cat1
    end

    subgraph "how-we-build (HOW)"
        K04["004. System Context Information"]:::cat2
        K05["005. Additional System Information"]:::cat2
        K06["006. Functional Requirement Document"]:::cat2
        K07["007. Additional Functional Information"]:::cat2
        K08["008. Function Specifications"]:::cat2
        K09["009. API Tactic Architecture"]:::cat2
        K10["010. Flow Sequence Architecture"]:::cat2
        K11["011. Strategic Architecture"]:::cat2
        K12["012. UI Component Architecture"]:::cat2
    end

    subgraph "how-we-test (HOW TO VERIFY)"
        K13["013. Test Cases"]:::cat3
        K14["014. Test Checklist"]:::cat3
        K16["016. Test Scope"]:::cat3
        K17["017. Test Steps"]:::cat3
    end

    subgraph "what-can-break (WHAT IF)"
        K15["015. Test Impact"]:::cat4
    end

    MAN --> K01 & K04 & K13 & K15
```

---

## 4. Artifact vs Knowledge Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Skill 01-18 generates artifact

    state "005.Artifacts (DRAFT)" as Draft {
        [*] --> Generated
        Generated --> Reviewed: User reviews & iterates
        Reviewed --> Refined: Skill 14 patches gaps
        Refined --> Approved: User approves
    }

    state "006.Knowledge (PRODUCTION)" as Prod {
        [*] --> Decomposed: Split into granular files
        Decomposed --> Indexed: _index/ files updated
        Indexed --> Searchable: Available for AI queries
    }

    Approved --> Skill19: User triggers Skill 19
    Skill19 --> Prod: Knowledge Sync

    Prod --> Draft: READ reference (consistency check)
```

---

## 5. AI Agent Query Flow (Impact Analysis)

```mermaid
sequenceDiagram
    participant Agent as AI Agent
    participant IDX as _index/
    participant KB as Knowledge Files (PROD)

    Agent->>IDX: 1. Read manifest.json (5KB)
    IDX-->>Agent: Feature landscape, component list, folder registry

    Agent->>IDX: 2. Read by-component.json
    IDX-->>Agent: "Redis Cache" → 19 file paths

    Agent->>IDX: 3. Read by-keyword.json
    IDX-->>Agent: "cache invalidation" → 6 additional files (with aliases)

    Agent->>KB: 4. Read ONLY 25 targeted files
    KB-->>Agent: Full impact context (specs, tests, risks)

    Note over Agent: 5. Execute task with full<br/>production knowledge awareness
```

---

## 6. Skill-to-Knowledge Folder Mapping

Skill 19 uses this mapping table to decompose artifacts into knowledge files:

| Skill | Artifact Output | Knowledge Folder | Decomposition Strategy |
|---|---|---|---|
| Skill 01 | `End User Requirement.md` | `001. End User Requirement` | 1 file (whole document) |
| Skill 02 | `Information Collection.json` | `002. End User Information Collection` | Each JSON array item → 1 file |
| Skill 03 | `Business Requirement Document.md` | `003. Business Requirement Document` | Split by section → 4 files |
| Skill 04 | `System Context Information.md` | `004. System Context Information` | Split by section → 5 files |
| Skill 05 | `Additional System Information.json` | `005. Additional System Information` | Each JSON array item → 1 file |
| Skill 06 | `Functional Requirement Document.md` | `006. Functional Requirement Document` | Split by section → 4 files |
| Skill 07 | `Additional Functional Information.json` | `007. Additional Functional Information` | Each JSON array item → 1 file |
| Skill 08 | `Function Specifications.json` | `008. Function Specifications` | 2 files (JSON + MD) |
| Skill 09 | `Test Scope.json` | `016. Test Scope` | Each JSON array item → 1 file |
| Skill 10 | `Test Impact.json` | `015. Test Impact` | Each JSON array item → 1 file |
| Skill 11 | `Test Checklist.json` | `014. Test Checklist` | Each JSON array item → 1 file |
| Skill 12 | `Test Cases.json` | `013. Test Cases` | Each JSON array item → 1 file |
| Skill 13 | `Test Steps.json` | `017. Test Steps` | Each TES-CAS group → 1 file |
| Skill 15 | `UI Component Architecture.json` | `012. UI Component Architecture` | Split by Atomic level → 5 files |
| Skill 16 | `Strategic Architecture.md` | `011. Strategic Architecture` | Split by C4 level → 2 files |
| Skill 17 | `API Tactic Architecture.json` | `009. API Tactic Architecture` | Each Vertical Slice → 1 file |
| Skill 18 | `Flow Sequence Architecture.md` | `010. Flow Sequence Architecture` | Each Mermaid diagram → 1 file |

---

## 7. Component Pipeline Detailing

### 🟢 Phase 1: Requirement Development
Translates abstract user intents into formalized, validated Business rules.
- **Skill 01 `[End User Requirement Generation]`**: Outputs the initial base file (`End User Requirement.md`).
- **Skill 02 `[Additional Information Generation]`**: Scans the base file for logical business gaps, outputting questions in JSON format (`Information Collection.json`).
- **Skill 03 `[Business Requirement Document Generation]`**: Aggregates the previous documents to formulate the hardened `Business Requirement Document.md` containing strict BRs.

### 🔵 Phase 2: Technical Requirement
Converts Business Rules into flat, actionable Technical components and restrictions.
- **Skill 04 `[System Context Generation]`**: Defines Database schema patterns, Infrastructure SLA, and Architectural patterns. References `006.Knowledge/_index/by-component.json` for cross-feature component awareness.
- **Skill 05 `[Additional System Information Generation]`**: Finds Non-Functional Requirement gaps (`Additional System Information.json`).
- **Skill 06 `[Functional Requirement Document Generation]`**: Translates features into specific System Behaviors (`Functional Requirement Document.md`).
- **Skill 07 `[Additional Functional Information Generation]`**: Finds edge-cases in data isolation, race conditions, and payloads (`Additional Functional Information.json`).
- **Skill 08 `[Functional Specifications Generation]`**: Flattens ALL previous markdown logic into a strict Relational JSON structure, ready for database translation (`Function Specifications.json`).

### 🟠 Phase 3: Testing Requirement
Generates absolute automated testing boundaries mirroring the Functional Specifications.
- **Skill 09 `[Test Scope Generation]`**: Establishes In-Scope constraints across UI, API, worker modules. References `by-component.json` to ensure test scope covers all registered components.
- **Skill 10 `[Test Impact Generation]`**: Identifies Legacy impact risks. References `by-component.json` + `by-keyword.json` for cross-feature risk correlation.
- **Skill 11 `[Test Checklist Generation]`**: Translates Scopes + Impacts into specific testable action tasks (`Test Checklist.json`).
- **Skill 12 `[Test Cases Generation]`**: Expands the checklist into structural cases with Mocks (`Test Cases.json`).
- **Skill 13 `[Test Steps Generation]`**: Finalizes the steps to execute QA validation (`Test Steps.json`).

### 🟣 Phase 4: Architecture Generation
Draws specific architectural boundaries utilizing Mermaid flows.
- **Skill 15 `[UI Component Architecture Generation]`**: Builds Atomic component structures (Atoms → Molecules → Organisms → Templates → Pages).
- **Skill 16 `[Strategic Architecture Generation]`**: Builds High-level C4 Contexts. References `by-component.json` for full system component landscape.
- **Skill 17 `[Tactic Architecture Generation]`**: Drills down into Vertical Slices (module → controller → handler → repository).
- **Skill 18 `[Flow Sequence Generation]`**: Emits cross-component interaction logic (Mermaid Sequence Diagrams).

### 🔨 Phase 5: Cross-Cutting / Refinement
- **Skill 14 `[Technical Document Refinement]`**: The "Surgeon" skill. Evaluates any "Additional Information .json" file and permanently patches the underlying markdown document to eliminate gaps. References `by-feature.json` to identify which knowledge files were derived from the target document.
- **Skill 00 `[Implementation Roadmap]`**: The ultimate downstream consumer that orchestrates actual `.js / .ts / .go` generation based on all preceding architectural artifacts.

### ⚡ Phase 6: Knowledge Sync (Skill 19)
The **deliberate**, user-triggered promotion of reviewed artifacts into the production Knowledge Base.

**Why not automatic?**
- Artifacts are **iterative drafts** — they may contain errors, placeholders, or unreviewed content.
- Knowledge is the **source of truth** for AI impact analysis — only approved, production-quality content should live here.
- Separating sync from generation allows **review gates** — the user decides when artifacts are ready for promotion.

**What Skill 19 does:**
1. Scans ALL artifacts under `005.Develop.002.Artifacts/${REQUEST CODE}/`
2. Decomposes each artifact into granular knowledge files using the mapping table (§6)
3. Applies naming conventions: `${FEATURE_CODE}.${ARTIFACT_CODE}.${descriptive-slug}.{json|md}`
4. Adds metadata headers (Feature-Code, Source-File, Source-Version)
5. Updates all `006.Knowledge/_index/` files (manifest, component, feature, keyword)
6. Verifies file count and searchability

---

## 8. File Naming Conventions

### Artifacts (`005.Develop.002.Artifacts`) — DRAFT
```
${REQUEST CODE}/
├── 001.Requirement Development Workflow/
│   ├── End User Requirement.md
│   ├── Information Collection.json
│   ├── Business Requirement Document.md
│   └── 000.Snapshots/           ← Version history
├── 002.Technical Requirement Workflow/
│   └── ...
├── 003.Testing Requirement Workflow/
│   └── ...
└── 003.Software Architecture Workflow/
    └── ...
```

### Knowledge Files (`006.Knowledge`) — PRODUCTION
```
006.Knowledge/
├── _index/                      ← AI Agent reads FIRST
│   ├── manifest.json            ← Entry point
│   ├── by-component.json        ← Impact analysis
│   ├── by-feature.json          ← Feature scope
│   └── by-keyword.json          ← Semantic search
├── 001. End User Requirement/
│   └── AIPD-000002.end-user-requirement.md
├── 002. End User Information Collection/
│   ├── AIPD-000002.INF-000001.fiscal-calendar-boundaries.json
│   ├── AIPD-000002.INF-000002.timezone-aggregation-standards.json
│   └── ...
├── ...
└── 017. Test Steps/
    └── AIPD-000002.TES-000001.CAS-000001.date-range-365.json
```

**Naming Pattern:** `${FEATURE_CODE}.${ARTIFACT_CODE}.${descriptive-slug}.{json|md}`

**Metadata Headers:**
- **Markdown**: HTML comment block with `Feature-Code`, `Source-File`, `Source-Version`
- **JSON**: `_metadata` object with `featureCode`, `featureName`, `sourceFile`, `sourceVersion`

---

## 9. Execution Protocols

### Protocol A: Generation (Skills 01-18)

```
1. RECEIVE task from user
2. READ Source Mapping Instructions (003.Setup.003)
   ├── Understand INPUT SOURCE FILES
   ├── Understand GENERATION RULES
   └── Understand KNOWLEDGE REFERENCE (read-only)
3. READ LLM Prompt Template (002.Setup.002)
   ├── Adopt persona (Product Owner, Architect, QA Engineer, etc.)
   └── Knowledge Base Awareness (for consistency, NOT for sync)
4. REFERENCE Knowledge Base — READ ONLY (006.Knowledge/_index/)
   ├── manifest.json → landscape awareness
   ├── by-component.json → component consistency
   └── by-keyword.json → semantic consistency
5. GENERATE artifact in 005.Develop.002.Artifacts (DRAFT)
   ├── Snapshot previous version to 000.Snapshots/
   └── Write new versioned artifact
6. REPORT completion
   └── ⚠️ NO automatic sync to Knowledge
```

### Protocol B: Knowledge Sync (Skill 19 — user-triggered)

```
1. RECEIVE Request Code from user
2. READ Source Mapping Instructions (003.Setup.003/020. Knowledge Sync.md)
   ├── Understand ARTIFACT-TO-KNOWLEDGE FOLDER MAPPING
   ├── Understand FILE NAMING CONVENTION
   ├── Understand METADATA HEADERS
   └── Understand INDEX UPDATE RULES
3. SCAN all artifacts under 005.Develop.002.Artifacts/${REQUEST CODE}/
4. DECOMPOSE each artifact into granular knowledge files
5. WRITE knowledge files to 006.Knowledge/ (PRODUCTION)
6. UPDATE _index/ files (manifest, component, feature, keyword)
7. VERIFY file count and searchability
8. REPORT completion with stats
```

---

## 10. Complete Skill Registry

| # | Skill Name | Phase | Output Layer | Knowledge Action |
|---|---|---|---|---|
| 00 | Implementation Roadmap | 5: Implementation | Code | — |
| 01 | End User Requirement Gen | 1: Requirement | 005.Artifacts (DRAFT) | READ reference |
| 02 | Additional Information Gen | 1: Requirement | 005.Artifacts (DRAFT) | READ reference |
| 03 | BRD Generation | 1: Requirement | 005.Artifacts (DRAFT) | READ reference |
| 04 | System Context Gen | 2: Technical | 005.Artifacts (DRAFT) | READ reference |
| 05 | Additional System Info Gen | 2: Technical | 005.Artifacts (DRAFT) | READ reference |
| 06 | FRD Generation | 2: Technical | 005.Artifacts (DRAFT) | READ reference |
| 07 | Additional Functional Info Gen | 2: Technical | 005.Artifacts (DRAFT) | READ reference |
| 08 | Functional Specifications Gen | 2: Technical | 005.Artifacts (DRAFT) | READ reference |
| 09 | Test Scope Gen | 3: Testing | 005.Artifacts (DRAFT) | READ reference |
| 10 | Test Impact Gen | 3: Testing | 005.Artifacts (DRAFT) | READ reference |
| 11 | Test Checklist Gen | 3: Testing | 005.Artifacts (DRAFT) | READ reference |
| 12 | Test Cases Gen | 3: Testing | 005.Artifacts (DRAFT) | READ reference |
| 13 | Test Steps Gen | 3: Testing | 005.Artifacts (DRAFT) | READ reference |
| 14 | Technical Doc Refinement | Cross-cutting | 005.Artifacts (DRAFT) | READ reference |
| 15 | UI Component Arch Gen | 4: Architecture | 005.Artifacts (DRAFT) | READ reference |
| 16 | Strategic Arch Gen | 4: Architecture | 005.Artifacts (DRAFT) | READ reference |
| 17 | Tactic Arch Gen | 4: Architecture | 005.Artifacts (DRAFT) | READ reference |
| 18 | Flow Sequence Gen | 4: Architecture | 005.Artifacts (DRAFT) | READ reference |
| **19** | **Knowledge Sync** | **6: Knowledge** | **006.Knowledge (PROD)** | **WRITE sync** |
