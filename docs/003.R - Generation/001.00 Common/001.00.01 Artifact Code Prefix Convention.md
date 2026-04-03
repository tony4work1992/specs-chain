# Artifact Code Prefix Convention

## 1. General Rules

All tracking codes, IDs, and identifiers within the system artifacts must follow a standard prefix format to ensure consistency and easy traceability across different document phases (Requirements, Specifications, Testing).

**Standard Format:**
```text
[PREFIX]-[XXXXXX]
```

* **[PREFIX]:** A 3-letter uppercase string representing the specific artifact or entity type.
* **[XXXXXX]:** A 6-digit zero-padded sequential number starting from `000001` (e.g., `000001`, `000002`). *Note: Legacy tracking numbers might use 5 digits (e.g., `REQ-00006`), but all newly mapped template IDs strictly enforce the 6-digit format.*

---

## 2. Defined Prefixes by Category

### 2.1. Requirement & Specification Workflow

| Prefix | Artifact / Entity Type | Pattern Rule | Example |
| :--- | :--- | :--- | :--- |
| **REQ** | Core Business/Functional Requirement | `^REQ-\d{5,6}$` | `REQ-000001` |
| **SEC** | Function Specification Section (UI States, Fields...) | `^SEC-\d{6}$` | `SEC-000001` |
| **INF** | Information Collection Criteria | `^INF-\d{6}$` | `INF-000001` |
| **ASI** | Additional System Information | `^ASI-\d{6}$` | `ASI-000001` |
| **AFI** | Additional Functional Information | `^AFI-\d{6}$` | `AFI-000001` |

---

### 2.2. Testing Workflow

| Prefix | Artifact / Entity Type | Pattern Rule | Example |
| :--- | :--- | :--- | :--- |
| **SCO** | Test Scope Item | `^SCO-\d{6}$` | `SCO-000001` |
| **CHE** | Test Checklist Item | `^CHE-\d{6}$` | `CHE-000001` |
| **CAS** | Test Case | `^CAS-\d{6}$` | `CAS-000001` |
| **IMP** | Test Impact Analysis Item | `^IMP-\d{6}$` | `IMP-000001` |
| **STE** | Test Execution Step | `^STE-\d{6}$` | `STE-000001` |
| **TES** | Test Specification Collection | `^TES-\d{6}$` | `TES-000001` |

---

## 3. JSON Schema Validation Example

Whenever generating JSON artifacts defined by our standard templates, the `code` (or `id`) field must be populated according to the prefix validation patterns. An example implementation inside the JSON Schema is as follows:

```json
"code": {
    "type": "string",
    "pattern": "^SCO-\\d{6}$",
    "description": "Unique identifier for the Scope (e.g., SCO-000001)"
}
```
