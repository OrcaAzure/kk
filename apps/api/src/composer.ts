import {
  COLS,
  ROWS,
  type TeletextPage,
  type TeletextRow,
} from "../../../packages/schema/src/types.ts";
import { padRow, rowLength } from "../../../packages/schema/src/layout.ts";

function emptyRow(): TeletextRow {
  return { text: " ".repeat(COLS), fg: "white", bg: "black" };
}

export function padPage(page: TeletextPage): TeletextPage {
  const rows = [...page.rows].slice(0, ROWS).map(padRow);
  while (rows.length < ROWS) rows.push(emptyRow());
  return { ...page, rows };
}

/** Wrap raw advisory text into a strict 24x40 page (LLM slot later). */
export function composeFromFeed(opts: {
  number: string;
  title: string;
  source: TeletextPage["source"];
  header: string;
  body: string;
}): TeletextPage {
  const lines = wrap40(opts.body);
  const rows: TeletextRow[] = [
    { text: opts.header.slice(0, COLS), fg: "yellow", bg: "blue" },
    { text: opts.title.slice(0, COLS), fg: "cyan", bg: "black" },
    { text: "", fg: "white" },
    ...lines.map((text) => ({ text, fg: "white" as const })),
  ];
  const page = padPage({
    number: opts.number,
    title: opts.title,
    updatedAt: new Date().toISOString(),
    source: opts.source,
    rows,
  });
  page.rows[ROWS - 1] = padRow({
    text: `0-9 SELECT   HOLD PAGE   P${opts.number}`,
    fg: "black",
    bg: "cyan",
  });
  return page;
}

function wrap40(text: string): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (next.length <= COLS) {
      cur = next;
    } else {
      if (cur) lines.push(cur);
      cur = word.slice(0, COLS);
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function assertGrid(page: TeletextPage): void {
  if (page.rows.length !== ROWS) {
    throw new Error(`expected ${ROWS} rows, got ${page.rows.length}`);
  }
  page.rows.forEach((row, i) => {
    const n = rowLength(row);
    if (n > COLS) throw new Error(`row ${i} is ${n} cols`);
  });
}
