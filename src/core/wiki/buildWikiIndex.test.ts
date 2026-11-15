import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index";
import type { WikiEntry } from "../schemas/wikiEntry";

function entry(id: string, name: string, body: string): WikiEntry {
  return {
    frontmatter: { schema: 1, id, name, tags: [], visibility: "public" },
    body,
  };
}

describe("buildWikiIndex", () => {
  it("indexes every entity by id", () => {
    const index = buildWikiIndex([
      { path: "places/veyra/veyra.md", entry: entry("place:veyra", "Veyra", "") },
    ]);
    expect(index.entities.get("place:veyra")?.frontmatter.name).toBe("Veyra");
  });

  it("computes a backlink when a page links to an existing entity", () => {
    const index = buildWikiIndex([
      {
        path: "characters/kael/kael.md",
        entry: entry("character:kael", "Kael", "Raised in [[place:veyra]]."),
      },
      { path: "places/veyra/veyra.md", entry: entry("place:veyra", "Veyra", "A city.") },
    ]);

    expect(index.backlinks.get("place:veyra")).toEqual(["character:kael"]);
    expect(index.brokenLinks).toEqual([]);
  });

  it("does not duplicate a backlink from the same source linking twice", () => {
    const index = buildWikiIndex([
      {
        path: "characters/kael/kael.md",
        entry: entry(
          "character:kael",
          "Kael",
          "Born in [[place:veyra]], later returned to [[place:veyra|Veyra]].",
        ),
      },
      { path: "places/veyra/veyra.md", entry: entry("place:veyra", "Veyra", "") },
    ]);

    expect(index.backlinks.get("place:veyra")).toEqual(["character:kael"]);
  });

  it("collects a broken link instead of throwing", () => {
    const index = buildWikiIndex([
      {
        path: "characters/kael/kael.md",
        entry: entry("character:kael", "Kael", "Sworn enemy of [[character:nobody]]."),
      },
    ]);

    expect(index.brokenLinks).toEqual([
      { from: "character:kael", to: "character:nobody", label: undefined },
    ]);
  });
});
