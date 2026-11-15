import { describe, expect, it } from "vitest";
import { filterEdges } from "./filterEdges";
import type { RelationshipEdge } from "../schemas/relationshipEdge";

const EDGES: RelationshipEdge[] = [
  { from: "character:thistlewood", to: "faction:ashbrand-company", type: "ally" },
  { from: "character:thistlewood", to: "character:kael", type: "rival" },
  {
    from: "faction:ashbrand-company",
    to: "place:veyra",
    type: "sworn",
    start: "1400-01-01",
    end: "1402-01-01",
  },
];

describe("filterEdges", () => {
  it("returns every edge with no filter", () => {
    expect(filterEdges(EDGES, {})).toHaveLength(3);
  });

  it("filters by type", () => {
    const result = filterEdges(EDGES, { type: "rival" });
    expect(result).toEqual([EDGES[1]]);
  });

  it("filters by centeredOn, matching either side of the edge", () => {
    const result = filterEdges(EDGES, { centeredOn: "faction:ashbrand-company" });
    expect(result).toEqual([EDGES[0], EDGES[2]]);
  });

  it("includes an edge with no date range regardless of asOf", () => {
    const result = filterEdges(EDGES, { asOf: "1900-01-01" });
    expect(result).toContainEqual(EDGES[0]);
    expect(result).toContainEqual(EDGES[1]);
  });

  it("excludes a dated edge before its start", () => {
    const result = filterEdges(EDGES, { asOf: "1399-01-01" });
    expect(result).not.toContainEqual(EDGES[2]);
  });

  it("includes a dated edge within its range", () => {
    const result = filterEdges(EDGES, { asOf: "1401-01-01" });
    expect(result).toContainEqual(EDGES[2]);
  });

  it("excludes a dated edge after its end", () => {
    const result = filterEdges(EDGES, { asOf: "1403-01-01" });
    expect(result).not.toContainEqual(EDGES[2]);
  });

  it("combines multiple filters", () => {
    const result = filterEdges(EDGES, {
      type: "ally",
      centeredOn: "character:thistlewood",
    });
    expect(result).toEqual([EDGES[0]]);
  });
});
