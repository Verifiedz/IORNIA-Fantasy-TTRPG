import type { TrackingState } from "../schemas/tracking";
import type { TrackingActionResult } from "./types";

export const KARMA_CAP = 108;
export const KARMA_WARNING_MARGIN = 10;

export type GainableCurrency =
  | "plotPoints"
  | "flashbackPoints"
  | "dharma"
  | "wildcardPoints";

export function gainMetaCurrency(
  state: TrackingState,
  currency: GainableCurrency,
  amount: number,
): TrackingActionResult {
  if (amount < 0) {
    return { ok: false, state, reason: "Amount must be non-negative." };
  }
  return {
    ok: true,
    state: {
      ...state,
      metaCurrencies: {
        ...state.metaCurrencies,
        [currency]: state.metaCurrencies[currency] + amount,
      },
    },
  };
}

export function spendPlotPoint(state: TrackingState): TrackingActionResult {
  if (state.plotPointSpentThisEncounter) {
    return {
      ok: false,
      state,
      reason: "Only one Plot Point may be spent per combat.",
    };
  }
  if (state.metaCurrencies.plotPoints < 1) {
    return { ok: false, state, reason: "No Plot Points available." };
  }
  return {
    ok: true,
    state: {
      ...state,
      metaCurrencies: {
        ...state.metaCurrencies,
        plotPoints: state.metaCurrencies.plotPoints - 1,
      },
      plotPointSpentThisEncounter: true,
    },
  };
}

export function spendFlashbackPoint(
  state: TrackingState,
  inCombat: boolean,
): TrackingActionResult {
  const cost = inCombat ? 2 : 1;
  if (state.metaCurrencies.flashbackPoints < cost) {
    return {
      ok: false,
      state,
      reason: `Need ${cost} Flashback Points (have ${state.metaCurrencies.flashbackPoints}).`,
    };
  }
  return {
    ok: true,
    state: {
      ...state,
      metaCurrencies: {
        ...state.metaCurrencies,
        flashbackPoints: state.metaCurrencies.flashbackPoints - cost,
      },
    },
  };
}

export interface SpendDharmaResult {
  ok: true;
  state: TrackingState;
  nearKarmaCap: boolean;
}

export function spendDharma(
  state: TrackingState,
  amount: number,
): SpendDharmaResult | { ok: false; state: TrackingState; reason: string } {
  if (amount <= 0) {
    return { ok: false, state, reason: "Amount must be positive." };
  }
  if (state.metaCurrencies.dharma < amount) {
    return { ok: false, state, reason: "Not enough Dharma." };
  }
  const karma = state.metaCurrencies.karma + amount;
  return {
    ok: true,
    state: {
      ...state,
      metaCurrencies: {
        ...state.metaCurrencies,
        dharma: state.metaCurrencies.dharma - amount,
        karma,
      },
    },
    nearKarmaCap: karma >= KARMA_CAP - KARMA_WARNING_MARGIN,
  };
}

export function spendWildcardPoint(
  state: TrackingState,
  amount = 1,
): TrackingActionResult {
  if (amount <= 0) {
    return { ok: false, state, reason: "Amount must be positive." };
  }
  if (state.metaCurrencies.wildcardPoints < amount) {
    return { ok: false, state, reason: "Not enough Wildcard Points." };
  }
  return {
    ok: true,
    state: {
      ...state,
      metaCurrencies: {
        ...state.metaCurrencies,
        wildcardPoints: state.metaCurrencies.wildcardPoints - amount,
      },
    },
  };
}
