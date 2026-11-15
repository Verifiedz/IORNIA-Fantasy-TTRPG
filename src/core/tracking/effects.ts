import type { Effect, TrackingState } from "../schemas/tracking";

export function addEffect(state: TrackingState, effect: Effect): TrackingState {
  return { ...state, effects: [...state.effects, effect] };
}

export function removeEffect(state: TrackingState, name: string): TrackingState {
  return { ...state, effects: state.effects.filter((effect) => effect.name !== name) };
}

export function tickEffects(state: TrackingState): TrackingState {
  const effects = state.effects
    .map((effect) =>
      effect.turnsLeft === undefined
        ? effect
        : { ...effect, turnsLeft: Math.max(0, effect.turnsLeft - 1) },
    )
    .filter((effect) => effect.turnsLeft === undefined || effect.turnsLeft > 0);
  return { ...state, effects };
}
