import { watch, type FSWatcher } from "chokidar";
import { relative } from "node:path";
import type { BrowserWindow } from "electron";
import {
  isCodexPath,
  readContentFile,
  rebuildSearchIndex,
} from "./campaign";
import { characterSlugFromPath, isCharacterPath, readCharacter } from "./characters";
import { isWikiPath } from "./wiki";
import { IORNIA_CHANNELS } from "../preload/channels";

const WATCHED_EXTENSIONS = new Set(["md", "yaml", "yml", "json"]);

export function watchCampaign(
  campaignPath: string,
  window: BrowserWindow,
): FSWatcher {
  const watcher = watch(campaignPath, { ignoreInitial: true });

  // Both "change" (an existing file edited) and "add" (a brand new file or
  // folder dropped in — e.g. a new wiki entry) need the same handling: the
  // folder is the source of truth, so a new entity must appear without a
  // restart, not just an edited one.
  watcher.on("change", (filePath: string) => {
    void handleChange(campaignPath, filePath, window);
  });
  watcher.on("add", (filePath: string) => {
    void handleChange(campaignPath, filePath, window);
  });

  return watcher;
}

async function handleChange(
  campaignPath: string,
  filePath: string,
  window: BrowserWindow,
): Promise<void> {
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (!ext || !WATCHED_EXTENSIONS.has(ext)) {
    return;
  }

  const relativePath = relative(campaignPath, filePath);
  if (relativePath === "campaign.yaml") {
    return; // Phase 0 doesn't need live campaign.yaml reload beyond launch.
  }

  if (isCodexPath(relativePath)) {
    await rebuildSearchIndex();
    window.webContents.send(IORNIA_CHANNELS.codexChanged);
    return;
  }

  // Checked before isCharacterPath: a character's own wiki page
  // (characters/<slug>/<slug>.md) lives inside that broader prefix, but
  // needs the wiki index rebuilt, not a characters:changed broadcast.
  if (isWikiPath(relativePath)) {
    window.webContents.send(IORNIA_CHANNELS.wikiChanged);
    return;
  }

  if (isCharacterPath(relativePath)) {
    const slug = characterSlugFromPath(relativePath);
    if (!slug) return;
    const file = await readCharacter(slug);
    window.webContents.send(IORNIA_CHANNELS.charactersChanged, file);
    return;
  }

  const file = await readContentFile(relativePath);
  if (file) {
    window.webContents.send(IORNIA_CHANNELS.contentChanged, file);
  }
}
