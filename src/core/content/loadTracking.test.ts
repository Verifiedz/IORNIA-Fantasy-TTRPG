import { describe, expect, it } from "vitest";
import { loadTracking } from "./loadTracking";

const VALID_JSON = JSON.stringify({
  schema: 1,
  essos: 100,
  reserve: 100,
  hp: 11,
  fp: 11,
  exceed: { used: 0 },
  plotPointSpentThisEncounter: false,
  metaCurrencies: {
    plotPoints: 1,
    flashbackPoints: 2,
    dharma: 0,
    karma: 0,
    wildcardPoints: 0,
  },
  effects: [],
});

describe("loadTracking", () => {
  it("parses a valid tracking.json", () => {
    const result = loadTracking("characters/sample/tracking.json", VALID_JSON);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.essos).toBe(100);
      expect(result.value.exceed.used).toBe(0);
    }
  });

  it("rejects an essos value above 100 without throwing", () => {
    const result = loadTracking(
      "characters/sample/tracking.json",
      JSON.stringify({ ...JSON.parse(VALID_JSON), essos: 150 }),
    );

    expect(result.ok).toBe(false);
  });

  it("reports malformed JSON without throwing", () => {
    const result = loadTracking("characters/sample/tracking.json", "{not json");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message.length).toBeGreaterThan(0);
    }
  });
});
