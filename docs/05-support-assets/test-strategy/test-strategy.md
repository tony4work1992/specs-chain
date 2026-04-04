# Test Strategy

- Start from A3 and FRD to identify observable behavior.
- Ensure every business rule is represented by at least one success or failure test case.
- Prefer direct unit coverage for domain invariants.
- Use regression suites to cover query endpoints and lower-frequency update paths that do not justify their own e2e artifact yet.
