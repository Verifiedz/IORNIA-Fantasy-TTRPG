import { describe, expect, it } from "vitest";
import { loadCodexPage } from "./loadCodexPage";

describe("loadCodexPage", () => {
  it("parses a valid codex page", () => {
    const result = loadCodexPage(
      "rules/codex/healing.md",
      "---\nschema: 1\ntitle: Healing and recovery\npinnable: false\n---\nFirst Aid removes conditions.\n",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.frontmatter.title).toBe("Healing and recovery");
      expect(result.value.body).toBe("First Aid removes conditions.");
    }
  });

  it("carries a page-level rework status and note", () => {
    const result = loadCodexPage(
      "rules/codex/fates.md",
      "---\nschema: 1\ntitle: Fates\nstatus: rework\nnote: Parked by the GM.\n---\nPlaceholder body.\n",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.frontmatter.status).toBe("rework");
      expect(result.value.frontmatter.note).toBe("Parked by the GM.");
    }
  });

  it("reports a missing title without throwing", () => {
    const result = loadCodexPage(
      "rules/codex/example.md",
      "---\nschema: 1\n---\nBody only.\n",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.field).toBe("title");
    }
  });
});
