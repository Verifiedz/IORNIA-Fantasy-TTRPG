import { describe, expect, it } from "vitest";
import { buildGraphNodes } from "./graph";
import type { RelationshipEdge } from "../schemas/relationshipEdge";
import type { WikiEntity } from "../wiki";

const ENTITIES: Record<string, WikiEntity> = {
  "character:thistlewood": {
    id: "character:thistlewood",
    path: "characters/thistlewood/thistlewood.md",
    frontmatter: {
      schema: 1,
      id: "character:thistlewood",
      name: "Thistlewood",
      tags: [],
      visibility: "public",
      portrait: "portrait.webp",
    },
    body: "",
  },
  "faction:ashbrand-company": {
    id: "faction:ashbrand-company",
    path: "factions/ashbrand-company/ashbrand-company.md",
    frontmatter: {
      schema: 1,
      id: "faction:ashbrand-company",
      name: "The Ashbrand Company",
      tags: [],
      visibility: "public",
    },
    body: "",
  },
};

describe("buildGraphNodes", () => {
  it("derives one node per entity referenced by the edge list", () => {
    const edges: RelationshipEdge[] = [
      { from: "character:thistlewood", to: "faction:ashbrand-company", type: "ally" },
    ];

    const nodes = buildGraphNodes(edges, ENTITIES);
    expect(nodes).toHaveLength(2);
    expect(nodes.find((n) => n.id === "character:thistlewood")).toEqual({
      id: "character:thistlewood",
      type: "character",
      name: "Thistlewood",
      portrait: "portrait.webp",
    });
    expect(nodes.find((n) => n.id === "faction:ashbrand-company")?.type).toBe("faction");
  });

  it("deduplicates an entity that appears in multiple edges", () => {
    const edges: RelationshipEdge[] = [
      { from: "character:thistlewood", to: "faction:ashbrand-company", type: "ally" },
      { from: "character:thistlewood", to: "faction:ashbrand-company", type: "rival" },
    ];

    expect(buildGraphNodes(edges, ENTITIES)).toHaveLength(2);
  });

  it("falls back to the raw id when the entity isn't in the wiki index", () => {
    const edges: RelationshipEdge[] = [
      { from: "character:nobody", to: "character:thistlewood", type: "kin" },
    ];

    const nodes = buildGraphNodes(edges, ENTITIES);
    const missing = nodes.find((n) => n.id === "character:nobody");
    expect(missing).toEqual({
      id: "character:nobody",
      type: "character",
      name: "character:nobody",
      portrait: undefined,
    });
  });
});
