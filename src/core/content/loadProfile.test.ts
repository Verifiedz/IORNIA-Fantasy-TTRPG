import { describe, expect, it } from "vitest";
import { loadProfile } from "./loadProfile";

const VALID_YAML = `
schema: 1
name: Thistlewood
title: Wandering Blade
essosAffinities:
  cultivation: 2
  magic: 0
  invocation: 1
  awakened: 0
  modulation: 0
  transmission: 0
`;

describe("loadProfile", () => {
  it("parses a valid profile.yaml", () => {
    const result = loadProfile("characters/sample/profile.yaml", VALID_YAML);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Thistlewood");
      expect(result.value.essosAffinities.cultivation).toBe(2);
    }
  });

  it("reports a missing name without throwing", () => {
    const result = loadProfile(
      "characters/sample/profile.yaml",
      "schema: 1\nessosAffinities: { cultivation: 0, magic: 0, invocation: 0, awakened: 0, modulation: 0, transmission: 0 }\n",
    );

    expect(result.ok).toBe(false);
  });
});
