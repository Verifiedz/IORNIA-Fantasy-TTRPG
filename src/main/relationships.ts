import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createContentCache } from "../core/content/cache";
import { loadRelationships } from "../core/content/loadRelationships";
import type { RelationshipsFile } from "../core/schemas/relationshipEdge";
import { getActiveCampaignPath } from "./campaign";

export const RELATIONSHIPS_PATH = "relationships/edges.yaml";

const relationshipsCache = createContentCache<RelationshipsFile>();

export function isRelationshipsPath(relativePath: string): boolean {
  return relativePath === RELATIONSHIPS_PATH;
}

export async function readRelationships(): Promise<RelationshipsFile> {
  const campaignPath = getActiveCampaignPath();
  const empty: RelationshipsFile = { schema: 1, edges: [] };
  if (!campaignPath) return empty;

  let raw: string;
  try {
    raw = await readFile(join(campaignPath, RELATIONSHIPS_PATH), "utf-8");
  } catch {
    return relationshipsCache.get(RELATIONSHIPS_PATH) ?? empty;
  }

  const result = loadRelationships(RELATIONSHIPS_PATH, raw);
  const { value, error } = relationshipsCache.update(RELATIONSHIPS_PATH, result);
  if (error) console.error(`[iornia] ${RELATIONSHIPS_PATH} invalid:`, error);
  return value ?? empty;
}
