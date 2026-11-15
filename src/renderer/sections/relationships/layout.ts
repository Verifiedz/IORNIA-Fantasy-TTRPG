import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationNodeDatum,
} from "d3-force";
import type { GraphNode } from "../../../core/relationships/graph";
import type { RelationshipEdge } from "../../../core/schemas/relationshipEdge";

export type PositionedNode = GraphNode & { x: number; y: number };

type SimNode = GraphNode & SimulationNodeDatum;

// Runs the simulation to completion synchronously and returns the final
// positions — no animated settling this phase (see the spec's deferred
// motion pass), just the computed layout.
export function computeLayout(
  nodes: GraphNode[],
  edges: RelationshipEdge[],
  width = 800,
  height = 600,
): PositionedNode[] {
  const simNodes: SimNode[] = nodes.map((node) => ({ ...node }));
  const links = edges.map((edge) => ({ source: edge.from, target: edge.to }));

  const simulation = forceSimulation(simNodes)
    .force(
      "link",
      forceLink<SimNode, { source: string; target: string }>(links)
        .id((node) => node.id)
        .distance(140),
    )
    .force("charge", forceManyBody().strength(-300))
    .force("center", forceCenter(width / 2, height / 2))
    .force("collide", forceCollide(40))
    .stop();

  for (let i = 0; i < 300; i++) simulation.tick();

  return simNodes.map((node) => ({ ...node, x: node.x ?? 0, y: node.y ?? 0 }));
}
