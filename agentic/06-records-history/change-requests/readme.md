# Change Request Records

This folder stores the historical record of actual development change requests.

## What A CR Record Should Capture

- CR identifier
- title and business reason
- requester and request date
- change type
- priority and status
- affected modules
- affected artifacts
- approval decision
- implementation and release outcome

## Folder Rule

- Store CR records inside the correct year folder.
- Use one file per real change request.

## Naming Rule

- `cr-YYYY-###-short-slug.md`

## Traceability Rule

Each CR should point to:

- the affected documentation artifacts
- any related bug or incident records
- the deployment or release where the change shipped
