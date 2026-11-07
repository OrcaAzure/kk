# Design: Teletext Mesh Portal

## Architecture

```
[mock/live feeds] -> composer (LLM/Kiro pipeline later)
        |                |
        v                v
  data/pages/*.json   GET /api/page/:nnn
                             |
                             v
                   apps/teletext Canvas (40x24)
                             ^
                    3-digit keypad / keyboard
```

## Page JSON
Canonical schema: `packages/schema/teletext-page.schema.json`.

Each page is a document with `number`, `title`, `updatedAt`, `source`, and `rows[24]`.
A row is either a flat `{ text, fg, bg }` or `{ spans: [{ text, fg, bg }] }`.

## Rendering
- Logical resolution: 640×480 (16×20 px cells × 40×24).
- Draw glyphs with a monospace pixel font; disable image smoothing.
- After glyphs, overlay 50% scanlines and a slight RGB phosphor tint.

## Navigation
- Digit buffer with 2.5s idle reset.
- Completing 3 digits triggers `loadPage(nnn)`.
- Header clock ticks locally; page body comes from the API.

## Payload budget
`scripts/validate-pages.mjs` fails the build/hook if any page file is ≥ 10KB or violates 24×40.
