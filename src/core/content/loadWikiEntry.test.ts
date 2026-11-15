import { describe, expect, it } from "vitest";
import { loadWikiEntry } from "./loadWikiEntry";

const VALID_MD = `---
schema: 1
id: character:kael
name: Kael Varros
tags: [essos-user, trial-contestant]
portrait: portrait.webp
visibility: public
kind: pc
player: ahad
---
Raised in the ash markets of [[place:veyra]], Kael grew up fast.
`;

describe("loadWikiEntry", () => {
  it("parses a valid wiki entry, keeping extra fields for the infobox", () => {
    const result = loadWikiEntry("characters/kael/kael.md", VALID_MD);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.frontmatter.id).toBe("character:kael");
      expect(result.value.frontmatter.tags).toEqual([
        "essos-user",
        "trial-contestant",
      ]);
      expect(result.value.frontmatter.kind).toBe("pc");
      expect(result.value.body).toContain("[[place:veyra]]");
    }
  });

  it("defaults tags and visibility when omitted", () => {
    const result = loadWikiEntry(
      "places/veyra/veyra.md",
      "---\nschema: 1\nid: place:veyra\nname: Veyra\n---\nA city of ash.\n",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.frontmatter.tags).toEqual([]);
      expect(result.value.frontmatter.visibility).toBe("public");
    }
  });

  it("rejects an id that doesn't match type:slug", () => {
    const result = loadWikiEntry(
      "characters/kael/kael.md",
      "---\nschema: 1\nid: not-an-entity-id\nname: Kael\n---\nBody.\n",
    );

    expect(result.ok).toBe(false);
  });

  it("rejects an unknown entity type in the id", () => {
    const result = loadWikiEntry(
      "characters/kael/kael.md",
      "---\nschema: 1\nid: monster:kael\nname: Kael\n---\nBody.\n",
    );

    expect(result.ok).toBe(false);
  });

  it("reports malformed front matter without throwing", () => {
    const result = loadWikiEntry(
      "characters/kael/kael.md",
      "---\nid: [unclosed\n---\nBody.\n",
    );

    expect(result.ok).toBe(false);
  });
});
