import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "node:path";
import { IORNIA_CHANNELS } from "../preload/channels";

function createWindow(): void {
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
}

ipcMain.handle(IORNIA_CHANNELS.campaignOpen, () => null);
ipcMain.handle(IORNIA_CHANNELS.campaignGetActive, () => null);
ipcMain.handle(IORNIA_CHANNELS.contentGet, () => null);

void app.whenReady().then(createWindow);

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
