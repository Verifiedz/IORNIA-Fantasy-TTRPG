import type { RulesTable } from "../core/schemas/rulesTable";
import type { SearchHit } from "../core/search/buildIndex";

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
}
