import { useEffect, useState } from "react";
import type { Effect } from "../../../core/schemas/tracking";
import { getRulesTable } from "../../content";

interface Preset {
  name: string;
  note: string;
}

// Reads presets from rules/data/conditions.yaml via the shared content
// API, the same one the Codex section uses — this only shares data, not
// React code, per the "sections don't import from each other" rule.
function usePresets(): Preset[] {
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    void getRulesTable("rules/data/conditions.yaml").then((file) => {
      if (!file) return;
      const rows = file.table.sections.flatMap((section) => section.rows);
      setPresets(
        rows
          .filter((row) => row[0])
          .map((row) => ({ name: row[0], note: row[1] ?? "" })),
      );
    });
  }, []);

  return presets;
}

export function EffectsPanel({
  effects,
  onAdd,
  onRemove,
}: {
  effects: Effect[];
  onAdd: (effect: Effect) => void;
  onRemove: (name: string) => void;
}) {
  const presets = usePresets();
  const [freeText, setFreeText] = useState("");

  return (
    <div>
      <h3 className="font-display text-gold-bright">Effects</h3>

      <ul className="my-2 space-y-1">
        {effects.map((effect) => (
          <li
            key={effect.name}
            className="flex items-center justify-between gap-2 rounded border border-gold/20 px-2 py-1 text-sm"
          >
            <span>
              {effect.name}
              {effect.turnsLeft !== undefined && ` (${effect.turnsLeft} turns)`}
              {effect.note && (
                <span className="ml-2 text-parchment-dark">{effect.note}</span>
              )}
            </span>
            <button
              onClick={() => onRemove(effect.name)}
              className="text-ember hover:text-ember-bright"
            >
              Remove
            </button>
          </li>
        ))}
        {effects.length === 0 && (
          <li className="text-sm text-parchment-dark">No active effects.</li>
        )}
      </ul>

      <div className="flex flex-wrap gap-1">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onAdd({ name: preset.name, note: preset.note })}
            className="rounded border border-gold/30 px-2 py-0.5 text-xs text-gold hover:bg-gold/10"
          >
            + {preset.name}
          </button>
        ))}
      </div>

      <form
        className="mt-2 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!freeText.trim()) return;
          onAdd({ name: freeText.trim() });
          setFreeText("");
        }}
      >
        <input
          value={freeText}
          onChange={(event) => setFreeText(event.target.value)}
          placeholder="Free-text effect…"
          className="flex-1 rounded border border-gold/30 bg-night-deep px-2 py-1 text-sm text-parchment"
        />
        <button
          type="submit"
          className="rounded border border-gold/40 px-2 py-1 text-sm text-gold hover:bg-gold/10"
        >
          Add
        </button>
      </form>
    </div>
  );
}
