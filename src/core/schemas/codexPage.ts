import { z } from "zod";
import { rulesTableStatusSchema } from "./rulesTable";

export const codexPageSchema = z.object({
  schema: z.literal(1),
  title: z.string().min(1),
  status: rulesTableStatusSchema.optional(),
  note: z.string().optional(),
  pinnable: z.boolean().optional().default(false),
});

export type CodexPageFrontmatter = z.infer<typeof codexPageSchema>;

export interface CodexPage {
  frontmatter: CodexPageFrontmatter;
  body: string;
}
