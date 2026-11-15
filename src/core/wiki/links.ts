export interface WikiLink {
  id: string;
  label?: string;
}

const LINK_PATTERN = /\[\[([a-z]+:[a-z0-9-]+)(\|([^\]]+))?\]\]/g;

// [[type:slug]] or [[type:slug|label]] — CLAUDE.md's content rule for
// links in prose. Regex-based, not a markdown parse: full prose-to-HTML
// rendering is phase 1's carried-over gap, not this phase's job.
export function parseLinks(body: string): WikiLink[] {
  const links: WikiLink[] = [];
  for (const match of body.matchAll(LINK_PATTERN)) {
    links.push({ id: match[1], label: match[3] });
  }
  return links;
}
