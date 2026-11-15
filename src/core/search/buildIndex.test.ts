import { describe, expect, it } from "vitest";
import { buildSearchIndex, search } from "./buildIndex";
import type { CodexPage } from "../schemas/codexPage";
import type { RulesTable } from "../schemas/rulesTable";

const healingPage: CodexPage = {
  frontmatter: { schema: 1, title: "Healing and recovery", pinnable: false },
  body: "First Aid removes conditions such as Bloodied.",
};

const conditionsTable: RulesTable = {
  schema: 1,
  kind: "conditions",
  sections: [
    {
      id: "bloodied",
      title: "Bloodied",
      columns: ["Name", "Effect"],
      rows: [["Bloodied", "Half Move and Dodge"]],
    },
  ],
};

describe("buildSearchIndex / search", () => {
  it("finds a codex page by title", () => {
    const index = buildSearchIndex(
      [{ path: "rules/codex/healing.md", page: healingPage }],
      [],
    );
    const hits = search(index, "Healing");

    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      path: "rules/codex/healing.md",
      kind: "codex-page",
    });
  });

  it("finds a rules table section by row content", () => {
    const index = buildSearchIndex(
      [],
      [{ path: "rules/data/conditions.yaml", table: conditionsTable }],
    );
    const hits = search(index, "Bloodied");

    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]).toMatchObject({
      path: "rules/data/conditions.yaml",
      kind: "rules-table",
    });
  });

  it("returns no hits for an empty query", () => {
    const index = buildSearchIndex(
      [{ path: "rules/codex/healing.md", page: healingPage }],
      [],
    );

    expect(search(index, "")).toEqual([]);
  });
});
