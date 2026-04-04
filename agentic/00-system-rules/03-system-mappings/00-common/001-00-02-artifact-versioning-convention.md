# Artifact Versioning Convention

## 1. Overview

To maintain strict traceability across all generated artifacts within the "Intelligence Commerce" project, every document (Markdown) and data schema (JSON) must include three specific version tracking fields. This convention ensures that any AI agent or Human Architect can seamlessly trace the lifecycle of a requirement down to its testing steps.

## 2. Version Format

**Format:** `YYYY.MM.DD HH.MM.SS`
**Example:** `2026.04.02 11.30.00`
**Regex Constraint for JSON:** `^\d{4}\.\d{2}\.\d{2} \d{2}\.\d{2}\.\d{2}$`

*All versions MUST adhere to this exact 24-hour timestamp format. Standard semantic versioning (e.g., v1.0.0) is strictly prohibited across these templates.*

---

## 3. Version Fields Definitions

### 3.1. Request Version (`requestVersion`)
- **Definition:** The timestamp or identifier assigned to the original prompt, ticket, or user request that initiated the generation of this artifact.
- **Purpose:** Links the resulting artifact back to the exact user instruction or temporal moment it was requested.

### 3.2. Parent Version (`parentVersion`)
- **Definition:** The `Version` of the upstream document used as the logical source to generate the current document.
- **Purpose:** Ensures traceability. For instance, when generating a Functional Requirement Document (FRD), the `parentVersion` must match the `Version` of the Business Requirement Document (BRD) it was derived from. If it is the first node in a structural tree (e.g., End User Requirements), this should match the `Version` or reflect the creation baseline.

### 3.3. Version (`version`)
- **Definition:** The timestamp representing the exact moment the current artifact was generated or finalized.
- **Purpose:** Acts as the primary temporal identifier for this file state.

---

## 4. Implementation Guidelines for AI Agents

**For Markdown (.md) Templates:**
Always include these three lines at the top of the document, typically right under the main Title (H1):
```text
**Request Version:** [YYYY.MM.DD HH.MM.SS]
**Version:** [YYYY.MM.DD HH.MM.SS]
**Parent Version:** [YYYY.MM.DD HH.MM.SS]
```

**For JSON (.json) Templates:**
Always ensure the 3 properties exist in the object's `properties` map and are strictly enforced in the bounding `required` array.
```json
"requestVersion": {
    "type": "string",
    "pattern": "^\\d{4}\\.\\d{2}\\.\\d{2} \\d{2}\\.\\d{2}\\.\\d{2}$",
    "description": "Version of the request (e.g., 2026.04.02 11.30.00)"
},
"version": {
    "type": "string",
    "pattern": "^\\d{4}\\.\\d{2}\\.\\d{2} \\d{2}\\.\\d{2}\\.\\d{2}$",
    "description": "Version of the current document (e.g., 2026.04.02 11.30.00)"
},
"parentVersion": {
    "type": "string",
    "pattern": "^\\d{4}\\.\\d{2}\\.\\d{2} \\d{2}\\.\\d{2}\\.\\d{2}$",
    "description": "Version of the parent document used as source (e.g., 2026.04.02 11.30.00)"
}
```

> **CRITICAL AI INSTRUCTION:** 
> Do NOT hallucinate versions. If generating a child artifact from a parent source, explicitly evaluate the parent document, extract its `Version` string, and precisely inject it as the child's `Parent Version`. Use the current system timestamp only for `Request Version` and `Version` unless instructed otherwise by the user.
