---
inclusion: always
---

# Repository structure (`kk`)

```
.kiro/                  # Kiroween: steering, specs, hooks — never gitignore
  steering/
  specs/teletext-mesh-portal/
  hooks/
apps/
  api/                  # JSON Teletext page server + composer stub
  teletext/             # 40×24 canvas viewer + 3-digit navigation
packages/
  schema/               # TeletextPage JSON Schema and TS types
data/pages/             # Canonical 3-digit page JSON (source of truth)
scripts/                # Payload and grid validators used by hooks
```

## Conventions
- Page files: `data/pages/{NNN}.json`
- Shared types imported from `@kk/schema`
- Keep API handlers thin; composition lives in `apps/api/src/composer.ts`
