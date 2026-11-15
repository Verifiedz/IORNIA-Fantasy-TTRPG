import type { RelationshipEdge } from "../schemas/relationshipEdge";
import { entityType, type WikiEntityType } from "../schemas/wikiEntry";
import type { WikiEntity } from "../wiki";

export interface GraphNode {
  id: string;
  type: WikiEntityType;
  name: string;
  portrait?: string;
}

// Pure: the graph shows whichever entities actually appear in the
// (already-filtered) edge list, not every wiki entity — phase 3's wiki
// is the full browser, this is a graph of relationships.
export function buildGraphNodes(
  edges: RelationshipEdge[],
  entities: Record<string, WikiEntity>,
): GraphNode[] {
  const ids = new Set<string>();
  for (const edge of edges) {
    ids.add(edge.from);
    ids.add(edge.to);
  }

  return [...ids].map((id) => {
    const entity = entities[id];
    return {
      id,
      type: entityType(id),
      name: entity?.frontmatter.name ?? id,
      portrait: entity?.frontmatter.portrait,
    };
  });
}
