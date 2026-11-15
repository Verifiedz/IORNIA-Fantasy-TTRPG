import { describe, expect, it } from "vitest";
import { loadDoc } from "./loadDoc";

describe("loadDoc", () => {
  it("parses a valid document", () => {
    const result = loadDoc(
      "lore/events/example.md",
      "---\nschema: 1\ntitle: Example Event\n---\nSome body text.\n",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.frontmatter.title).toBe("Example Event");
      expect(result.value.body).toBe("Some body text.");
    }
  });

  it("reports a missing schema field without throwing", () => {
    const result = loadDoc(
      "lore/events/example.md",
      "---\ntitle: Example Event\n---\nSome body text.\n",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.field).toBe("schema");
    }
  });

  it("reports malformed front matter without throwing", () => {
    const result = loadDoc(
      "lore/events/example.md",
      "---\ntitle: [unclosed\n---\nSome body text.\n",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message.length).toBeGreaterThan(0);
    }
  });
});
