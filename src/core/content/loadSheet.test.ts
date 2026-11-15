import { describe, expect, it } from "vitest";
import { loadSheet } from "./loadSheet";

const VALID_YAML = `
schema: 1
attributes: { st: 11, dx: 13, iq: 12, ht: 11 }
secondaryCharacteristics: { will: 12, perception: 12, basicSpeed: 6.0, basicMove: 6, dodge: 9 }
hp: { max: 11 }
fp: { max: 11 }
traits:
  - name: Combat Reflexes
    points: 15
skills:
  - name: Broadsword
    level: 14
weapons:
  - name: Longsword
    damage: "1d+2 cut"
equipment:
  - name: Chainmail
pointTotals: { total: 150 }
`;

describe("loadSheet", () => {
  it("parses a valid sheet.yaml", () => {
    const result = loadSheet("characters/sample/sheet.yaml", VALID_YAML);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.attributes.dx).toBe(13);
      expect(result.value.hp.max).toBe(11);
      expect(result.value.traits).toHaveLength(1);
      expect(result.value.equipment[0].quantity).toBe(1); // default applied
    }
  });

  it("reports a missing required field without throwing", () => {
    const result = loadSheet(
      "characters/sample/sheet.yaml",
      "schema: 1\nattributes: { st: 11, dx: 13, iq: 12, ht: 11 }\n",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.file).toBe("characters/sample/sheet.yaml");
      expect(result.error.message.length).toBeGreaterThan(0);
    }
  });

  it("reports malformed YAML without throwing", () => {
    const result = loadSheet("characters/sample/sheet.yaml", "attributes: [unclosed\n");

    expect(result.ok).toBe(false);
  });
});
