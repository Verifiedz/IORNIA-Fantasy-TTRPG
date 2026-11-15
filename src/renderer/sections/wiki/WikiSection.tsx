import { useEffect, useState } from "react";
import type { WikiIndexPayload } from "../../../preload/api";
import { listWikiEntries, onWikiChange } from "../../content";
import { WikiHome } from "./WikiHome";
import { WikiEntryPage } from "./WikiEntryPage";
import { NewEntryForm } from "./NewEntryForm";

type View = { kind: "home" } | { kind: "entity"; id: string } | { kind: "new" };

export function WikiSection() {
  const [index, setIndex] = useState<WikiIndexPayload | null>(null);
  const [view, setView] = useState<View>({ kind: "home" });

  useEffect(() => {
    const load = (): void => void listWikiEntries().then(setIndex);
    load();
    return onWikiChange(load);
  }, []);

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
