import type { TrackingState } from "../schemas/tracking";

export function baseTrackingState(
  overrides: Partial<TrackingState> = {},
): TrackingState {
  return {
    schema: 1,
    essos: 100,
    reserve: 100,
    hp: 11,
    fp: 11,
    exceed: { used: 0 },
    plotPointSpentThisEncounter: false,
    metaCurrencies: {
      plotPoints: 0,
      flashbackPoints: 0,
      dharma: 0,
      karma: 0,
      wildcardPoints: 0,
    },
    effects: [],
    ...overrides,
  };
}
