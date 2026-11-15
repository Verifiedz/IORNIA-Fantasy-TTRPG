import { z } from "zod";

// Generic frontmatter shape for Phase 0's single sample document. Section
// schemas (character, lore event, rule page, etc.) replace this in the
// phases that own them — this only needs to prove the content pipeline.
export const docFrontmatterSchema = z.object({
  schema: z.literal(1),
  title: z.string().min(1),
  date: z.string().optional(),
});

export type DocFrontmatter = z.infer<typeof docFrontmatterSchema>;

export interface Doc {
  frontmatter: DocFrontmatter;
  body: string;
}
