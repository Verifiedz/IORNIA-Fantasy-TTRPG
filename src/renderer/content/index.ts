import type {
  CampaignOpenResult,
  CharacterFile,
  ContentFile,
  CreateWikiEntryInput,
  CreateWikiEntryResult,
  RulesTableFile,
  TrackingAction,
  TrackingActionResponse,
  WikiIndexPayload,
} from "../../preload/api";
import type { SearchHit } from "../../core/search/buildIndex";

export function getContent(path: string): Promise<ContentFile | null> {
  return window.iornia.content.get(path);
}

export function onContentChange(
  callback: (file: ContentFile) => void,
): () => void {
  return window.iornia.content.onChange(callback);
}

export function getActiveCampaign(): Promise<CampaignOpenResult | null> {
  return window.iornia.campaign.getActive();
}

export function listCodexPages(): Promise<ContentFile[]> {
  return window.iornia.codex.listPages();
}

export function getCodexPage(path: string): Promise<ContentFile | null> {
  return window.iornia.codex.getPage(path);
}

export function listRulesTables(): Promise<RulesTableFile[]> {
  return window.iornia.codex.listTables();
}

export function getRulesTable(path: string): Promise<RulesTableFile | null> {
  return window.iornia.codex.getTable(path);
}

export function searchCodex(query: string): Promise<SearchHit[]> {
  return window.iornia.codex.search(query);
}

export function onCodexChange(callback: () => void): () => void {
  return window.iornia.codex.onChange(callback);
}

export function listCharacters(): Promise<CharacterFile[]> {
  return window.iornia.characters.list();
}

export function getCharacter(slug: string): Promise<CharacterFile | null> {
  return window.iornia.characters.get(slug);
}

export function applyTrackingAction(
  slug: string,
  action: TrackingAction,
): Promise<TrackingActionResponse | null> {
  return window.iornia.characters.applyTrackingAction(slug, action);
}

export function onCharacterChange(
  callback: (file: CharacterFile) => void,
): () => void {
  return window.iornia.characters.onChange(callback);
}

export function listWikiEntries(): Promise<WikiIndexPayload> {
  return window.iornia.wiki.list();
}

export function createWikiEntry(
  input: CreateWikiEntryInput,
): Promise<CreateWikiEntryResult> {
  return window.iornia.wiki.create(input);
}

export function onWikiChange(callback: () => void): () => void {
  return window.iornia.wiki.onChange(callback);
}
