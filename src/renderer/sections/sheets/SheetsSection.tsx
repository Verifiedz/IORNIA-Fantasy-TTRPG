import { useState } from "react";
import { CharacterList } from "./CharacterList";
import { CharacterSheet } from "./CharacterSheet";
import { useSheetsStore } from "./store";

type View = { kind: "list" } | { kind: "party"; slugs: string[] };

export function SheetsSection() {
  const [view, setView] = useState<View>({ kind: "list" });
  const characters = useSheetsStore((state) => state.characters);

  if (view.kind === "list") {
    return (
      <CharacterList
        onOpen={(slug) => setView({ kind: "party", slugs: [slug] })}
      />
    );
  }

  const removeSlug = (slug: string): void => {
    setView((current) => {
      if (current.kind !== "party") return current;
      const remaining = current.slugs.filter((s) => s !== slug);
      return remaining.length > 0
        ? { kind: "party", slugs: remaining }
        : { kind: "list" };
    });
  };

  const addSlug = (slug: string): void => {
    if (!slug) return;
    setView((current) =>
      current.kind === "party" && !current.slugs.includes(slug)
        ? { kind: "party", slugs: [...current.slugs, slug] }
        : current,
    );
  };

  const available = Object.keys(characters).filter(
    (slug) => !view.slugs.includes(slug),
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 border-b border-gold/20 p-2">
        <button
          onClick={() => setView({ kind: "list" })}
          className="text-sm text-gold hover:underline"
        >
          ← All characters
        </button>
        {available.length > 0 && (
          <select
            value=""
            onChange={(event) => addSlug(event.target.value)}
            className="rounded border border-gold/30 bg-night-deep px-2 py-1 text-sm text-parchment"
          >
            <option value="" disabled>
              + Add to party view
            </option>
            {available.map((slug) => (
              <option key={slug} value={slug}>
                {characters[slug]?.profile?.name ?? slug}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex min-h-0 flex-1 divide-x divide-gold/10 overflow-x-auto">
        {view.slugs.map((slug) => (
          <div key={slug} className="min-h-0 min-w-[480px] flex-1 overflow-y-auto">
            <CharacterSheet slug={slug} onBack={() => removeSlug(slug)} />
          </div>
        ))}
      </div>
    </div>
  );
}
