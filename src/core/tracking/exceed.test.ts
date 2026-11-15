import { describe, expect, it } from "vitest";
import { burnExceed, newEncounter } from "./exceed";
import { baseTrackingState } from "./testFixtures";

describe("burnExceed", () => {
  it("breaks one seal at a time, up to 3", () => {
    let state = baseTrackingState({ exceed: { used: 0 } });
    for (const expected of [1, 2, 3]) {
      const result = burnExceed(state);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.state.exceed.used).toBe(expected);
        state = result.state;
      }
    }
  });

  it("refuses a 4th burn", () => {
    const result = burnExceed(baseTrackingState({ exceed: { used: 3 } }));
    expect(result.ok).toBe(false);
  });
});

describe("newEncounter", () => {
  it("restores all three Exceed slots and the Plot Point gate", () => {
    const state = baseTrackingState({
      exceed: { used: 3 },
      plotPointSpentThisEncounter: true,
    });
    const result = newEncounter(state);
    expect(result.exceed.used).toBe(0);
    expect(result.plotPointSpentThisEncounter).toBe(false);
  });
});
