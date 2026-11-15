import type { RulesTable } from "../core/schemas/rulesTable";
import type { SearchHit } from "../core/search/buildIndex";
import type { Effect, TrackingState } from "../core/schemas/tracking";
import type { Profile } from "../core/schemas/profile";
import type { Sheet } from "../core/schemas/sheet";
import type { ResetFromReserveOptions } from "../core/tracking/pools";
import type { GainableCurrency } from "../core/tracking/metaCurrencies";

export interface CampaignOpenResult {
  path: string;
  name: string;
}

export interface ContentFile {
  path: string;
  schema: string;
  frontmatter: Record<string, unknown>;
  body: string;
  raw: string;
}

export interface RulesTableFile {
  path: string;
  table: RulesTable;
}

export interface CharacterFile {
  slug: string;
  sheet: Sheet | null;
  profile: Profile | null;
  tracking: TrackingState | null;
}

export type TrackingAction =
  | { type: "spend"; pool: "essos" | "reserve"; amount: number }
  | { type: "gainEssos"; amount: number }
  | { type: "resetFromReserve"; options?: ResetFromReserveOptions }
  | { type: "longRest" }
  | { type: "medicalTreatment"; value: number }
  | { type: "adjustHp"; delta: number }
  | { type: "adjustFp"; delta: number }
  | { type: "burnExceed" }
  | { type: "newEncounter" }
  | { type: "gainMetaCurrency"; currency: GainableCurrency; amount: number }
  | { type: "spendPlotPoint" }
  | { type: "spendFlashbackPoint"; inCombat: boolean }
  | { type: "spendDharma"; amount: number }
  | { type: "spendWildcardPoint"; amount?: number }
  | { type: "addEffect"; effect: Effect }
  | { type: "removeEffect"; name: string }
  | { type: "tickEffects" };

export type TrackingActionResponse =
  | { ok: true; tracking: TrackingState; nearKarmaCap?: boolean }
  | { ok: false; tracking: TrackingState; reason: string };

export interface IorniaBridge {
  campaign: {
    open(): Promise<CampaignOpenResult | null>;
    getActive(): Promise<CampaignOpenResult | null>;
  };
  content: {
    get(path: string): Promise<ContentFile | null>;
    onChange(callback: (file: ContentFile) => void): () => void;
  };
  codex: {
    listPages(): Promise<ContentFile[]>;
    getPage(path: string): Promise<ContentFile | null>;
    listTables(): Promise<RulesTableFile[]>;
    getTable(path: string): Promise<RulesTableFile | null>;
    search(query: string): Promise<SearchHit[]>;
    onChange(callback: () => void): () => void;
  };
  characters: {
    list(): Promise<CharacterFile[]>;
    get(slug: string): Promise<CharacterFile | null>;
    applyTrackingAction(
      slug: string,
      action: TrackingAction,
    ): Promise<TrackingActionResponse | null>;
    onChange(callback: (file: CharacterFile) => void): () => void;
  };
}
