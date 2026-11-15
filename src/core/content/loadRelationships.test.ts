import { describe, expect, it } from "vitest";
import { loadRelationships } from "./loadRelationships";

const VALID_YAML = `
schema: 1
edges:
  - from: character:thistlewood
    to: faction:ashbrand-company
    type: ally
    strength: 2
    note: Left on good terms.
    start: "1402-03-01"
    end: "1402-09-01"
`;

describe("loadRelationships", () => {
  it("parses a valid edges.yaml", () => {
    const result = loadRelationships("relationships/edges.yaml", VALID_YAML);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.edges).toHaveLength(1);
      expect(result.value.edges[0].type).toBe("ally");
    }
  });

  it("defaults edges to an empty list when omitted", () => {
    const result = loadRelationships("relationships/edges.yaml", "schema: 1\n");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.edges).toEqual([]);
  });

  it("rejects an unknown edge type", () => {
    const result = loadRelationships(
      "relationships/edges.yaml",
      "schema: 1\nedges:\n  - from: character:a\n    to: character:b\n    type: nemesis\n",
    );

    expect(result.ok).toBe(false);
  });

  it("rejects an id that isn't type:slug", () => {
    const result = loadRelationships(
      "relationships/edges.yaml",
      "schema: 1\nedges:\n  - from: not-an-id\n    to: character:b\n    type: ally\n",
    );

    expect(result.ok).toBe(false);
  });

  it("reports malformed YAML without throwing", () => {
    const result = loadRelationships("relationships/edges.yaml", "edges: [unclosed\n");

    expect(result.ok).toBe(false);
  });
});
