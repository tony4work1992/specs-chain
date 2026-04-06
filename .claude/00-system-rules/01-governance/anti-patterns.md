# Anti-Patterns

- Generating implementation code before BRD, FRD, A4, A3, and TEST exist.
- Introducing new fields in A3 that do not exist in A4.
- Letting one module query another module's repository directly.
- Writing vague validation such as "check input is valid" without enumerating the rule.
- Embedding full external entities inside another aggregate instead of storing ids.
- Treating query behavior as unimportant and leaving it without test coverage.
