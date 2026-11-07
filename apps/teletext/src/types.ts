import type { ColorName } from "./palette";

export interface Span {
  text: string;
  fg: ColorName;
  bg?: ColorName;
  blink?: boolean;
}

export type Row = { text: string; fg: ColorName; bg?: ColorName; blink?: boolean } | { spans: Span[] };

export interface TeletextPage {
  number: string;
  title: string;
  updatedAt: string;
  source: string;
  nextPage?: string;
  prevPage?: string;
  rows: Row[];
}
