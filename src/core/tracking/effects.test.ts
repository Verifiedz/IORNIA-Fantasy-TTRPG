import { describe, expect, it } from "vitest";
import { addEffect, removeEffect, tickEffects } from "./effects";
import { baseTrackingState } from "./testFixtures";

describe("addEffect / removeEffect", () => {
  it("adds and removes by name", () => {
    let state = addEffect(baseTrackingState(), { name: "Bloodied" });
    expect(state.effects).toHaveLength(1);
    state = removeEffect(state, "Bloodied");
    expect(state.effects).toHaveLength(0);
  });

  it("allows free-text effects alongside presets", () => {
    const state = addEffect(baseTrackingState(), {
      name: "Hexed by the Thornwitch",
      note: "Free-text, not a conditions.yaml preset.",
      turnsLeft: 3,
    });
    expect(state.effects[0].turnsLeft).toBe(3);
  });
});

describe("tickEffects", () => {
  it("decrements turnsLeft and drops effects that hit 0", () => {
    const state = baseTrackingState({
      effects: [
        { name: "Stunned", turnsLeft: 1 },
        { name: "Blessed", turnsLeft: 3 },
        { name: "Marked" }, // no turnsLeft: never auto-expires
      ],
    });
    const ticked = tickEffects(state);
    expect(ticked.effects.map((e) => e.name)).toEqual(["Blessed", "Marked"]);
    expect(ticked.effects.find((e) => e.name === "Blessed")?.turnsLeft).toBe(2);
  });
});
