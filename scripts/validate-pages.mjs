import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const COLS = 40;
const ROWS = 24;
const MAX_BYTES = 10 * 1024;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "data", "pages");

function rowLen(row) {
  if (row.spans) return row.spans.reduce((n, s) => n + String(s.text ?? "").length, 0);
  return String(row.text ?? "").length;
}

let failed = false;
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const full = path.join(dir, file);
  const raw = fs.readFileSync(full);
  const page = JSON.parse(raw.toString("utf8"));
  const issues = [];
  if (raw.length >= MAX_BYTES) issues.push(`payload ${raw.length} >= ${MAX_BYTES}`);
  if (!/^[0-9]{3}$/.test(page.number ?? "")) issues.push("number must be 3 digits");
  if (!Array.isArray(page.rows) || page.rows.length !== ROWS) {
    issues.push(`rows ${page.rows?.length ?? 0} !== ${ROWS}`);
  } else {
    page.rows.forEach((row, i) => {
      const n = rowLen(row);
      if (n > COLS) issues.push(`row ${i} length ${n} > ${COLS}`);
    });
  }
  if (issues.length) {
    failed = true;
    console.error(`${file}: ${issues.join("; ")}`);
  } else {
    console.log(`${file}: ok (${raw.length} bytes)`);
  }
}

if (failed) process.exit(1);
