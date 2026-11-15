import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { stringify as stringifyYaml } from "yaml";
import { createContentCache } from "../core/content/cache";
import { loadWikiEntry } from "../core/content/loadWikiEntry";
import { buildWikiIndex, slugify } from "../core/wiki";
import type { WikiEntityType, WikiEntry } from "../core/schemas/wikiEntry";
import type {
  CreateWikiEntryInput,
  CreateWikiEntryResult,
  WikiIndexPayload,
} from "../preload/api";
import { getActiveCampaignPath } from "./campaign";

const ENTITY_DIRS: Record<WikiEntityType, string> = {
  character: "characters",
  place: "places",
  faction: "factions",
  item: "items",
};

const DIR_TO_TYPE: Record<string, WikiEntityType> = Object.fromEntries(
  Object.entries(ENTITY_DIRS).map(([type, dir]) => [dir, type as WikiEntityType]),
);

const entryCache = createContentCache<WikiEntry>();

export function isWikiPath(relativePath: string): boolean {
  const [dir, slug, file] = relativePath.split("/");
  return dir in DIR_TO_TYPE && file === `${slug}.md`;
}

async function listEntityPaths(dir: string): Promise<string[]> {
  const campaignPath = getActiveCampaignPath();
  if (!campaignPath) return [];

  try {
    const slugs = await readdir(join(campaignPath, dir), { withFileTypes: true });
    return slugs
      .filter((entry) => entry.isDirectory())
      .map((entry) => `${dir}/${entry.name}/${entry.name}.md`);
  } catch {
    return [];
  }
}

export async function readWikiEntry(relativePath: string): Promise<WikiEntry | null> {
  const campaignPath = getActiveCampaignPath();
  if (!campaignPath) return null;

  let raw: string;
  try {
    raw = await readFile(join(campaignPath, relativePath), "utf-8");
  } catch {
    return null;
  }

  const result = loadWikiEntry(relativePath, raw);
  const { value, error } = entryCache.update(relativePath, result);
  if (error) console.error(`[iornia] ${relativePath} invalid:`, error);
  return value;
}

export async function listWikiEntries(): Promise<{ path: string; entry: WikiEntry }[]> {
  const paths = (
    await Promise.all(Object.values(ENTITY_DIRS).map((dir) => listEntityPaths(dir)))
  ).flat();

  const entries = await Promise.all(
    paths.map(async (path) => {
      const entry = await readWikiEntry(path);
      return entry ? { path, entry } : null;
    }),
  );

  return entries.filter((e): e is { path: string; entry: WikiEntry } => e !== null);
}

// Converts the core (Map-based) index into a plain, structured-clone-safe
// shape for the IPC boundary — the renderer never sees a Map.
export async function buildWikiIndexPayload(): Promise<WikiIndexPayload> {
  const index = buildWikiIndex(await listWikiEntries());
  return {
    entities: Object.fromEntries(index.entities),
    backlinks: Object.fromEntries(index.backlinks),
    brokenLinks: index.brokenLinks,
  };
}

// The first content *file* (not app-state JSON) the app writes on the
// user's behalf — still only from src/main, per architecture rule 1.
// Refuses a colliding slug rather than overwriting an existing entity.
export async function createWikiEntry(
  input: CreateWikiEntryInput,
): Promise<CreateWikiEntryResult> {
  const campaignPath = getActiveCampaignPath();
  if (!campaignPath) {
    return { ok: false, reason: "No campaign is open." };
  }

  const slug = slugify(input.name);
  if (!slug) {
    return { ok: false, reason: "Name must contain at least one letter or number." };
  }

  const dir = ENTITY_DIRS[input.type];
  const entityDir = join(campaignPath, dir, slug);
  const relativePath = `${dir}/${slug}/${slug}.md`;
  const id = `${input.type}:${slug}`;

  const existing = await readWikiEntry(relativePath);
  if (existing) {
    return { ok: false, reason: `${id} already exists.` };
  }

  const frontmatter = stringifyYaml({
    schema: 1,
    id,
    name: input.name,
    tags: input.tags,
    visibility: "public",
  });

  await mkdir(entityDir, { recursive: true });
  await writeFile(
    join(entityDir, `${slug}.md`),
    `---\n${frontmatter}---\n${input.body.trim()}\n`,
    "utf-8",
  );

  return { ok: true, path: relativePath, id };
}
