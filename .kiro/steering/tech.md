---
inclusion: always
---

# Tech stack

- Language: TypeScript (strict)
- Runtime: Node.js 20+
- API: Express in `apps/api`
- UI: Vite + vanilla TypeScript + HTML5 Canvas in `apps/teletext`
- Shared contract: JSON Schema + types in `packages/schema`
- Package manager: npm workspaces from the `kk` repo root

## Constraints Kiro must obey
- Pages are 24 lines, max 40 characters per line
- Colors: black, red, green, yellow, blue, magenta, cyan, white
- API route shape: `GET /api/page/:number` where `:number` is three digits
- No frameworks that inflate the first payload (no React/Vue on the viewer)
- Prefer mock disaster feeds that can later be swapped for PAGASA / CDRRMO / DPWH scrapers
