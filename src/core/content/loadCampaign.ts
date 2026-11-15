import { parse as parseYaml } from "yaml";
import { campaignSchema, type Campaign } from "../schemas/campaign";
import { toErrorMessage, type ContentResult } from "./result";

export function loadCampaign(file: string, raw: string): ContentResult<Campaign> {
  let data: unknown;
  try {
    data = parseYaml(raw);
  } catch (err) {
    return { ok: false, error: { file, message: toErrorMessage(err) } };
  }

  const result = campaignSchema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      error: {
        file,
        message: issue?.message ?? "Invalid campaign.yaml",
        field: issue?.path.join("."),
      },
    };
  }

  return { ok: true, value: result.data };
}
