import { RESERVED_WIKI_KEYS, type WikiEntryFrontmatter } from "../schemas/wikiEntry";

export interface InfoboxRow {
  key: string;
  value: string;
}

const RESERVED = new Set<string>(RESERVED_WIKI_KEYS);

// Every front-matter key beyond the five reserved ones becomes an
// infobox row — DESIGN.md's worked example ("kind: pc", "player: ahad")
// is exactly this, not a fixed per-type schema.
export function extractInfobox(frontmatter: WikiEntryFrontmatter): InfoboxRow[] {
  return Object.entries(frontmatter)
    .filter(([key]) => !RESERVED.has(key))
    .map(([key, value]) => ({ key, value: stringifyValue(value) }));
}

function stringifyValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(stringifyValue).join(", ");
  if (value === null || value === undefined) return "";
  return String(value);
}
