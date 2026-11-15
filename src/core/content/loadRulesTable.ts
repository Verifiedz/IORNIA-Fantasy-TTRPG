import { parse as parseYaml } from "yaml";
import { rulesTableSchema, type RulesTable } from "../schemas/rulesTable";
import { toErrorMessage, type ContentResult } from "./result";

export function loadRulesTable(file: string, raw: string): ContentResult<RulesTable> {
  let data: unknown;
  try {
    data = parseYaml(raw);
  } catch (err) {
    return { ok: false, error: { file, message: toErrorMessage(err) } };
  }

  const result = rulesTableSchema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      error: {
        file,
        message: issue?.message ?? "Invalid rules table",
        field: issue?.path.join("."),
      },
    };
  }

  return { ok: true, value: result.data };
}
