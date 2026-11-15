import { useEffect, useState } from "react";
import { getCodexPage, onCodexChange } from "../../content";
import type { ContentFile } from "../../../preload/api";
import type { RulesTableStatus } from "../../../core/schemas/rulesTable";
import { StatusBanner } from "../../design/components/StatusBanner";

export function CodexPage({
  path,
  onBack,
}: {
  path: string;
  onBack: () => void;
}) {
  const [page, setPage] = useState<ContentFile | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => {
      void getCodexPage(path).then((file) => {
        if (active) setPage(file);
      });
    };
    load();
    const unsubscribe = onCodexChange(load);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [path]);

  if (!page) {
    return <p className="p-6 text-parchment-dark">Loading…</p>;
  }

  const status = page.frontmatter.status as RulesTableStatus | undefined;
  const note = page.frontmatter.note as string | undefined;

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-4 font-reading text-sm text-parchment-dark hover:text-gold"
      >
        ← Back to Codex
      </button>
      <h1 className="mb-4 font-display text-2xl text-gold-bright">
        {String(page.frontmatter.title)}
      </h1>
      {status && <StatusBanner status={status} note={note} />}
      <div className="max-w-prose whitespace-pre-wrap font-reading leading-relaxed">
        {page.body}
      </div>
    </div>
  );
}
