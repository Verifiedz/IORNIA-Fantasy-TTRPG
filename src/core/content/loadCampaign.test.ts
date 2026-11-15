import { describe, expect, it } from "vitest";
import { loadCampaign } from "./loadCampaign";

describe("loadCampaign", () => {
  it("parses a valid campaign.yaml", () => {
    const result = loadCampaign(
      "campaign.yaml",
      "schema: 1\nname: The Ashen Trial\ntagline: A sample campaign\n",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("The Ashen Trial");
      expect(result.value.tagline).toBe("A sample campaign");
    }
  });

  it("reports a missing schema field without throwing", () => {
    const result = loadCampaign("campaign.yaml", "name: The Ashen Trial\n");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.file).toBe("campaign.yaml");
      expect(result.error.field).toBe("schema");
    }
  });

  it("reports malformed YAML without throwing", () => {
    const result = loadCampaign("campaign.yaml", "name: [unclosed\n");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.file).toBe("campaign.yaml");
      expect(result.error.message.length).toBeGreaterThan(0);
    }
  });
});
