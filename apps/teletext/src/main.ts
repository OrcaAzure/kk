import { PageKeypad } from "./nav";
import { TeletextRenderer } from "./renderer";
import type { TeletextPage } from "./types";

const canvas = document.querySelector<HTMLCanvasElement>("#teletext");
const keypad = document.querySelector<HTMLElement>("#keypad");
const bufferEl = document.querySelector<HTMLElement>("#page-buffer");
if (!canvas || !keypad || !bufferEl) throw new Error("Missing viewer DOM");

const renderer = new TeletextRenderer(canvas);
let page: TeletextPage | null = null;
let typed = "";

async function loadPage(number: string): Promise<void> {
  const res = await fetch(`/api/page/${number}`);
  if (!res.ok) {
    page = errorPage(number, res.status);
    return;
  }
  page = (await res.json()) as TeletextPage;
}

function errorPage(number: string, status: number): TeletextPage {
  const msg = status === 404 ? "PAGE NOT FOUND" : "SIGNAL LOST";
  return {
    number,
    title: msg,
    updatedAt: new Date().toISOString(),
    source: "system",
    rows: Array.from({ length: 24 }, (_, i) => {
      if (i === 0) return { text: `PAGASA-100            P${number}`, fg: "white", bg: "red" } as const;
      if (i === 8) return { text: msg.padStart(20 + msg.length / 2).slice(0, 40), fg: "yellow" } as const;
      if (i === 10) return { text: "TRY 100  101  200", fg: "white" } as const;
      if (i === 23) return { text: "0-9 SELECT   HOLD PAGE", fg: "black", bg: "cyan" } as const;
      return { text: "", fg: "white" } as const;
    }),
  };
}

function clock(): string {
  return new Date().toISOString().slice(11, 19);
}

function paint(): void {
  if (!page) return;
  renderer.render(page, clock(), typed);
}

const nav = new PageKeypad((buffer, committed) => {
  typed = buffer;
  bufferEl.textContent = (buffer + "---").slice(0, 3);
  if (committed) void loadPage(committed).then(paint);
});
nav.attach(keypad);

await loadPage("100");
paint();
window.setInterval(() => {
  renderer.tickBlink();
  paint();
}, 500);
