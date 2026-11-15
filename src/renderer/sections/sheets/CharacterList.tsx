import { useEffect } from "react";
import { useSheetsStore } from "./store";

export function CharacterList({
  onOpen,
}: {
  onOpen: (slug: string) => void;
}) {
  const loaded = useSheetsStore((state) => state.loaded);
  const characters = useSheetsStore((state) => state.characters);
  const loadAll = useSheetsStore((state) => state.loadAll);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  if (!loaded) {
    return <p className="p-6 text-parchment-dark">Loading…</p>;
  }

  const entries = Object.values(characters);

  return (
    <div className="p-6">
      <h1 className="mb-6 font-display text-2xl text-gold-bright">
        Character Sheets
      </h1>

      {entries.length === 0 && (
        <p className="text-parchment-dark">
          No characters found in this campaign's <code>characters/</code>{" "}
          folder.
        </p>
      )}

      <ul className="space-y-2">
        {entries.map((character) => (
          <li key={character.slug}>
            <button
              onClick={() => onOpen(character.slug)}
              className="flex items-center gap-3 text-left font-reading text-lg text-parchment hover:text-gold-bright"
            >
              {character.profile?.portrait && (
                <img
                  src={`iornia://characters/${character.slug}/${character.profile.portrait}`}
                  alt=""
                  className="h-10 w-10 rounded-full border border-gold/40 object-cover"
                />
              )}
              <span>
                {character.profile?.name ?? character.slug}
                {character.profile?.title && (
                  <span className="ml-2 text-sm text-parchment-dark">
                    {character.profile.title}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
