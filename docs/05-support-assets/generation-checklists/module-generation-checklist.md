# Module Generation Checklist

- [ ] Module exists in A1.
- [ ] Layered structure is explicit: `domain`, `application`, `infrastructure`, `presentation`.
- [ ] FRD and A4 are present.
- [ ] Repository, use cases, and contracts are named consistently.
- [ ] `<module-name>.tokens.ts` is defined when implementation generation is requested.
- [ ] Repository contract lives in `domain/repositories/`.
- [ ] Repository implementation lives in `infrastructure/persistence/...`.
- [ ] Provider mapping lives in `infrastructure/providers/` for medium and large modules.
- [ ] Cross-module access uses ports, facades, or query services.
