import { watch, type FSWatcher } from "chokidar";
import { relative } from "node:path";
import type { BrowserWindow } from "electron";
import {
  isCodexPath,
  readContentFile,
  rebuildSearchIndex,
} from "./campaign";
import { characterSlugFromPath, isCharacterPath, readCharacter } from "./characters";
import { IORNIA_CHANNELS } from "../preload/channels";

const WATCHED_EXTENSIONS = new Set(["md", "yaml", "yml", "json"]);

export function watchCampaign(
  campaignPath: string,
  window: BrowserWindow,
): FSWatcher {
  const watcher = watch(campaignPath, { ignoreInitial: true });

  watcher.on("change", (filePath: string) => {
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
