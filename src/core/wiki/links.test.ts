import { describe, expect, it } from "vitest";
import { parseLinks } from "./links";

describe("parseLinks", () => {
  it("finds a plain [[type:slug]] link", () => {
    expect(parseLinks("Raised in [[place:veyra]].")).toEqual([
      { id: "place:veyra", label: undefined },
    ]);
  });

  it("finds a [[type:slug|label]] link with its label", () => {
    expect(parseLinks("Trained under [[character:kael|the old master]].")).toEqual([
      { id: "character:kael", label: "the old master" },
    ]);
  });

  it("finds multiple links in one body", () => {
    const body = "[[place:veyra]] and [[faction:ashbrand-company]] and [[item:ember-blade]]";
    expect(parseLinks(body).map((l) => l.id)).toEqual([
      "place:veyra",
      "faction:ashbrand-company",
      "item:ember-blade",
    ]);
  });

  it("returns an empty list for prose with no links", () => {
    expect(parseLinks("Just ordinary prose.")).toEqual([]);
  });

  it("does not match malformed bracket syntax", () => {
    expect(parseLinks("[not a link] and [[not-an-id]]")).toEqual([]);
  });
});
