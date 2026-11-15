import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "node:path";
import { IORNIA_CHANNELS } from "../preload/channels";
import { getActiveCampaignPath, openCampaign, readContentFile } from "./campaign";
import { getSampleCampaignPath } from "./paths";
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
  // Phase 0 only needs the sample campaign opened at launch.
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

void app.whenReady().then(async () => {
  const window = createWindow();
  const campaignPath = getSampleCampaignPath();
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
