import { describe, expect, it } from "vitest";
import { extractInfobox } from "./infobox";
import type { WikiEntryFrontmatter } from "../schemas/wikiEntry";

describe("extractInfobox", () => {
  it("strips the reserved keys and keeps everything else", () => {
    const frontmatter: WikiEntryFrontmatter = {
      schema: 1,
      id: "character:kael",
      name: "Kael Varros",
      tags: ["essos-user"],
      portrait: "portrait.webp",
      visibility: "public",
      kind: "pc",
      player: "ahad",
    };

    expect(extractInfobox(frontmatter)).toEqual([
      { key: "kind", value: "pc" },
      { key: "player", value: "ahad" },
    ]);
  });

  it("stringifies array and nullish extra values", () => {
    const frontmatter: WikiEntryFrontmatter = {
      schema: 1,
      id: "place:veyra",
      name: "Veyra",
      tags: [],
      visibility: "public",
      region: ["Ashlands", "Coast"],
      founded: null,
    };

    expect(extractInfobox(frontmatter)).toEqual([
      { key: "region", value: "Ashlands, Coast" },
      { key: "founded", value: "" },
    ]);
  });
});
