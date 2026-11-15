import { useEffect, useState } from "react";
import { getActiveCampaign, getContent, onContentChange } from "../content";
import type { ContentFile } from "../../preload/api";

const SAMPLE_DOC_PATH = "lore/events/founding-of-iornia.md";

export function App() {
  const [campaignName, setCampaignName] = useState<string | null>(null);
  const [doc, setDoc] = useState<ContentFile | null>(null);

  useEffect(() => {
    void getActiveCampaign().then((campaign) =>
      setCampaignName(campaign?.name ?? null),
    );
    void getContent(SAMPLE_DOC_PATH).then(setDoc);

    return onContentChange((file) => {
      if (file.path === SAMPLE_DOC_PATH) {
        setDoc(file);
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-night px-10 py-8 text-parchment">
      <h1 className="mb-6 font-display text-3xl text-gold-bright">
        {campaignName ?? "IORNIA"}
      </h1>
      {doc ? (
        <article className="max-w-prose">
          <h2 className="mb-3 font-display text-xl text-gold">
            {String(doc.frontmatter.title)}
          </h2>
          <p className="whitespace-pre-wrap font-reading leading-relaxed">
            {doc.body}
          </p>
        </article>
      ) : (
        <p className="font-reading text-parchment-dark">
          Loading campaign content…
        </p>
      )}
    </main>
  );
}
