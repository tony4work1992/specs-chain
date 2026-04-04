# Records Guide

This folder stores historical records of what actually happened during software delivery and operations.

Use this folder for:

- deployment history
- bug history
- incident history
- change request history

## Separation Rule

- `12-process-delivery` contains process, playbooks, and checklists.
- `13-process-operations` contains operational guidance and response workflows.
- `14-records-history` contains dated records of real events.

## Recommended Organization

```text
14-records-history/
  01-change-requests/
    year-YYYY/
  02-deployments/
    year-YYYY/
  03-bugs/
    year-YYYY/
  04-incidents/
    year-YYYY/
```

## Naming Rules

- Deployment record: `rel-YYYY-MM-DD-###.md`
- Change request record: `cr-YYYY-###-short-slug.md`
- Bug record: `bug-YYYY-###-short-slug.md`
- Incident record: `inc-YYYY-###-short-slug.md`

## Record Quality Rules

- Keep records factual and time-based.
- Link to related bug, release, incident, PR, or rollback references when they exist.
- Do not replace historical facts during later edits; append clarifications instead.
