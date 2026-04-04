# Controller Rules

- Controllers validate transport-level concerns such as required headers or route parameters.
- Controllers invoke exactly one primary use case per endpoint.
- Controllers do not perform domain mutation logic directly.
- Error mapping must be deterministic and align with A3 error definitions.
- Controllers must not access repositories or TypeORM directly.
- Controllers should map HTTP request and response models, then delegate orchestration to the application layer.
