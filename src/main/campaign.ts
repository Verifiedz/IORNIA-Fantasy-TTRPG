import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type MiniSearch from "minisearch";
import { createContentCache } from "../core/content/cache";
import { loadCampaign } from "../core/content/loadCampaign";
import { loadCodexPage } from "../core/content/loadCodexPage";
import { loadDoc } from "../core/content/loadDoc";
import { loadRulesTable } from "../core/content/loadRulesTable";
import {
  buildSearchIndex,
  search as searchIndex,
  type SearchDocument,
  type SearchHit,
} from "../core/search/buildIndex";
import type { Campaign } from "../core/schemas/campaign";
import type { CodexPage } from "../core/schemas/codexPage";
import type { Doc } from "../core/schemas/doc";
import type { RulesTable } from "../core/schemas/rulesTable";
import type {
  CampaignOpenResult,
  ContentFile,
  RulesTableFile,
} from "../preload/api";

const CODEX_DIR = "rules/codex";
const RULES_DATA_DIR = "rules/data";

const campaignCache = createContentCache<Campaign>();
const docCache = createContentCache<Doc>();
const codexCache = createContentCache<CodexPage>();
const rulesTableCache = createContentCache<RulesTable>();

let activeCampaignPath: string | null = null;
let searchIndexInstance: MiniSearch<SearchDocument> | null = null;

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
  await rebuildSearchIndex();
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

  return toContentFile(relativePath, value.frontmatter, value.body, raw);
}

export async function readCodexPage(
  relativePath: string,
): Promise<ContentFile | null> {
  if (!activeCampaignPath) {
    return null;
  }

  let raw: string;
  try {
    raw = await readFile(join(activeCampaignPath, relativePath), "utf-8");
  } catch {
    return null;
  }

  const result = loadCodexPage(relativePath, raw);
  const { value, error } = codexCache.update(relativePath, result);

  if (error) {
    console.error(`[iornia] ${relativePath} invalid:`, error);
  }
  if (!value) {
    return null;
  }

  return toContentFile(relativePath, value.frontmatter, value.body, raw);
}

export async function readRulesTable(
  relativePath: string,
): Promise<RulesTableFile | null> {
  if (!activeCampaignPath) {
    return null;
  }

  let raw: string;
  try {
    raw = await readFile(join(activeCampaignPath, relativePath), "utf-8");
  } catch {
    return null;
  }

  const result = loadRulesTable(relativePath, raw);
  const { value, error } = rulesTableCache.update(relativePath, result);

  if (error) {
    console.error(`[iornia] ${relativePath} invalid:`, error);
  }
  if (!value) {
    return null;
  }

  return { path: relativePath, table: value };
}

async function listFiles(dir: string, extension: string): Promise<string[]> {
  if (!activeCampaignPath) {
    return [];
  }

  try {
    const entries = await readdir(join(activeCampaignPath, dir));
    return entries
      .filter((name) => name.endsWith(extension))
      .map((name) => `${dir}/${name}`);
  } catch {
    return [];
  }
}

export async function listCodexPages(): Promise<ContentFile[]> {
  const paths = await listFiles(CODEX_DIR, ".md");
  const files = await Promise.all(paths.map((path) => readCodexPage(path)));
  return files.filter((file): file is ContentFile => file !== null);
}

export async function listRulesTables(): Promise<RulesTableFile[]> {
  const paths = await listFiles(RULES_DATA_DIR, ".yaml");
  const files = await Promise.all(paths.map((path) => readRulesTable(path)));
  return files.filter((file): file is RulesTableFile => file !== null);
}

export async function rebuildSearchIndex(): Promise<void> {
  const [codexFiles, rulesFiles] = await Promise.all([
    listCodexPages(),
    listRulesTables(),
  ]);

  searchIndexInstance = buildSearchIndex(
    codexFiles.map((file) => ({
      path: file.path,
      page: { frontmatter: file.frontmatter as CodexPage["frontmatter"], body: file.body },
    })),
    rulesFiles.map((file) => ({ path: file.path, table: file.table })),
  );
}

export function searchCodex(query: string): SearchHit[] {
  if (!searchIndexInstance) {
    return [];
  }
  return searchIndex(searchIndexInstance, query);
}

export function isCodexPath(relativePath: string): boolean {
  return (
    relativePath.startsWith(`${CODEX_DIR}/`) ||
    relativePath.startsWith(`${RULES_DATA_DIR}/`)
  );
}

function toContentFile(
  path: string,
  frontmatter: Record<string, unknown>,
  body: string,
  raw: string,
): ContentFile {
  return {
    path,
    schema: String(frontmatter.schema),
    frontmatter,
    body,
    raw,
  };
}
