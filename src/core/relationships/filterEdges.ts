import type { EdgeType, RelationshipEdge } from "../schemas/relationshipEdge";

export interface EdgeFilter {
  type?: EdgeType;
  // A single entity id. Covers both of DESIGN.md's "faction" and
  // "centred on this character" filters — a faction is just another
  // entity id, so one mechanism serves both UI pickers.
  centeredOn?: string;
  // ISO date string. An edge with no start/end is always active.
  asOf?: string;
}

export function filterEdges(
  edges: RelationshipEdge[],
  filter: EdgeFilter,
): RelationshipEdge[] {
  return edges.filter((edge) => {
    if (filter.type && edge.type !== filter.type) return false;
    if (
      filter.centeredOn &&
      edge.from !== filter.centeredOn &&
      edge.to !== filter.centeredOn
    ) {
      return false;
    }
    if (filter.asOf) {
      if (edge.start && edge.start > filter.asOf) return false;
      if (edge.end && edge.end < filter.asOf) return false;
    }
    return true;
  });
}
