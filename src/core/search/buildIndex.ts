import MiniSearch from "minisearch";
import type { CodexPage } from "../schemas/codexPage";
import type { RulesTable } from "../schemas/rulesTable";

export type SearchHitKind = "codex-page" | "rules-table";

export interface SearchDocument {
  id: string;
  path: string;
  title: string;
  body: string;
  kind: SearchHitKind;
}

export interface SearchHit {
  path: string;
  title: string;
  kind: SearchHitKind;
}

export function buildSearchIndex(
  codexPages: { path: string; page: CodexPage }[],
  rulesTables: { path: string; table: RulesTable }[],
): MiniSearch<SearchDocument> {
  const documents: SearchDocument[] = [];

  for (const { path, page } of codexPages) {
    documents.push({
      id: path,
      path,
      title: page.frontmatter.title,
      body: page.body,
      kind: "codex-page",
    });
  }

  for (const { path, table } of rulesTables) {
    for (const section of table.sections) {
      const rowText = section.rows.map((row) => row.join(" ")).join(" ");
      documents.push({
        id: `${path}#${section.id}`,
        path,
        title: section.title,
        body: `${section.columns.join(" ")} ${rowText}`,
        kind: "rules-table",
      });
    }
  }

  const index = new MiniSearch<SearchDocument>({
    fields: ["title", "body"],
    storeFields: ["path", "title", "kind"],
  });
  index.addAll(documents);
  return index;
}

export function search(
  index: MiniSearch<SearchDocument>,
  query: string,
): SearchHit[] {
  if (!query.trim()) {
    return [];
  }

  return index
    .search(query, { prefix: true, fuzzy: 0.2 })
    .slice(0, 20)
    .map((result) => ({
      path: result.path as string,
      title: result.title as string,
      kind: result.kind as SearchHitKind,
    }));
}
