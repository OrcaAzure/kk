# Requirements: Teletext Mesh Portal

## Intro
Resurrect Ceefax-style Teletext as a Cordillera emergency information portal that remains usable on weak 3G/EDGE.

## Requirements

### Requirement 1: Strict Teletext memory pages

**User Story:** As a resident on a throttled connection, I want each page to be a tiny fixed grid so it loads and renders instantly.

#### Acceptance Criteria
1. WHEN a page is composed, THE system SHALL emit exactly 24 rows.
2. WHEN a row is composed, THE system SHALL emit at most 40 characters per row (padded to 40 on the wire).
3. WHEN a page is served, THE JSON body SHALL be strictly less than 10240 bytes.
4. THE system SHALL use only the 8-color Teletext palette.

### Requirement 2: Page-number API

**User Story:** As a client, I want to fetch pages by Ceefax-style 3-digit numbers.

#### Acceptance Criteria
1. WHEN the client requests `GET /api/page/100`, THE API SHALL return the main index page as JSON matching `packages/schema/teletext-page.schema.json`.
2. WHEN the client requests an unknown page, THE API SHALL return HTTP 404 with a Teletext-shaped error page payload when possible.
3. WHEN `:number` is not three digits, THE API SHALL return HTTP 400.

### Requirement 3: Retro viewer and keypad navigation

**User Story:** As a viewer, I want to type a 3-digit page number and jump immediately, like analog Teletext.

#### Acceptance Criteria
1. WHILE the viewer is focused, THE UI SHALL collect digit keypresses `0-9` into a 3-digit buffer.
2. WHEN the buffer reaches 3 digits, THE UI SHALL fetch `/api/page/{nnn}` and render the grid.
3. THE UI SHALL also expose an on-screen numeric keypad that writes the same buffer.
4. THE canvas SHALL render a 40×24 character grid with CRT scanlines.

### Requirement 4: Disaster feed composition (mock-first)

**User Story:** As a CDRRMO volunteer, I want raw advisory text turned into Teletext pages without manual layout.

#### Acceptance Criteria
1. THE composer SHALL accept raw PAGASA / CDRRMO / DPWH text (live or mock).
2. THE composer SHALL wrap and clip text into the 24×40 grid.
3. Seed pages `100`, `101`, and `200` SHALL exist under `data/pages/`.
