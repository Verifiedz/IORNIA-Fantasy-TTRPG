import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { FactionCrest } from "../../design/components/FactionCrest";

export interface EntityNodeData {
  label: string;
  entityType: string;
  // Precomputed by the caller, which has the entity's slug — the node
  // only knows its display name, not its id.
  portraitUrl?: string;
  [key: string]: unknown;
}

export type EntityNode = Node<EntityNodeData, "entity">;

export function EntityNodeView({ data }: NodeProps<EntityNode>) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      {data.entityType === "faction" ? (
        <FactionCrest name={data.label} />
      ) : data.portraitUrl ? (
        <img
          src={data.portraitUrl}
          alt=""
          className="h-10 w-10 rounded-full border-2 border-gold object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold bg-night-deep text-xs text-gold">
          {data.label.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="whitespace-nowrap rounded bg-night-deep px-1.5 py-0.5 text-xs text-parchment">
        {data.label}
      </span>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
