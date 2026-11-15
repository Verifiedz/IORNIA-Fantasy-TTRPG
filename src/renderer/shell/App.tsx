import { useState } from "react";
import { CodexSection } from "../sections/codex/CodexSection";
import { SheetsSection } from "../sections/sheets/SheetsSection";
import { WikiSection } from "../sections/wiki/WikiSection";
import { RelationshipWebSection } from "../sections/relationships/RelationshipWebSection";

type Section = "codex" | "sheets" | "wiki" | "relationships";

// Minimal placeholder nav — the shell's real navigation (persistent
// chrome, page-turn transitions between sections) is a later design-
// system pass, not part of any single section's phase.
export function App() {
  const [section, setSection] = useState<Section>("codex");
  // The only thing that crosses a section boundary, per architecture
  // rule 4 — set when the Relationship Web asks to open a wiki entity.
  const [pendingWikiEntityId, setPendingWikiEntityId] = useState<string | null>(null);

  const openWikiEntity = (id: string): void => {
    setSection("wiki");
    setPendingWikiEntityId(id);
  };

  return (
    <div className="flex h-screen min-h-0 flex-col">
      <nav className="flex gap-4 border-b border-gold/20 bg-night-deep px-4 py-2">
        <button
          onClick={() => setSection("codex")}
          className={`font-display text-sm uppercase tracking-wide ${section === "codex" ? "text-gold-bright" : "text-parchment-dark hover:text-gold"}`}
        >
          Rules Codex
        </button>
        <button
          onClick={() => setSection("sheets")}
          className={`font-display text-sm uppercase tracking-wide ${section === "sheets" ? "text-gold-bright" : "text-parchment-dark hover:text-gold"}`}
        >
          Character Sheets
        </button>
        <button
          onClick={() => setSection("wiki")}
          className={`font-display text-sm uppercase tracking-wide ${section === "wiki" ? "text-gold-bright" : "text-parchment-dark hover:text-gold"}`}
        >
          Character Wiki
        </button>
        <button
          onClick={() => setSection("relationships")}
          className={`font-display text-sm uppercase tracking-wide ${section === "relationships" ? "text-gold-bright" : "text-parchment-dark hover:text-gold"}`}
        >
          Relationship Web
        </button>
      </nav>
      <div className="min-h-0 flex-1">
        {section === "codex" && <CodexSection />}
        {section === "sheets" && <SheetsSection />}
        {section === "wiki" && (
          <WikiSection
            initialEntityId={pendingWikiEntityId}
            onConsumeInitialEntity={() => setPendingWikiEntityId(null)}
          />
        )}
        {section === "relationships" && (
          <RelationshipWebSection onOpenEntity={openWikiEntity} />
        )}
      </div>
    </div>
  );
}
