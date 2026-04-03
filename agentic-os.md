# Agentic OS: Document Generation Pipeline

This document visualizes the complete end-to-end autonomous documentation pipeline (Agentic OS), illustrating how specific Agent Skills trigger predefined Generation Rules to output highly structured architectural and functional artifacts.

---

## 1. Overall System Mindmap (Mermaid)

```mermaid
graph TD
    %% Define Styles
    classDef input fill:#2c3e50,stroke:#34495e,stroke-width:2px,color:#ecf0f1;
    classDef workflow fill:#8e44ad,stroke:#9b59b6,stroke-width:2px,color:#fff;
    classDef artifact fill:#27ae60,stroke:#2ecc71,stroke-width:2px,color:#fff;
    classDef auxiliary fill:#d35400,stroke:#e67e22,stroke-width:2px,color:#fff;

    %% Entry Data
    Input[("Raw User Request / Context")]:::input

    %% Phase 1
    subgraph Phase 1: Requirement Development Workflow
        S01[Skill 01: End User Req Gen]:::workflow
        A01(End User Requirement.md):::artifact
        S02[Skill 02: Add Info Gen]:::workflow
        A02(Information Collection.json):::artifact
        S03[Skill 03: BRD Gen]:::workflow
        A03(Business Requirement Document.md):::artifact
        
        Input --> S01 --> A01 --> S02 --> A02 --> S03 --> A03
    end

    %% Refinement Core
    S14[[Skill 14: Technical Document Refinement]]:::auxiliary
    A02 -.-> |Gap Trigger| S14
    S14 -.-> |Patch| A03

    %% Phase 2
    subgraph Phase 2: Technical Requirement Workflow
        S04[Skill 04: System Context Gen]:::workflow
        A04(System Context Information.md):::artifact
        S05[Skill 05: Add System Info Gen]:::workflow
        A05(Additional System Info.json):::artifact
        S06[Skill 06: FRD Gen]:::workflow
        A06(Functional Req Document.md):::artifact
        S07[Skill 07: Add Functional Info Gen]:::workflow
        A07(Additional Functional Info.json):::artifact
        S08[Skill 08: Functional Specs Gen]:::workflow
        A08(Function Specifications.json):::artifact

        A03 --> S04 --> A04 --> S05 --> A05 --> S06 --> A06 --> S07 --> A07 --> S08 --> A08
    end

    A05 -.-> |Gap Trigger| S14
    A07 -.-> |Gap Trigger| S14
    S14 -.-> |Patch| A04
    S14 -.-> |Patch| A06

    %% Phase 3
    subgraph Phase 3: Testing Requirement Workflow
        S09[Skill 09: Test Scope Gen]:::workflow
        A09(Test Scope.json):::artifact
        S10[Skill 10: Test Impact Gen]:::workflow
        A10(Test Impact.json):::artifact
        S11[Skill 11: Test Checklist Gen]:::workflow
        A11(Test Checklist.json):::artifact
        S12[Skill 12: Test Cases Gen]:::workflow
        A12(Test Cases.json):::artifact
        S13[Skill 13: Test Steps Gen]:::workflow
        A13(Test Steps.json):::artifact

        A08 --> S09 --> A09 --> S10 --> A10 --> S11 --> A11 --> S12 --> A12 --> S13 --> A13
    end

    %% Phase 4
    subgraph Phase 4: Architecture Generation Workflow
        S15[Skill 15: UI Component Arch]:::workflow
        A15(UI Architecture.md):::artifact
        S16[Skill 16: Strategic Arch]:::workflow
        A16(Strategic Architecture.md):::artifact
        S17[Skill 17: Tactic Arch]:::workflow
        A17(Tactic Architecture.md):::artifact
        S18[Skill 18: Flow Sequence]:::workflow
        A18(Flow Sequence.md):::artifact

        A08 --> S15 --> A15
        A08 --> S16 --> A16 --> S17 --> A17 --> S18 --> A18
    end

    %% Phase 5
    subgraph Phase 5: Implementation Pipeline
        S00[Skill 00: Implementation Roadmap]:::workflow
        A00(Code Generation Pipeline):::artifact
        
        A15 & A18 & A13 --> S00 --> A00
    end
```

---

## 2. Component Pipeline Detailing

### 🟢 Phase 1: Requirement Development
Translates abstract user intents into formalized, validated Business rules.
- **Skill 01 `[End User Requirement Generation]`**: Outputs the initial base file (`End User Requirement.md`).
- **Skill 02 `[Additional Information Generation]`**: Scans the base file for logical business gaps, outputting questions in JSON format (`Information Collection.json`).
- **Skill 03 `[Business Requirement Document Generation]`**: Aggregates the previous documents to formulate the hardened `Business Requirement Document.md` containing strict BRs.

### 🔵 Phase 2: Technical Requirement
Converts Business Rules into flat, actionable Technical components and restrictions.
- **Skill 04 `[System Context Generation]`**: Defines Database schema patterns, Infrastructure SLA, and Architectural patterns (`System Context Information.md`).
- **Skill 05 `[Additional System Information Generation]`**: Finds Non-Functional Requirement gaps (`Additional System Information.json`).
- **Skill 06 `[Functional Requirement Document Generation]`**: Translates features into specific System Behaviors (`Functional Requirement Document.md`).
- **Skill 07 `[Additional Functional Information Generation]`**: Finds edge-cases in data isolation, race conditions, and payloads (`Additional Functional Information.json`).
- **Skill 08 `[Functional Specifications Generation]`**: Flattens ALL previous markdown logic into a strict Relational JSON structure, ready for database translation (`Function Specifications.json`).

### 🟠 Phase 3: Testing Requirement
Generates absolute automated testing boundaries mirroring the Functional Specifications.
- **Skill 09 `[Test Scope Generation]`**: Establishes In-Scope constraints across UI, API, worker modules (`Test Scope.json`).
- **Skill 10 `[Test Impact Generation]`**: Identifies Legacy impact risks (`Test Impact.json`).
- **Skill 11 `[Test Checklist Generation]`**: Translates Scopes + Impacts into specific testable action tasks (`Test Checklist.json`).
- **Skill 12 `[Test Cases Generation]`**: Expands the checklist into structural cases with Mocks (`Test Cases.json`).
- **Skill 13 `[Test Steps Generation]`**: Finalizes the steps to execute QA validation (`Test Steps.json`).

### 🟣 Phase 4: Architecture Generation
Draws specific architectural boundaries utilizing Mermaid flows.
- **Skill 15 `[UI Component Architecture Generation]`**: Builds Atomic component structures.
- **Skill 16 `[Strategic Architecture Generation]`**: Builds High-level C4 Contexts.
- **Skill 17 `[Tactic Architecture Generation]`**: Drills down into Vertical Slices.
- **Skill 18 `[Flow Sequence Generation]`**: Emits cross-component interaction logic.

### 🔨 Cross-Cutting / Refinement
- **Skill 14 `[Technical Document Refinement]`**: The "Surgeon" skill. It actively evaluates any "Additional Information .json" file and permanently patches the underlying markdown document to eliminate gaps.
- **Skill 00 `[Implementation Roadmap]`**: The ultimate downstream consumer that orchestrates actual `.js / .ts / .go` generation based on all preceding architectural artifacts.
