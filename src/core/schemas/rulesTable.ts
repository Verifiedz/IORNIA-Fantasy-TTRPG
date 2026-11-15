import { z } from "zod";

export const rulesTableStatusSchema = z.enum([
  "open-question",
  "rework",
  "placeholder",
  "deprecated",
]);

export const rulesTableSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  columns: z.array(z.string().min(1)).min(1),
  rows: z.array(z.array(z.string())).default([]),
  status: rulesTableStatusSchema.optional(),
  note: z.string().optional(),
});

export const rulesTableKindSchema = z.enum([
  "maneuvers",
  "conditions",
  "modifiers",
  "essos",
  "exceed",
  "hit-locations",
  "xp",
]);

export const rulesTableSchema = z.object({
  schema: z.literal(1),
  kind: rulesTableKindSchema,
  sections: z.array(rulesTableSectionSchema).min(1),
});

export type RulesTableStatus = z.infer<typeof rulesTableStatusSchema>;
export type RulesTableSection = z.infer<typeof rulesTableSectionSchema>;
export type RulesTableKind = z.infer<typeof rulesTableKindSchema>;
export type RulesTable = z.infer<typeof rulesTableSchema>;
