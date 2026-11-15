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
    <main>
      <h1>{campaignName ?? "IORNIA"}</h1>
      {doc ? (
        <article>
          <h2>{String(doc.frontmatter.title)}</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{doc.body}</p>
        </article>
      ) : (
        <p>Loading campaign content…</p>
      )}
    </main>
  );
}
