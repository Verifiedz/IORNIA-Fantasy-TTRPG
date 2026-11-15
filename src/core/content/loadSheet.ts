import { parse as parseYaml } from "yaml";
import { sheetSchema, type Sheet } from "../schemas/sheet";
import { toErrorMessage, type ContentResult } from "./result";

export function loadSheet(file: string, raw: string): ContentResult<Sheet> {
  let data: unknown;
  try {
    data = parseYaml(raw);
  } catch (err) {
    return { ok: false, error: { file, message: toErrorMessage(err) } };
  }

  const result = sheetSchema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      error: {
        file,
        message: issue?.message ?? "Invalid sheet.yaml",
        field: issue?.path.join("."),
      },
    };
  }

  return { ok: true, value: result.data };
}
