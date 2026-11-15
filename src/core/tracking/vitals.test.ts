import { describe, expect, it } from "vitest";
import { adjustFp, adjustHp, vitalStatus } from "./vitals";
import { baseTrackingState } from "./testFixtures";

describe("adjustHp / adjustFp", () => {
  it("applies a positive or negative delta", () => {
    const state = baseTrackingState({ hp: 11, fp: 11 });
    expect(adjustHp(state, -5).hp).toBe(6);
    expect(adjustFp(state, -5).fp).toBe(6);
    expect(adjustHp(state, 3).hp).toBe(14);
  });

  it("allows HP/FP to go negative, as GURPS allows", () => {
    const state = baseTrackingState({ hp: 2 });
    expect(adjustHp(state, -5).hp).toBe(-3);
  });
});

describe("vitalStatus", () => {
  it("flags bloodied at or below 1/3 of max", () => {
    expect(vitalStatus(4, 12).bloodied).toBe(true); // exactly 1/3
    expect(vitalStatus(5, 12).bloodied).toBe(false);
  });

  it("flags critical at or below 0", () => {
    expect(vitalStatus(0, 12).critical).toBe(true);
    expect(vitalStatus(-3, 12).critical).toBe(true);
    expect(vitalStatus(1, 12).critical).toBe(false);
  });
});
