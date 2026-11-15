import type { WikiEntry, WikiEntryFrontmatter } from "../schemas/wikiEntry";
import { parseLinks } from "./links";

export interface WikiEntity {
  id: string;
  path: string;
  frontmatter: WikiEntryFrontmatter;
  body: string;
}

export interface BrokenLink {
  from: string;
  to: string;
  label?: string;
}

export interface WikiIndex {
  entities: Map<string, WikiEntity>;
  backlinks: Map<string, string[]>;
  brokenLinks: BrokenLink[];
}

// Pure: takes every loaded wiki page and resolves [[links]] into
// backlinks or, when the target doesn't exist, a collected broken link —
// never thrown, per CLAUDE.md's content rule.
export function buildWikiIndex(
  pages: { path: string; entry: WikiEntry }[],
): WikiIndex {
  const entities = new Map<string, WikiEntity>();
  for (const { path, entry } of pages) {
    entities.set(entry.frontmatter.id, {
      id: entry.frontmatter.id,
      path,
      frontmatter: entry.frontmatter,
      body: entry.body,
    });
  }

  const backlinks = new Map<string, string[]>();
  const brokenLinks: BrokenLink[] = [];

  for (const entity of entities.values()) {
    for (const link of parseLinks(entity.body)) {
      if (entities.has(link.id)) {
        const sources = backlinks.get(link.id) ?? [];
        if (!sources.includes(entity.id)) sources.push(entity.id);
        backlinks.set(link.id, sources);
      } else {
        brokenLinks.push({ from: entity.id, to: link.id, label: link.label });
      }
    }
  }

  return { entities, backlinks, brokenLinks };
}

export * from "./links";
export * from "./infobox";
export * from "./slug";
