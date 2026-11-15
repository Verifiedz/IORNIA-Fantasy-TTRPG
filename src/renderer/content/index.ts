import type {
  CampaignOpenResult,
  ContentFile,
  RulesTableFile,
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
