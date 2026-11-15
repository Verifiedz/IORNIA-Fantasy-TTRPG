import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createContentCache } from "../core/content/cache";
import { loadProfile } from "../core/content/loadProfile";
import { loadSheet } from "../core/content/loadSheet";
import { loadTracking } from "../core/content/loadTracking";
import type { Profile } from "../core/schemas/profile";
import type { Sheet } from "../core/schemas/sheet";
import type { TrackingState } from "../core/schemas/tracking";
import * as tracking from "../core/tracking";
import type { CharacterFile, TrackingAction, TrackingActionResponse } from "../preload/api";
import { getActiveCampaignPath } from "./campaign";

export const CHARACTERS_DIR = "characters";

const sheetCache = createContentCache<Sheet>();
const profileCache = createContentCache<Profile>();
const trackingCache = createContentCache<TrackingState>();

export function isCharacterPath(relativePath: string): boolean {
  return relativePath.startsWith(`${CHARACTERS_DIR}/`);
}

export function characterSlugFromPath(relativePath: string): string | null {
  if (!isCharacterPath(relativePath)) return null;
  const parts = relativePath.split("/");
  return parts[1] ?? null;
}

async function readCharacterFile(
  slug: string,
  fileName: string,
): Promise<string | null> {
  const campaignPath = getActiveCampaignPath();
  if (!campaignPath) return null;
  try {
    return await readFile(
      join(campaignPath, CHARACTERS_DIR, slug, fileName),
      "utf-8",
    );
  } catch {
    return null;
  }
}

export async function readCharacterSheet(slug: string): Promise<Sheet | null> {
  const raw = await readCharacterFile(slug, "sheet.yaml");
  if (raw === null) return null;

  const relativePath = `${CHARACTERS_DIR}/${slug}/sheet.yaml`;
  const result = loadSheet(relativePath, raw);
  const { value, error } = sheetCache.update(relativePath, result);
  if (error) console.error(`[iornia] ${relativePath} invalid:`, error);
  return value;
}

export async function readCharacterProfile(slug: string): Promise<Profile | null> {
  const raw = await readCharacterFile(slug, "profile.yaml");
  if (raw === null) return null;

  const relativePath = `${CHARACTERS_DIR}/${slug}/profile.yaml`;
  const result = loadProfile(relativePath, raw);
  const { value, error } = profileCache.update(relativePath, result);
  if (error) console.error(`[iornia] ${relativePath} invalid:`, error);
  return value;
}

export async function readCharacterTracking(
  slug: string,
): Promise<TrackingState | null> {
  const raw = await readCharacterFile(slug, "tracking.json");
  if (raw === null) return null;

  const relativePath = `${CHARACTERS_DIR}/${slug}/tracking.json`;
  const result = loadTracking(relativePath, raw);
  const { value, error } = trackingCache.update(relativePath, result);
  if (error) console.error(`[iornia] ${relativePath} invalid:`, error);
  return value;
}

export async function readCharacter(slug: string): Promise<CharacterFile> {
  const [sheet, profile, trackingState] = await Promise.all([
    readCharacterSheet(slug),
    readCharacterProfile(slug),
    readCharacterTracking(slug),
  ]);
  return { slug, sheet, profile, tracking: trackingState };
}

export async function listCharacterSlugs(): Promise<string[]> {
  const campaignPath = getActiveCampaignPath();
  if (!campaignPath) return [];

  try {
    const entries = await readdir(join(campaignPath, CHARACTERS_DIR), {
      withFileTypes: true,
    });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

export async function listCharacters(): Promise<CharacterFile[]> {
  const slugs = await listCharacterSlugs();
  return Promise.all(slugs.map((slug) => readCharacter(slug)));
}

async function writeTracking(slug: string, state: TrackingState): Promise<void> {
  const campaignPath = getActiveCampaignPath();
  if (!campaignPath) return;

  const relativePath = `${CHARACTERS_DIR}/${slug}/tracking.json`;
  await writeFile(
    join(campaignPath, CHARACTERS_DIR, slug, "tracking.json"),
    `${JSON.stringify(state, null, 2)}\n`,
    "utf-8",
  );
  trackingCache.update(relativePath, { ok: true, value: state });
}

// The renderer never computes a new TrackingState itself — it sends an
// action, main runs the matching pure src/core/tracking function and
// writes the result, per the architecture rule that only src/main
// touches disk and the content rule that house-rule numbers live in
// data, not scattered across renderer call sites.
export async function applyTrackingAction(
  slug: string,
  action: TrackingAction,
): Promise<TrackingActionResponse | null> {
  const current = await readCharacterTracking(slug);
  if (!current) return null;

  let result: TrackingActionResponse;
  switch (action.type) {
    case "spend": {
      const r = tracking.spend(current, action.pool, action.amount);
      result = r.ok ? { ok: true, tracking: r.state } : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "gainEssos": {
      const r = tracking.gainEssos(current, action.amount);
      result = r.ok ? { ok: true, tracking: r.state } : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "resetFromReserve": {
      const r = tracking.resetFromReserve(current, action.options);
      result = r.ok ? { ok: true, tracking: r.state } : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "longRest": {
      result = { ok: true, tracking: tracking.longRest(current) };
      break;
    }
    case "medicalTreatment": {
      const r = tracking.medicalTreatment(current, action.value);
      result = r.ok ? { ok: true, tracking: r.state } : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "adjustHp": {
      result = { ok: true, tracking: tracking.adjustHp(current, action.delta) };
      break;
    }
    case "adjustFp": {
      result = { ok: true, tracking: tracking.adjustFp(current, action.delta) };
      break;
    }
    case "burnExceed": {
      const r = tracking.burnExceed(current);
      result = r.ok ? { ok: true, tracking: r.state } : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "newEncounter": {
      result = { ok: true, tracking: tracking.newEncounter(current) };
      break;
    }
    case "gainMetaCurrency": {
      const r = tracking.gainMetaCurrency(current, action.currency, action.amount);
      result = r.ok ? { ok: true, tracking: r.state } : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "spendPlotPoint": {
      const r = tracking.spendPlotPoint(current);
      result = r.ok ? { ok: true, tracking: r.state } : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "spendFlashbackPoint": {
      const r = tracking.spendFlashbackPoint(current, action.inCombat);
      result = r.ok ? { ok: true, tracking: r.state } : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "spendDharma": {
      const r = tracking.spendDharma(current, action.amount);
      result = r.ok
        ? { ok: true, tracking: r.state, nearKarmaCap: r.nearKarmaCap }
        : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "spendWildcardPoint": {
      const r = tracking.spendWildcardPoint(current, action.amount);
      result = r.ok ? { ok: true, tracking: r.state } : { ok: false, tracking: r.state, reason: r.reason };
      break;
    }
    case "addEffect": {
      result = { ok: true, tracking: tracking.addEffect(current, action.effect) };
      break;
    }
    case "removeEffect": {
      result = { ok: true, tracking: tracking.removeEffect(current, action.name) };
      break;
    }
    case "tickEffects": {
      result = { ok: true, tracking: tracking.tickEffects(current) };
      break;
    }
  }

  if (result.ok) {
    await writeTracking(slug, result.tracking);
  }
  return result;
}
