import { useMemo, useState } from "react";
import type { WikiIndexPayload } from "../../../preload/api";
import { entityType, type WikiEntityType } from "../../../core/schemas/wikiEntry";
import { TagChip } from "../../design/components/TagChip";

const TYPES: WikiEntityType[] = ["character", "place", "faction", "item"];

export function WikiHome({
  index,
  onOpen,
  onNewEntry,
}: {
  index: WikiIndexPayload;
  onOpen: (id: string) => void;
  onNewEntry: () => void;
}) {
  const [typeFilter, setTypeFilter] = useState<WikiEntityType | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const entities = Object.values(index.entities);

  const allTags = useMemo(
    () => [...new Set(entities.flatMap((e) => e.frontmatter.tags))].sort(),
    [entities],
  );

  const filtered = entities.filter((entity) => {
    if (typeFilter && entityType(entity.id) !== typeFilter) return false;
    if (tagFilter && !entity.frontmatter.tags.includes(tagFilter)) return false;
    if (query && !entity.frontmatter.name.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-gold-bright">Character Wiki</h1>
        <button
          onClick={onNewEntry}
          className="rounded border border-gold/40 px-3 py-1.5 font-reading text-sm text-gold hover:bg-gold/10"
        >
          + New entry
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name…"
        className="mb-4 w-full max-w-md rounded border border-gold/30 bg-night px-3 py-2 font-reading text-parchment placeholder:text-parchment-dark/60 focus:border-gold focus:outline-none"
      />

      <div className="mb-3 flex flex-wrap gap-2">
        {TYPES.map((type) => (
          <TagChip
            key={type}
            tag={type}
            active={typeFilter === type}
            onClick={() => setTypeFilter(typeFilter === type ? null : type)}
          />
        ))}
      </div>

      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              active={tagFilter === tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
            />
          ))}
        </div>
      )}

      <ul className="space-y-2">
        {filtered.map((entity) => (
          <li key={entity.id}>
            <button
              onClick={() => onOpen(entity.id)}
              className="flex items-center gap-3 text-left font-reading text-lg text-parchment hover:text-gold-bright"
            >
              {entity.frontmatter.portrait && (
                <img
                  src={`iornia://${entityType(entity.id)}s/${entity.id.split(":")[1]}/${entity.frontmatter.portrait}`}
                  alt=""
                  className="h-10 w-10 rounded-full border border-gold/40 object-cover"
                />
              )}
              <span>
                {entity.frontmatter.name}{" "}
                <span className="text-xs uppercase text-parchment-dark">
                  ({entityType(entity.id)})
                </span>
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-parchment-dark">No entries match.</li>
        )}
      </ul>

      {index.brokenLinks.length > 0 && (
        <div className="mt-8 rounded border border-ember/40 bg-night-deep px-3 py-2 text-sm text-ember-bright">
          {index.brokenLinks.length} broken{" "}
          {index.brokenLinks.length === 1 ? "link" : "links"} across the
          wiki — open the linking entry to see which.
        </div>
      )}
    </div>
  );
}
