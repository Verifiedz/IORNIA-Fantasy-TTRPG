import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "node:path";
import { IORNIA_CHANNELS } from "../preload/channels";
import type { TrackingAction } from "../preload/api";
import {
  getActiveCampaignPath,
  listCodexPages,
  listRulesTables,
  openCampaign,
  readCodexPage,
  readContentFile,
  readRulesTable,
  searchCodex,
} from "./campaign";
import {
  applyTrackingAction,
  listCharacters,
  readCharacter,
} from "./characters";
import { getDefaultCampaignPath } from "./paths";
import { watchCampaign } from "./watcher";

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#12162e",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void window.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void window.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return window;
}

ipcMain.handle(IORNIA_CHANNELS.campaignOpen, async () => {
  // Native folder picker lands with the Character Wiki/content-pack work;
  // for now the app opens the default (sample or IORNIA_CAMPAIGN_PATH)
  // folder at launch.
  const activePath = getActiveCampaignPath();
  return activePath ? openCampaign(activePath) : null;
});

ipcMain.handle(IORNIA_CHANNELS.campaignGetActive, async () => {
  const activePath = getActiveCampaignPath();
  return activePath ? openCampaign(activePath) : null;
});

ipcMain.handle(IORNIA_CHANNELS.contentGet, (_event, path: string) =>
  readContentFile(path),
);

ipcMain.handle(IORNIA_CHANNELS.codexListPages, () => listCodexPages());
ipcMain.handle(IORNIA_CHANNELS.codexGetPage, (_event, path: string) =>
  readCodexPage(path),
);
ipcMain.handle(IORNIA_CHANNELS.codexListTables, () => listRulesTables());
ipcMain.handle(IORNIA_CHANNELS.codexGetTable, (_event, path: string) =>
  readRulesTable(path),
);
ipcMain.handle(IORNIA_CHANNELS.codexSearch, (_event, query: string) =>
  searchCodex(query),
);

ipcMain.handle(IORNIA_CHANNELS.charactersList, () => listCharacters());
ipcMain.handle(IORNIA_CHANNELS.charactersGet, (_event, slug: string) =>
  readCharacter(slug),
);
ipcMain.handle(
  IORNIA_CHANNELS.charactersApplyTrackingAction,
  (_event, slug: string, action: TrackingAction) =>
    applyTrackingAction(slug, action),
);

void app.whenReady().then(async () => {
  const window = createWindow();
  const campaignPath = getDefaultCampaignPath();
  await openCampaign(campaignPath);
  watchCampaign(campaignPath, window);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
