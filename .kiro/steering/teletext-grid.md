---
inclusion: fileMatch
fileMatchPattern: ["**/teletext/**", "**/pages/*.json", "**/schema/**", "**/composer.ts"]
---

# Teletext grid rules

1. Pad or truncate every row to exactly 40 characters before serialize.
2. Always emit 24 rows. Unused rows are 40 spaces with default colors.
3. Row 0 is the header (service name, clock, page number).
4. Row 23 is the fastext / footer prompt (`0-9 TO SELECT   HOLD PAGE`).
5. Mixed color on a row uses `spans`; concatenated `text` lengths must equal 40.
6. Reject any serialized page ≥ 10240 bytes.
