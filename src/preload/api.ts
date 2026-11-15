export interface CampaignOpenResult {
  path: string;
  name: string;
}

export interface ContentFile {
  path: string;
  schema: string;
  frontmatter: Record<string, unknown>;
  raw: string;
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
}
