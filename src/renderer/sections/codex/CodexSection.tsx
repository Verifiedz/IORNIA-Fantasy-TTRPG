import { useState } from "react";
import { CodexHome } from "./CodexHome";
import { CodexPage } from "./CodexPage";
import { CombatReference } from "./CombatReference";

type View = { kind: "home" } | { kind: "page"; path: string };

export function CodexSection() {
  const [view, setView] = useState<View>({ kind: "home" });
  const [combatReferenceOpen, setCombatReferenceOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-0">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {view.kind === "home" ? (
          <CodexHome
            onOpenPage={(path) => setView({ kind: "page", path })}
            onToggleCombatReference={() =>
              setCombatReferenceOpen((open) => !open)
            }
            combatReferenceOpen={combatReferenceOpen}
          />
        ) : (
          <CodexPage path={view.path} onBack={() => setView({ kind: "home" })} />
        )}
      </div>
      {combatReferenceOpen && (
        <CombatReference onClose={() => setCombatReferenceOpen(false)} />
      )}
    </div>
  );
}
