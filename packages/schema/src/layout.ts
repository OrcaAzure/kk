import { COLS, type TeletextRow, type TeletextSpan } from "./types.js";

export function flattenRow(row: TeletextRow): TeletextSpan[] {
  if ("spans" in row) return row.spans;
  return [{ text: row.text, fg: row.fg, bg: row.bg, blink: row.blink }];
}

export function rowLength(row: TeletextRow): number {
  return flattenRow(row).reduce((sum, span) => sum + span.text.length, 0);
}

export function padRow(row: TeletextRow): TeletextRow {
  const len = rowLength(row);
  if (len === COLS) return row;
  const pad = " ".repeat(Math.max(0, COLS - len));
  if ("spans" in row) {
    const last = row.spans[row.spans.length - 1];
    return {
      spans: [
        ...row.spans.slice(0, -1),
        { ...last, text: (last?.text ?? "").slice(0, COLS) + (len < COLS ? pad : "") },
      ],
    };
  }
  return { ...row, text: (row.text + pad).slice(0, COLS) };
}
