import { app } from "electron";
import { join } from "node:path";

export function getSampleCampaignPath(): string {
  return app.isPackaged
    ? join(process.resourcesPath, "sample-campaign")
    : join(app.getAppPath(), "sample-campaign");
}

// Dev-only override for pointing the app at a real campaign folder without
// a native folder picker (that lands with content packs, later). Never
// read in a packaged build.
export function getDefaultCampaignPath(): string {
  if (!app.isPackaged && process.env.IORNIA_CAMPAIGN_PATH) {
    return process.env.IORNIA_CAMPAIGN_PATH;
  }
  return getSampleCampaignPath();
}
