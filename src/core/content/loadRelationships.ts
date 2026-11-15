import { parse as parseYaml } from "yaml";
import {
  relationshipsFileSchema,
  type RelationshipsFile,
} from "../schemas/relationshipEdge";
import { toErrorMessage, type ContentResult } from "./result";

export function loadRelationships(
  file: string,
  raw: string,
): ContentResult<RelationshipsFile> {
  let data: unknown;
  try {
    data = parseYaml(raw);
  } catch (err) {
    return { ok: false, error: { file, message: toErrorMessage(err) } };
  }

  const result = relationshipsFileSchema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      error: {
        file,
        message: issue?.message ?? "Invalid relationships/edges.yaml",
        field: issue?.path.join("."),
      },
    };
  }

  return { ok: true, value: result.data };
}
