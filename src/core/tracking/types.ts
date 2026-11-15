import type { TrackingState } from "../schemas/tracking";

export type TrackingActionResult =
  | { ok: true; state: TrackingState }
  | { ok: false; state: TrackingState; reason: string };
