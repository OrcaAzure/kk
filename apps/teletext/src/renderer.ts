import { CELL_H, CELL_W, COLS, PALETTE, ROWS, type ColorName } from "./palette";
import type { Row, Span, TeletextPage } from "./types";

export class TeletextRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private blinkOn = true;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D unavailable");
    this.ctx = ctx;
    canvas.width = COLS * CELL_W;
    canvas.height = ROWS * CELL_H;
    ctx.imageSmoothingEnabled = false;
    ctx.textBaseline = "top";
    ctx.font = "16px 'Courier New', Courier, monospace";
  }

  tickBlink(): void {
    this.blinkOn = !this.blinkOn;
  }

  render(page: TeletextPage, headerClock: string, typed: string): void {
    const { ctx } = this;
    ctx.fillStyle = PALETTE.black;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < ROWS; y += 1) {
      const row = page.rows[y];
      if (!row) continue;
      this.drawRow(y, flatten(row));
    }

    this.drawStatus(headerClock, typed);
    this.drawPhosphor();
  }

  private drawRow(y: number, spans: Span[]): void {
    let x = 0;
    for (const span of spans) {
      const bg = span.bg ?? "black";
      const hidden = Boolean(span.blink) && !this.blinkOn;
      for (const ch of span.text) {
        if (x >= COLS) return;
        this.drawCell(x, y, hidden ? " " : ch, span.fg, bg);
        x += 1;
      }
    }
    while (x < COLS) {
      this.drawCell(x, y, " ", "white", "black");
      x += 1;
    }
  }

  private drawCell(x: number, y: number, ch: string, fg: ColorName, bg: ColorName): void {
    const px = x * CELL_W;
    const py = y * CELL_H;
    this.ctx.fillStyle = PALETTE[bg];
    this.ctx.fillRect(px, py, CELL_W, CELL_H);
    this.ctx.fillStyle = PALETTE[fg];
    this.ctx.fillText(ch, px + 1, py + 2);
  }

  private drawStatus(clock: string, typed: string): void {
    const buf = (typed + "---").slice(0, 3);
    this.ctx.fillStyle = PALETTE.yellow;
    this.ctx.fillText(clock, (COLS - 8) * CELL_W, 2);
    this.ctx.fillStyle = PALETTE.white;
    this.ctx.fillText(buf, (COLS - 3) * CELL_W, (ROWS - 1) * CELL_H + 2);
  }

  private drawPhosphor(): void {
    const { ctx, canvas } = this;
    ctx.fillStyle = "rgba(0, 255, 120, 0.035)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function flatten(row: Row): Span[] {
  if ("spans" in row) return row.spans;
  return [{ text: row.text, fg: row.fg, bg: row.bg, blink: row.blink }];
}
