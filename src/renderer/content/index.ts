import type { CampaignOpenResult, ContentFile } from "../../preload/api";

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
