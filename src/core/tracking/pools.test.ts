import { describe, expect, it } from "vitest";
import {
  gainEssos,
  isDepleted,
  longRest,
  medicalTreatment,
  resetFromReserve,
  spend,
} from "./pools";
import { baseTrackingState as baseState } from "./testFixtures";

describe("spend", () => {
  it("deducts from the given pool when enough is available", () => {
    const result = spend(baseState({ essos: 100 }), "essos", 40);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.essos).toBe(60);
  });

  it("refuses, never clamps, when the amount exceeds the current value", () => {
    const state = baseState({ essos: 20 });
    const result = spend(state, "essos", 40);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state).toBe(state); // untouched
      expect(result.reason).toMatch(/not enough/i);
    }
  });

  it("works on reserve too", () => {
    const result = spend(baseState({ reserve: 50 }), "reserve", 50);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.reserve).toBe(0);
  });
});

describe("gainEssos", () => {
  it("adds to essos", () => {
    const result = gainEssos(baseState({ essos: 50 }), 20);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.essos).toBe(70);
  });

  it("caps at 100", () => {
    const result = gainEssos(baseState({ essos: 90 }), 50);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.essos).toBe(100);
  });
});

describe("resetFromReserve", () => {
  it("sets essos to 100 and subtracts 25 from reserve", () => {
    const result = resetFromReserve(baseState({ essos: 40, reserve: 60 }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.essos).toBe(100);
      expect(result.state.reserve).toBe(35);
    }
  });

  it("is refused below 25 reserve", () => {
    const result = resetFromReserve(baseState({ essos: 40, reserve: 24 }));
    expect(result.ok).toBe(false);
  });

  it("is allowed above 0 essos by default (resolved house rule)", () => {
    const result = resetFromReserve(baseState({ essos: 80, reserve: 50 }));
    expect(result.ok).toBe(true);
  });

  it("can be gated to only fire at 0 essos via the named option", () => {
    const blocked = resetFromReserve(baseState({ essos: 80, reserve: 50 }), {
      resetRequiresEmptyEssos: true,
    });
    expect(blocked.ok).toBe(false);

    const allowed = resetFromReserve(baseState({ essos: 0, reserve: 50 }), {
      resetRequiresEmptyEssos: true,
    });
    expect(allowed.ok).toBe(true);
  });
});

describe("longRest", () => {
  it("sets both pools to 100", () => {
    const result = longRest(baseState({ essos: 10, reserve: 5 }));
    expect(result.essos).toBe(100);
    expect(result.reserve).toBe(100);
  });
});

describe("medicalTreatment", () => {
  it("sets reserve to the chosen value", () => {
    const result = medicalTreatment(baseState({ reserve: 0 }), 40);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.reserve).toBe(40);
  });

  it("refuses an out-of-range value", () => {
    const result = medicalTreatment(baseState(), 150);
    expect(result.ok).toBe(false);
  });
});

describe("isDepleted", () => {
  it("is true only at reserve 0", () => {
    expect(isDepleted(baseState({ reserve: 0 }))).toBe(true);
    expect(isDepleted(baseState({ reserve: 1 }))).toBe(false);
  });
});
