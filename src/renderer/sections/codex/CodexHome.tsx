import { useEffect, useState } from "react";
import { listCodexPages, onCodexChange, searchCodex } from "../../content";
import type { ContentFile } from "../../../preload/api";
import type { SearchHit } from "../../../core/search/buildIndex";

export function CodexHome({
  onOpenPage,
  onToggleCombatReference,
  combatReferenceOpen,
}: {
  onOpenPage: (path: string) => void;
  onToggleCombatReference: () => void;
  combatReferenceOpen: boolean;
}) {
  const [pages, setPages] = useState<ContentFile[]>([]);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);

  useEffect(() => {
    const load = () => void listCodexPages().then(setPages);
    load();
    return onCodexChange(load);
  }, []);

  useEffect(() => {
    // searchCodex already returns [] for a blank query, so there's no
    // separate synchronous-clear branch needed here.
    const handle = setTimeout(() => {
      void searchCodex(query).then(setHits);
    }, 150);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-gold-bright">
          Rules Codex
        </h1>
        <button
          onClick={onToggleCombatReference}
          className="rounded border border-gold/40 px-3 py-1.5 font-reading text-sm text-gold hover:bg-gold/10"
        >
          {combatReferenceOpen ? "Hide" : "Show"} Combat Reference
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search the Codex…"
        className="mb-6 w-full max-w-md rounded border border-gold/30 bg-night px-3 py-2 font-reading text-parchment placeholder:text-parchment-dark/60 focus:border-gold focus:outline-none"
      />

      {hits.length > 0 && (
        <ul className="mb-6 space-y-1">
          {hits.map((hit) => (
            <li key={`${hit.path}-${hit.title}`}>
              <button
                onClick={() =>
                  hit.kind === "codex-page"
                    ? onOpenPage(hit.path)
                    : onToggleCombatReference()
                }
                className="text-left text-gold hover:underline"
              >
                {hit.title}{" "}
                <span className="text-xs text-parchment-dark">
                  ({hit.kind})
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <ul className="space-y-2">
        {pages.map((page) => (
          <li key={page.path}>
            <button
              onClick={() => onOpenPage(page.path)}
              className="text-left font-reading text-lg text-parchment hover:text-gold-bright"
            >
              {String(page.frontmatter.title)}
            </button>
            {Boolean(page.frontmatter.status) && (
              <span className="ml-2 text-xs uppercase text-gold/70">
                {String(page.frontmatter.status)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
