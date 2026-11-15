import { describe, expect, it } from "vitest";
import { loadRulesTable } from "./loadRulesTable";

const VALID_YAML = `
schema: 1
kind: maneuvers
sections:
  - id: maneuver-list
    title: Maneuver list
    columns: ["Maneuver", "Type", "Effect"]
    rows:
      - ["Ready", "Preparation", "Ready or reload a weapon."]
      - ["Regular Attack", "Attack", "Melee or Ranged."]
`;

describe("loadRulesTable", () => {
  it("parses a valid rules table", () => {
    const result = loadRulesTable("rules/data/maneuvers.yaml", VALID_YAML);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.kind).toBe("maneuvers");
      expect(result.value.sections).toHaveLength(1);
      expect(result.value.sections[0].rows).toHaveLength(2);
    }
  });

  it("carries a section's open-question status and note", () => {
    const yaml = `
schema: 1
kind: modifiers
sections:
  - id: task-difficulty
    title: Task Difficulty chart
    columns: ["Modifier", "Task"]
    rows:
      - ["+1", "Slightly Favourable"]
    status: open-question
    note: The source duplicates this label with the -1 row.
`;
    const result = loadRulesTable("rules/data/modifiers.yaml", yaml);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.sections[0].status).toBe("open-question");
      expect(result.value.sections[0].note).toContain("duplicates");
    }
  });

  it("rejects an unknown kind without throwing", () => {
    const result = loadRulesTable(
      "rules/data/bogus.yaml",
      "schema: 1\nkind: not-a-real-kind\nsections: []\n",
    );

    expect(result.ok).toBe(false);
  });

  it("reports malformed YAML without throwing", () => {
    const result = loadRulesTable("rules/data/maneuvers.yaml", "kind: [unclosed\n");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message.length).toBeGreaterThan(0);
    }
  });
});
