import { useEffect, useState } from "react";
import type { WikiIndexPayload } from "../../../preload/api";
import { listWikiEntries, onWikiChange } from "../../content";
import { WikiHome } from "./WikiHome";
import { WikiEntryPage } from "./WikiEntryPage";
import { NewEntryForm } from "./NewEntryForm";

type View = { kind: "home" } | { kind: "entity"; id: string } | { kind: "new" };

export function WikiSection({
  initialEntityId,
  onConsumeInitialEntity,
}: {
  // Set by the shell when another section (the Relationship Web) wants
  // to open a specific entity here — the only cross-section navigation
  // path, per architecture rule 4.
  initialEntityId?: string | null;
  onConsumeInitialEntity?: () => void;
}) {
  const [index, setIndex] = useState<WikiIndexPayload | null>(null);
  // A lazy initializer, not a derived-state effect: App.tsx fully
  // unmounts/remounts WikiSection every time it switches sections (it's
  // rendered behind a `section === "wiki" &&` guard), so a graph-node
  // click always produces a fresh mount with the target id already
  // known — there's no later prop change to react to.
  const [view, setView] = useState<View>(() =>
    initialEntityId ? { kind: "entity", id: initialEntityId } : { kind: "home" },
  );

  useEffect(() => {
    const load = (): void => void listWikiEntries().then(setIndex);
    load();
    return onWikiChange(load);
  }, []);

  useEffect(() => {
    // One-shot: tell the shell this id has been consumed, so a later
    // plain nav-tab click (not from the graph) opens the wiki home
    // rather than reopening this same entity.
    if (initialEntityId) onConsumeInitialEntity?.();
  }, [initialEntityId, onConsumeInitialEntity]);

  if (!index) {
    return <p className="p-6 text-parchment-dark">Loading…</p>;
  }

  if (view.kind === "new") {
    return (
      <NewEntryForm
        onCreated={(id) => setView({ kind: "entity", id })}
        onCancel={() => setView({ kind: "home" })}
      />
    );
  }

  if (view.kind === "entity") {
    return (
      <WikiEntryPage
        id={view.id}
        index={index}
        onNavigate={(id) => setView({ kind: "entity", id })}
        onBack={() => setView({ kind: "home" })}
      />
    );
  }

  return (
    <WikiHome
      index={index}
      onOpen={(id) => setView({ kind: "entity", id })}
      onNewEntry={() => setView({ kind: "new" })}
    />
  );
}
