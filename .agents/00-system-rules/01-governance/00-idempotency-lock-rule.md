# Rule: The Idempotency Lock Rule (Anti-Redundant Generation)

**Context:** The Agentic OS ecosystem utilizes `docs/03-artifacts-draft/{request-code}/.snapshots/state-lock.yaml` as its master cache database. Because LLMs are stochastic and cost tokens, you MUST mathematically evaluate if source inputs have changed before wasting time executing any content generation.

## 🛑 MANDATORY PRE-FLIGHT INTERLOCK
Before you generate, edit, or output ANY artifacts for your active Skill, you MUST perform the following exact steps. **Failure to do this is a direct violation of System Protocol.**

### Step 1: Locate the Lock File
Look for `state-lock.yaml` inside the `docs/03-artifacts-draft/{request-code}/.snapshots/` directory corresponding to the active feature you are working on. If the directory or file does not exist, assume a `Cache-Miss` (proceed to Step 4).

### Step 2: Compute Hash
Identify the exact input files (e.g., ticket inputs, source architectural drafts) required by your current Skill mapping. Compute their combined SHA-256 hash.

### Step 3: Evaluate State (Cache Hit / Miss)
Compare your computed source hash against the registered hash for your active Skill inside `state-lock.yaml`.

- **CACHE-HIT (Hashes Match):** The input has not chemically changed since the last execution. You MUST:
  1. Halt execution immediately.
  2. Print this exact message to the user: `🔒 [Idempotency Lock Active] Source inputs are unchanged. Bypassing LLM generation to protect manual human overrides and optimize operations.`
  3. Exit the skill gracefully. Do NOT output or overwrite any artifacts.

- **CACHE-MISS (Hashes Differ or Lock Missing):** The input is new or has been modified. You MUST:
  1. Proceed with the normal content generation logic required by your Skill.
  2. After successful artifact generation, proceed to Step 4.

### Step 4: Register the New Lock
Once you have fully generated the new artifact, you MUST update (or create) the `state-lock.yaml` file to record your executed state.

**Required `state-lock.yaml` format:**
```yaml
request_id: "{request-code}"
skills:
  "{skill-id}":
    version: "{YYYYMMDD_HHMMSS}"
    source_hash: "{your-computed-sha-256-hash}"
    timestamp: "{current-timestamp-string}"
```
*Note: Merge your Skill's data block into the existing file without destroying locks from other Skills.*
