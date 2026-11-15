import { net, protocol } from "electron";
import { join, normalize, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { getActiveCampaignPath } from "./campaign";

export const ASSET_SCHEME = "iornia";

// Registered before app ready, per Electron's requirement for privileged
// custom schemes (needed so relative URLs and fetch() behave like http).
export function registerAssetSchemePrivileges(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: ASSET_SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
  ]);
}

// Serves read-only files from inside the active campaign folder — the one
// place campaign images and PDFs (portraits, sheet.pdf, later the map)
// reach the sandboxed renderer, since the renderer has no fs access of
// its own. Deliberately refuses to serve anything outside the campaign
// folder.
export function registerAssetProtocolHandler(): void {
  protocol.handle(ASSET_SCHEME, (request) => {
    const campaignPath = getActiveCampaignPath();
    if (!campaignPath) {
      return new Response(null, { status: 404 });
    }

    // Standard-scheme URLs split the authority from the path (so
    // iornia://characters/x/y.pdf parses with host "characters", path
    // "/x/y.pdf") — stitch them back into one campaign-relative path.
    const url = new URL(request.url);
    const requestedPath = decodeURIComponent(`${url.host}${url.pathname}`);
    const resolved = normalize(join(campaignPath, requestedPath));

    if (!resolved.startsWith(normalize(campaignPath) + sep)) {
      return new Response(null, { status: 403 });
    }

    return net.fetch(pathToFileURL(resolved).toString());
  });
}
