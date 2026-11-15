import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createContentCache } from "../core/content/cache";
import { loadCampaign } from "../core/content/loadCampaign";
import { loadDoc } from "../core/content/loadDoc";
import type { Campaign } from "../core/schemas/campaign";
import type { Doc } from "../core/schemas/doc";
import type { CampaignOpenResult, ContentFile } from "../preload/api";

const campaignCache = createContentCache<Campaign>();
const docCache = createContentCache<Doc>();

let activeCampaignPath: string | null = null;

export function getActiveCampaignPath(): string | null {
  return activeCampaignPath;
}

export async function openCampaign(
  campaignPath: string,
): Promise<CampaignOpenResult | null> {
  const raw = await readFile(join(campaignPath, "campaign.yaml"), "utf-8");
  const result = loadCampaign("campaign.yaml", raw);
  const { value, error } = campaignCache.update("campaign.yaml", result);

  if (error) {
    console.error("[iornia] campaign.yaml invalid:", error);
  }
  if (!value) {
    return null;
  }

  activeCampaignPath = campaignPath;
  return { path: campaignPath, name: value.name };
}

export async function readContentFile(
  relativePath: string,
): Promise<ContentFile | null> {
  if (!activeCampaignPath) {
    return null;
  }

  const raw = await readFile(
    join(activeCampaignPath, relativePath),
    "utf-8",
  );
  const result = loadDoc(relativePath, raw);
  const { value, error } = docCache.update(relativePath, result);

  if (error) {
    console.error(`[iornia] ${relativePath} invalid:`, error);
  }
  if (!value) {
    return null;
  }

  return {
    path: relativePath,
    schema: String(value.frontmatter.schema),
    frontmatter: value.frontmatter,
    body: value.body,
    raw,
  };
}
