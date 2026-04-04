# Prompt Guidelines

## Required Prompt Ingredients

- State the target module and target layer.
- Reference the upstream artifacts explicitly.
- Ask the agent to preserve module boundaries and external references by id.
- Ask for explicit validation rules and error cases.

## Recommended Prompt Pattern

```text
Use the existing BRD and FRD as the business source of truth.
Use A4 as the domain source of truth.
Generate or update one A3 file only.
Keep fields aligned with A4 and list all validations and errors.
```

## Avoid

- Asking for code before documentation layers are ready.
- Asking the agent to invent new modules or repositories.
- Asking for vague "best practice" output without naming the target artifact.
