import { useState } from "react";
import { CodexSection } from "../sections/codex/CodexSection";
import { SheetsSection } from "../sections/sheets/SheetsSection";

type Section = "codex" | "sheets";

// Minimal placeholder nav — the shell's real navigation (persistent
// chrome, page-turn transitions between sections) is a later design-
// system pass, not part of any single section's phase.
export function App() {
  const [section, setSection] = useState<Section>("codex");

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
      </nav>
      <div className="min-h-0 flex-1">
        {section === "codex" ? <CodexSection /> : <SheetsSection />}
      </div>
    </div>
  );
}
