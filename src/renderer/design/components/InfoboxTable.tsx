import type { InfoboxRow } from "../../../core/wiki/infobox";

// Renders whatever extra front-matter fields a wiki entry carries —
// DESIGN.md's "infobox built from front matter" — so a place's
// region/population and a character's kind/player share one component
// without per-type layouts.
export function InfoboxTable({ rows }: { rows: InfoboxRow[] }) {
  if (rows.length === 0) return null;

  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {rows.map((row) => (
          <tr key={row.key} className="border-b border-gold/15 last:border-0">
            <th className="py-1 pr-3 text-left font-display font-normal capitalize text-gold">
              {row.key}
            </th>
            <td className="py-1 text-parchment">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
