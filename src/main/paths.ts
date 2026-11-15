import { app } from "electron";
import { join } from "node:path";

export function getSampleCampaignPath(): string {
  return app.isPackaged
    ? join(process.resourcesPath, "sample-campaign")
    : join(app.getAppPath(), "sample-campaign");
}
