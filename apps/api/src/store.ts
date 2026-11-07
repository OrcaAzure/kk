import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { TeletextPage } from "../../../packages/schema/src/types.ts";
import { padPage } from "./composer.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const pagesDir = path.join(root, "data", "pages");
const contactsPath = path.join(root, "data", "contacts.json");

export function loadPages(): TeletextPage[] {
  if (!fs.existsSync(pagesDir)) return [];
  return fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const page = JSON.parse(fs.readFileSync(path.join(pagesDir, file), "utf8")) as TeletextPage;
      return padPage(page);
    })
    .sort((a, b) => a.number.localeCompare(b.number));
}

export function getPage(number: string): TeletextPage | undefined {
  return loadPages().find((page) => page.number === number);
}

export function listPages(): { number: string; title: string; source: string }[] {
  return loadPages().map((page) => ({
    number: page.number,
    title: page.title,
    source: page.source,
  }));
}

export function getContacts(): unknown {
  return JSON.parse(fs.readFileSync(contactsPath, "utf8"));
}
