import { useEffect, useMemo, useState } from "react";
import { ReactFlow, Background, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  getRelationships,
  listWikiEntries,
  onRelationshipsChange,
  onWikiChange,
} from "../../content";
import type { WikiIndexPayload } from "../../../preload/api";
import type {
  EdgeType,
  RelationshipsFile,
} from "../../../core/schemas/relationshipEdge";
import { filterEdges } from "../../../core/relationships/filterEdges";
import { buildGraphNodes } from "../../../core/relationships/graph";
import { entityType } from "../../../core/schemas/wikiEntry";
import { computeLayout } from "./layout";
import { EntityNodeView, type EntityNode } from "./EntityNode";

const EDGE_TYPES: EdgeType[] = ["kin", "ally", "rival", "sworn", "debt", "secret"];
const NODE_TYPES = { entity: EntityNodeView };

export function RelationshipWebSection({
  onOpenEntity,
}: {
  onOpenEntity: (id: string) => void;
}) {
  const [wiki, setWiki] = useState<WikiIndexPayload | null>(null);
  const [relationships, setRelationships] = useState<RelationshipsFile | null>(null);
  const [typeFilter, setTypeFilter] = useState<EdgeType | null>(null);
  const [centeredOn, setCenteredOn] = useState<string>("");
  const [asOf, setAsOf] = useState<string>("");

  useEffect(() => {
    const loadWiki = (): void => void listWikiEntries().then(setWiki);
    const loadRelationships = (): void => void getRelationships().then(setRelationships);
    loadWiki();
    loadRelationships();
    const offWiki = onWikiChange(loadWiki);
    const offRelationships = onRelationshipsChange(loadRelationships);
    return () => {
      offWiki();
      offRelationships();
    };
  }, []);

  const filteredEdges = useMemo(() => {
    if (!relationships) return [];
    return filterEdges(relationships.edges, {
      type: typeFilter ?? undefined,
      centeredOn: centeredOn || undefined,
      asOf: asOf || undefined,
    });
  }, [relationships, typeFilter, centeredOn, asOf]);

  const graphNodes = useMemo(
    () => buildGraphNodes(filteredEdges, wiki?.entities ?? {}),
    [filteredEdges, wiki],
  );

  const positioned = useMemo(
    () => computeLayout(graphNodes, filteredEdges),
    [graphNodes, filteredEdges],
  );

  const flowNodes: EntityNode[] = positioned.map((node) => ({
    id: node.id,
    type: "entity",
    position: { x: node.x, y: node.y },
    data: {
      label: node.name,
      entityType: node.type,
      portraitUrl: node.portrait
        ? `iornia://${entityType(node.id)}s/${node.id.split(":")[1]}/${node.portrait}`
        : undefined,
    },
  }));

  const flowEdges: Edge[] = filteredEdges.map((edge, i) => ({
    id: `${edge.from}-${edge.to}-${i}`,
    source: edge.from,
    target: edge.to,
    label: edge.type,
    style: { strokeWidth: edge.strength ?? 1 },
  }));

  if (!wiki || !relationships) {
    return <p className="p-6 text-parchment-dark">Loading…</p>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-gold/20 p-3">
        <h1 className="font-display text-xl text-gold-bright">Relationship Web</h1>

        <select
          value={typeFilter ?? ""}
          onChange={(event) => setTypeFilter((event.target.value || null) as EdgeType | null)}
          className="rounded border border-gold/30 bg-night-deep px-2 py-1 text-sm text-parchment"
        >
          <option value="">All types</option>
          {EDGE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={centeredOn}
          onChange={(event) => setCenteredOn(event.target.value)}
          className="rounded border border-gold/30 bg-night-deep px-2 py-1 text-sm text-parchment"
        >
          <option value="">Center on…</option>
          {Object.values(wiki.entities).map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.frontmatter.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-1 text-sm text-parchment-dark">
          As of
          <input
            type="date"
            value={asOf}
            onChange={(event) => setAsOf(event.target.value)}
            className="rounded border border-gold/30 bg-night-deep px-2 py-1 text-sm text-parchment"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1">
        {flowNodes.length === 0 ? (
          <p className="p-6 text-parchment-dark">
            No relationships match this filter.
          </p>
        ) : (
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={NODE_TYPES}
            onNodeClick={(_event, node) => onOpenEntity(node.id)}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
