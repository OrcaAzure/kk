# Teletext Typhoon Mesh Portal (PAGASA-100)

Kiroween 2026 · **Resurrection** · Baguio / Cordillera emergency Teletext.

This repository lives in the `kk` folder. Analog Ceefax is reimagined as a **40×24**, **sub-10KB** weather and road-advisory portal for weak 3G/EDGE and typhoon blackouts.

## Folder structure

```
kk/
├── .kiro/                          # REQUIRED for Kiroween — do not gitignore
│   ├── steering/                   # product.md, tech.md, structure.md, teletext-grid.md
│   ├── specs/teletext-mesh-portal/ # requirements.md, design.md, tasks.md
│   └── hooks/                      # grid + payload validators
├── apps/
│   ├── api/                        # Node.js + TypeScript JSON API
│   └── teletext/                   # Vite + HTML5 Canvas viewer
├── packages/schema/                # TeletextPage JSON Schema + TS types
├── data/pages/                     # Seed pages 100, 101, 200
├── scripts/validate-pages.mjs
├── AGENTS.md
├── LICENSE                         # MIT (GitHub license detect)
└── package.json                    # npm workspaces
```

## Teletext page JSON (summary)

Full schema: [`packages/schema/teletext-page.schema.json`](packages/schema/teletext-page.schema.json)

```json
{
  "number": "100",
  "title": "PAGASA-100 INDEX",
  "updatedAt": "2026-11-07T08:00:00.000Z",
  "source": "index",
  "nextPage": "101",
  "rows": [
    { "text": "HEADER LINE PADDED TO 40 CHARS.........", "fg": "yellow", "bg": "blue" }
  ]
}
```

- `rows` must be **exactly 24** items
- each row `text` (or concatenated `spans[].text`) is **≤ 40** characters
- `fg` / `bg` are only: `black | red | green | yellow | blue | magenta | cyan | white`

## Run locally

Needs Node 20+. Use two terminals from `kk`:

```bash
npm install
npm run dev:api
npm run dev:ui
```

- API: http://127.0.0.1:8787/api/page/100
- Viewer: http://127.0.0.1:5173

Type `100`, `101`, or `200` (keyboard or on-screen keypad).

```bash
npm run validate:pages
```

## Page map

| Page | Contents              |
| ---- | --------------------- |
| 100  | Main index            |
| 101  | PAGASA weather (mock) |
| 200  | DPWH road closures    |
