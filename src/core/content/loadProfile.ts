import { parse as parseYaml } from "yaml";
import { profileSchema, type Profile } from "../schemas/profile";
import { toErrorMessage, type ContentResult } from "./result";

export function loadProfile(file: string, raw: string): ContentResult<Profile> {
  let data: unknown;
  try {
    data = parseYaml(raw);
  } catch (err) {
    return { ok: false, error: { file, message: toErrorMessage(err) } };
  }

  const result = profileSchema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      error: {
        file,
        message: issue?.message ?? "Invalid profile.yaml",
        field: issue?.path.join("."),
      },
    };
  }

  return { ok: true, value: result.data };
}
