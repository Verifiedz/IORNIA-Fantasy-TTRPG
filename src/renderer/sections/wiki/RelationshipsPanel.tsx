import { useEffect, useState } from "react";
import { getRelationships, onRelationshipsChange } from "../../content";
import { filterEdges } from "../../../core/relationships/filterEdges";
import type { RelationshipEdge } from "../../../core/schemas/relationshipEdge";
import type { WikiIndexPayload } from "../../../preload/api";

// DESIGN.md's "every wiki page shows that entity's slice of the web" —
// a list here, not a mini-graph; the dedicated Relationship Web section
// is where the actual graph lives.
export function RelationshipsPanel({
  id,
  entities,
  onNavigate,
}: {
  id: string;
  entities: WikiIndexPayload["entities"];
  onNavigate: (id: string) => void;
}) {
  const [edges, setEdges] = useState<RelationshipEdge[]>([]);

  useEffect(() => {
    const load = (): void => {
      void getRelationships().then((file) =>
        setEdges(filterEdges(file.edges, { centeredOn: id })),
      );
    };
    load();
    return onRelationshipsChange(load);
  }, [id]);

  return (
    <div className="mt-6">
      <h2 className="font-display text-gold">Relationships</h2>
      {edges.length === 0 ? (
        <p className="text-sm text-parchment-dark">No known relationships yet.</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {edges.map((edge, i) => {
            const otherId = edge.from === id ? edge.to : edge.from;
            return (
              <li key={`${otherId}-${i}`} className="text-sm">
                <span className="uppercase text-gold">{edge.type}</span>{" "}
                <button onClick={() => onNavigate(otherId)} className="text-gold hover:underline">
                  {entities[otherId]?.frontmatter.name ?? otherId}
                </button>
                {edge.note && <span className="ml-2 text-parchment-dark">{edge.note}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
