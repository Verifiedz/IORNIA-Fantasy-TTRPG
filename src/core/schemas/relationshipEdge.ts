import { z } from "zod";
import { entityIdSchema } from "./wikiEntry";

export const edgeTypeSchema = z.enum([
  "kin",
  "ally",
  "rival",
  "sworn",
  "debt",
  "secret",
]);

export const relationshipEdgeSchema = z.object({
  from: entityIdSchema,
  to: entityIdSchema,
  type: edgeTypeSchema,
  strength: z.number().positive().optional(),
  note: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
});

export const relationshipsFileSchema = z.object({
  schema: z.literal(1),
  edges: z.array(relationshipEdgeSchema).default([]),
});

export type EdgeType = z.infer<typeof edgeTypeSchema>;
export type RelationshipEdge = z.infer<typeof relationshipEdgeSchema>;
export type RelationshipsFile = z.infer<typeof relationshipsFileSchema>;
