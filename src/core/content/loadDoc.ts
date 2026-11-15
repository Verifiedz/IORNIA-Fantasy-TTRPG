import matter from "gray-matter";
import { docFrontmatterSchema, type Doc } from "../schemas/doc";
import { toErrorMessage, type ContentResult } from "./result";

export function loadDoc(file: string, raw: string): ContentResult<Doc> {
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw);
  } catch (err) {
    return { ok: false, error: { file, message: toErrorMessage(err) } };
  }

  const result = docFrontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      error: {
        file,
        message: issue?.message ?? "Invalid front matter",
        field: issue?.path.join("."),
      },
    };
  }

  return {
    ok: true,
    value: { frontmatter: result.data, body: parsed.content.trim() },
  };
}
