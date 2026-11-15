import { watch, type FSWatcher } from "chokidar";
import { relative } from "node:path";
import type { BrowserWindow } from "electron";
import { readContentFile } from "./campaign";
import { IORNIA_CHANNELS } from "../preload/channels";

const WATCHED_EXTENSIONS = new Set(["md", "yaml", "yml"]);

export function watchCampaign(
  campaignPath: string,
  window: BrowserWindow,
): FSWatcher {
  const watcher = watch(campaignPath, { ignoreInitial: true });

  watcher.on("change", (filePath: string) => {
    const ext = filePath.split(".").pop()?.toLowerCase();
    if (!ext || !WATCHED_EXTENSIONS.has(ext)) {
      return;
    }

    const relativePath = relative(campaignPath, filePath);
    if (relativePath === "campaign.yaml") {
      return; // Phase 0 doesn't need live campaign.yaml reload beyond launch.
    }

    void readContentFile(relativePath).then((file) => {
      if (file) {
        window.webContents.send(IORNIA_CHANNELS.contentChanged, file);
      }
    });
  });

  return watcher;
}
