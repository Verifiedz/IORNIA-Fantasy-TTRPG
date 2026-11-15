import type { RulesTableStatus } from "../../../core/schemas/rulesTable";

interface StatusBannerProps {
  status: RulesTableStatus;
  note?: string;
}

const LABELS: Record<RulesTableStatus, string> = {
  "open-question": "Open question — parked for the GM",
  rework: "Under rework",
  placeholder: "Not written yet",
  deprecated: "Deprecated",
};

export function StatusBanner({ status, note }: StatusBannerProps) {
  return (
    <div className="mb-3 rounded border border-gold/40 bg-night-deep px-3 py-2 text-sm">
      <span className="font-display uppercase tracking-wide text-gold-bright">
        {LABELS[status]}
      </span>
      {note && <p className="mt-1 text-parchment-dark">{note}</p>}
    </div>
  );
}
