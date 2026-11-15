import matter from "gray-matter";
import { wikiEntrySchema, type WikiEntry } from "../schemas/wikiEntry";
import { toErrorMessage, type ContentResult } from "./result";

export function loadWikiEntry(file: string, raw: string): ContentResult<WikiEntry> {
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw);
  } catch (err) {
    return { ok: false, error: { file, message: toErrorMessage(err) } };
  }

  const result = wikiEntrySchema.safeParse(parsed.data);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      error: {
        file,
        message: issue?.message ?? "Invalid wiki entry front matter",
        field: issue?.path.join("."),
      },
    };
  }

  return {
    ok: true,
    value: { frontmatter: result.data, body: parsed.content.trim() },
  };
}
