export const TELETEXT_COLORS = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
] as const;

export type TeletextColor = (typeof TELETEXT_COLORS)[number];

export type TeletextSource =
  | "pagasa"
  | "cdrmo"
  | "dpwh"
  | "index"
  | "system"
  | "directory";

export interface TeletextSpan {
  text: string;
  fg: TeletextColor;
  bg?: TeletextColor;
  blink?: boolean;
}

export type TeletextRow =
  | {
      text: string;
      fg: TeletextColor;
      bg?: TeletextColor;
      blink?: boolean;
    }
  | {
      spans: TeletextSpan[];
    };

export interface TeletextPage {
  number: string;
  title: string;
  updatedAt: string;
  source: TeletextSource;
  nextPage?: string;
  prevPage?: string;
  rows: TeletextRow[];
}

export const COLS = 40;
export const ROWS = 24;
export const MAX_PAGE_BYTES = 10 * 1024;
