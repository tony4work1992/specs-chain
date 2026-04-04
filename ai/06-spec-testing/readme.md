# Testing Guide

Test artifacts verify that A3 behavior and FRD rules are executable and safe.

Coverage model:

- unit: core domain and use-case rules
- integration: persistence and adapter boundaries
- e2e: high-value user journeys
- regression: broad contract and smoke verification, especially for queries and update paths without dedicated e2e flows
