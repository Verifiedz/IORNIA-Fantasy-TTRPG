import { useEffect, useState } from "react";
import { Tabs } from "radix-ui";
import { getRulesTable } from "../../content";
import type { RulesTable } from "../../../core/schemas/rulesTable";
import { RulesTableView } from "./RulesTableView";

const PANELS = [
  { path: "rules/data/maneuvers.yaml", label: "Maneuvers" },
  { path: "rules/data/modifiers.yaml", label: "Modifiers" },
  { path: "rules/data/conditions.yaml", label: "Conditions" },
  { path: "rules/data/hit-locations.yaml", label: "Hit locations" },
];

export function CombatReference({ onClose }: { onClose: () => void }) {
  const [tables, setTables] = useState<Record<string, RulesTable | null>>({});

  useEffect(() => {
    void Promise.all(
      PANELS.map(({ path }) =>
        getRulesTable(path).then(
          (file) => [path, file?.table ?? null] as const,
        ),
      ),
    ).then((entries) => setTables(Object.fromEntries(entries)));
  }, []);

  return (
    <aside className="flex w-[440px] shrink-0 flex-col border-l border-gold/30 bg-night-deep">
      <div className="flex items-center justify-between border-b border-gold/30 p-4">
        <h2 className="font-display text-xl text-gold-bright">
          Combat Reference
        </h2>
        <button
          onClick={onClose}
          className="font-reading text-sm text-parchment-dark hover:text-gold"
        >
          Unpin
        </button>
      </div>
      <Tabs.Root
        defaultValue={PANELS[0].path}
        className="flex min-h-0 flex-1 flex-col"
      >
        <Tabs.List className="flex shrink-0 border-b border-gold/20">
          {PANELS.map(({ path, label }) => (
            <Tabs.Trigger
              key={path}
              value={path}
              className="flex-1 px-2 py-2 text-sm text-parchment-dark data-[state=active]:text-gold-bright data-[state=active]:border-b-2 data-[state=active]:border-gold"
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {PANELS.map(({ path }) => {
          const table = tables[path];
          return (
            <Tabs.Content
              key={path}
              value={path}
              className="min-h-0 flex-1 overflow-y-auto p-4"
            >
              {table ? (
                <RulesTableView table={table} />
              ) : (
                <p className="text-parchment-dark">Loading…</p>
              )}
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
    </aside>
  );
}
