import { describe, expect, it } from "vitest";
import {
  KARMA_CAP,
  gainMetaCurrency,
  spendDharma,
  spendFlashbackPoint,
  spendPlotPoint,
  spendWildcardPoint,
} from "./metaCurrencies";
import { baseTrackingState } from "./testFixtures";

describe("gainMetaCurrency", () => {
  it("adds to the running total", () => {
    const result = gainMetaCurrency(
      baseTrackingState({ metaCurrencies: { ...baseTrackingState().metaCurrencies, dharma: 2 } }),
      "dharma",
      3,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.metaCurrencies.dharma).toBe(5);
  });
});

describe("spendPlotPoint", () => {
  it("spends one and sets the per-encounter gate", () => {
    const state = baseTrackingState({
      metaCurrencies: { ...baseTrackingState().metaCurrencies, plotPoints: 2 },
    });
    const result = spendPlotPoint(state);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.metaCurrencies.plotPoints).toBe(1);
      expect(result.state.plotPointSpentThisEncounter).toBe(true);
    }
  });

  it("refuses a second spend in the same encounter even with points available", () => {
    const state = baseTrackingState({
      metaCurrencies: { ...baseTrackingState().metaCurrencies, plotPoints: 5 },
      plotPointSpentThisEncounter: true,
    });
    const result = spendPlotPoint(state);
    expect(result.ok).toBe(false);
  });

  it("refuses when none are available", () => {
    const result = spendPlotPoint(baseTrackingState());
    expect(result.ok).toBe(false);
  });
});

describe("spendFlashbackPoint", () => {
  it("costs 2 in combat", () => {
    const state = baseTrackingState({
      metaCurrencies: { ...baseTrackingState().metaCurrencies, flashbackPoints: 2 },
    });
    const result = spendFlashbackPoint(state, true);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.metaCurrencies.flashbackPoints).toBe(0);
  });

  it("costs 1 outside combat", () => {
    const state = baseTrackingState({
      metaCurrencies: { ...baseTrackingState().metaCurrencies, flashbackPoints: 1 },
    });
    const result = spendFlashbackPoint(state, false);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.metaCurrencies.flashbackPoints).toBe(0);
  });

  it("refuses when the context-appropriate cost can't be paid", () => {
    const state = baseTrackingState({
      metaCurrencies: { ...baseTrackingState().metaCurrencies, flashbackPoints: 1 },
    });
    const result = spendFlashbackPoint(state, true); // needs 2, has 1
    expect(result.ok).toBe(false);
  });
});

describe("spendDharma", () => {
  it("increases karma by the amount spent", () => {
    const state = baseTrackingState({
      metaCurrencies: { ...baseTrackingState().metaCurrencies, dharma: 5, karma: 10 },
    });
    const result = spendDharma(state, 3);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.metaCurrencies.dharma).toBe(2);
      expect(result.state.metaCurrencies.karma).toBe(13);
      expect(result.nearKarmaCap).toBe(false);
    }
  });

  it("flags nearKarmaCap as karma approaches 108", () => {
    const state = baseTrackingState({
      metaCurrencies: { ...baseTrackingState().metaCurrencies, dharma: 5, karma: KARMA_CAP - 5 },
    });
    const result = spendDharma(state, 1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.nearKarmaCap).toBe(true);
  });

  it("refuses spending more dharma than is available", () => {
    const state = baseTrackingState({
      metaCurrencies: { ...baseTrackingState().metaCurrencies, dharma: 1 },
    });
    const result = spendDharma(state, 5);
    expect(result.ok).toBe(false);
  });
});

describe("spendWildcardPoint", () => {
  it("spends without touching karma", () => {
    const state = baseTrackingState({
      metaCurrencies: { ...baseTrackingState().metaCurrencies, wildcardPoints: 2, karma: 10 },
    });
    const result = spendWildcardPoint(state);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.metaCurrencies.wildcardPoints).toBe(1);
      expect(result.state.metaCurrencies.karma).toBe(10);
    }
  });

  it("refuses when none are available", () => {
    const result = spendWildcardPoint(baseTrackingState());
    expect(result.ok).toBe(false);
  });
});
