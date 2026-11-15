import matter from "gray-matter";
import { codexPageSchema, type CodexPage } from "../schemas/codexPage";
import { toErrorMessage, type ContentResult } from "./result";

export function loadCodexPage(file: string, raw: string): ContentResult<CodexPage> {
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw);
  } catch (err) {
    return { ok: false, error: { file, message: toErrorMessage(err) } };
  }

  const result = codexPageSchema.safeParse(parsed.data);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      error: {
        file,
        message: issue?.message ?? "Invalid codex page front matter",
        field: issue?.path.join("."),
      },
    };
  }

  return {
    ok: true,
    value: { frontmatter: result.data, body: parsed.content.trim() },
  };
}
