export type DigitHandler = (buffer: string, committed?: string) => void;

const IDLE_MS = 2500;

export class PageKeypad {
  private buffer = "";
  private timer: number | undefined;

  constructor(private readonly onChange: DigitHandler) {}

  attach(keypad: HTMLElement): void {
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "GO"];
    for (const label of keys) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", () => this.onKey(label));
      keypad.append(btn);
    }
    window.addEventListener("keydown", (event) => {
      if (event.repeat) return;
      if (/^[0-9]$/.test(event.key)) this.pushDigit(event.key);
      if (event.key === "Escape" || event.key === "Backspace") this.clear();
      if (event.key === "Enter") this.commit();
    });
  }

  private onKey(label: string): void {
    if (label === "C") {
      this.clear();
      return;
    }
    if (label === "GO") {
      this.commit();
      return;
    }
    this.pushDigit(label);
  }

  private pushDigit(d: string): void {
    this.buffer = (this.buffer + d).slice(-3);
    this.onChange(this.buffer);
    this.armIdle();
    if (this.buffer.length === 3) this.commit();
  }

  private commit(): void {
    if (this.buffer.length !== 3) return;
    const page = this.buffer;
    this.onChange(this.buffer, page);
    this.armIdle();
  }

  private clear(): void {
    this.buffer = "";
    this.onChange("");
  }

  private armIdle(): void {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.clear(), IDLE_MS);
  }
}
