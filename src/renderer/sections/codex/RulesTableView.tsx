import type { RulesTable } from "../../../core/schemas/rulesTable";
import { StatusBanner } from "../../design/components/StatusBanner";

export function RulesTableView({ table }: { table: RulesTable }) {
  return (
    <div className="space-y-6">
      {table.sections.map((section) => (
        <section key={section.id}>
          <h3 className="font-display text-lg text-gold">{section.title}</h3>
          {section.status && (
            <StatusBanner status={section.status} note={section.note} />
          )}
          <div className="overflow-x-auto">
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr>
                  {section.columns.map((column) => (
                    <th
                      key={column}
                      className="border-b border-gold/30 px-2 py-1 text-left text-gold-bright"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border-b border-night-deep px-2 py-1 align-top"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
