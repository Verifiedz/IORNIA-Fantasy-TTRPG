import { useState } from "react";
import type { WikiEntityType } from "../../../core/schemas/wikiEntry";
import { createWikiEntry } from "../../content";

const TYPES: WikiEntityType[] = ["character", "place", "faction", "item"];

export function NewEntryForm({
  onCreated,
  onCancel,
}: {
  onCreated: (id: string) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<WikiEntityType>("character");
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const result = await createWikiEntry({
      type,
      name,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      body,
    });
    setSaving(false);

    if (result.ok) {
      onCreated(result.id);
    } else {
      setError(result.reason);
    }
  };

  return (
    <div className="p-6">
      <button onClick={onCancel} className="mb-4 text-gold hover:underline">
        ← All entries
      </button>
      <h1 className="mb-4 font-display text-2xl text-gold-bright">New wiki entry</h1>

      {error && (
        <p className="mb-4 rounded border border-ember/60 bg-night-deep px-3 py-2 text-sm text-ember-bright">
          {error}
        </p>
      )}

      <form onSubmit={(e) => void submit(e)} className="max-w-xl space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm text-gold">Type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as WikiEntityType)}
            className="w-full rounded border border-gold/30 bg-night-deep px-3 py-2 text-parchment"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-gold">Name</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded border border-gold/30 bg-night-deep px-3 py-2 text-parchment"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-gold">Tags (comma separated)</span>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="w-full rounded border border-gold/30 bg-night-deep px-3 py-2 text-parchment"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-gold">Body</span>
          <textarea
            rows={8}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Prose here. Link other entries with [[type:slug]]."
            className="w-full rounded border border-gold/30 bg-night-deep px-3 py-2 font-reading text-parchment"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded border border-gold/40 px-4 py-2 text-gold hover:bg-gold/10 disabled:opacity-50"
        >
          {saving ? "Creating…" : "Create entry"}
        </button>
      </form>
    </div>
  );
}
