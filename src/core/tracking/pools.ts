import type { TrackingState } from "../schemas/tracking";
import type { TrackingActionResult } from "./types";

export type Pool = "essos" | "reserve";

export function spend(
  state: TrackingState,
  pool: Pool,
  amount: number,
): TrackingActionResult {
  if (amount < 0) {
    return { ok: false, state, reason: "Amount must be non-negative." };
  }
  const current = state[pool];
  if (amount > current) {
    return {
      ok: false,
      state,
      reason: `Not enough ${pool} (${current} available, ${amount} requested).`,
    };
  }
  return { ok: true, state: { ...state, [pool]: current - amount } };
}

export function gainEssos(
  state: TrackingState,
  amount: number,
): TrackingActionResult {
  if (amount < 0) {
    return { ok: false, state, reason: "Amount must be non-negative." };
  }
  return { ok: true, state: { ...state, essos: Math.min(100, state.essos + amount) } };
}

export interface ResetFromReserveOptions {
  // Named per CLAUDE.md so flipping this house rule later is a one-line
  // change at call sites, not a rewrite. Default matches the decision
  // confirmed with the user: reset is allowed any time Reserve >= 25.
  resetRequiresEmptyEssos?: boolean;
}

export function resetFromReserve(
  state: TrackingState,
  options: ResetFromReserveOptions = {},
): TrackingActionResult {
  const requireEmptyEssos = options.resetRequiresEmptyEssos ?? false;

  if (state.reserve < 25) {
    return { ok: false, state, reason: "Reserve must be at least 25 to reset." };
  }
  if (requireEmptyEssos && state.essos > 0) {
    return {
      ok: false,
      state,
      reason: "Essos must be at 0 before resetting from Reserve.",
    };
  }
  return { ok: true, state: { ...state, essos: 100, reserve: state.reserve - 25 } };
}

export function longRest(state: TrackingState): TrackingState {
  return { ...state, essos: 100, reserve: 100 };
}

export function medicalTreatment(
  state: TrackingState,
  value: number,
): TrackingActionResult {
  if (value < 0 || value > 100) {
    return { ok: false, state, reason: "Reserve must be between 0 and 100." };
  }
  return { ok: true, state: { ...state, reserve: value } };
}

export function isDepleted(state: TrackingState): boolean {
  return state.reserve === 0;
}
