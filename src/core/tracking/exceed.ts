import type { TrackingState } from "../schemas/tracking";
import type { TrackingActionResult } from "./types";

export function burnExceed(state: TrackingState): TrackingActionResult {
  if (state.exceed.used >= 3) {
    return { ok: false, state, reason: "No Exceed slots remaining." };
  }
  return {
    ok: true,
    state: { ...state, exceed: { used: (state.exceed.used + 1) as 1 | 2 | 3 } },
  };
}

export function newEncounter(state: TrackingState): TrackingState {
  return {
    ...state,
    exceed: { used: 0 },
    plotPointSpentThisEncounter: false,
  };
}
