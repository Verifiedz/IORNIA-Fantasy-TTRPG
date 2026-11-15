import { trackingSchema, type TrackingState } from "../schemas/tracking";
import { toErrorMessage, type ContentResult } from "./result";

export function loadTracking(
  file: string,
  raw: string,
): ContentResult<TrackingState> {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    return { ok: false, error: { file, message: toErrorMessage(err) } };
  }

  const result = trackingSchema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    return {
      ok: false,
      error: {
        file,
        message: issue?.message ?? "Invalid tracking.json",
        field: issue?.path.join("."),
      },
    };
  }

  return { ok: true, value: result.data };
}
