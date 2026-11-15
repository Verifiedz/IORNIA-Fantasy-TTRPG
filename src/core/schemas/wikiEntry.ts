import { z } from "zod";

export const wikiEntityTypeSchema = z.enum([
  "character",
  "place",
  "faction",
  "item",
]);

export const entityIdSchema = z
  .string()
  .regex(
    /^(character|place|faction|item):[a-z0-9-]+$/,
    "id must be type:slug, e.g. character:kael",
  );

export const RESERVED_WIKI_KEYS = [
  "schema",
  "id",
  "name",
  "tags",
  "portrait",
  "visibility",
] as const;

export const wikiEntrySchema = z
  .object({
    schema: z.literal(1),
    id: entityIdSchema,
    name: z.string().min(1),
    tags: z.array(z.string()).default([]),
    portrait: z.string().optional(),
    visibility: z.enum(["public", "gm"]).default("public"),
  })
  .passthrough();

export type WikiEntityType = z.infer<typeof wikiEntityTypeSchema>;
export type WikiEntryFrontmatter = z.infer<typeof wikiEntrySchema>;

export interface WikiEntry {
  frontmatter: WikiEntryFrontmatter;
  body: string;
}

export function entityType(id: string): WikiEntityType {
  return id.split(":")[0] as WikiEntityType;
}

export function entitySlug(id: string): string {
  return id.split(":")[1];
}
