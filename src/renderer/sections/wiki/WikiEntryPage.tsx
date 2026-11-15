import type { WikiIndexPayload } from "../../../preload/api";
import { extractInfobox } from "../../../core/wiki/infobox";
import { entityType } from "../../../core/schemas/wikiEntry";
import { InfoboxTable } from "../../design/components/InfoboxTable";
import { TagChip } from "../../design/components/TagChip";
import { WikiProse } from "./WikiProse";
import { RelationshipsPanel } from "./RelationshipsPanel";

export function WikiEntryPage({
  id,
  index,
  onNavigate,
  onBack,
}: {
  id: string;
  index: WikiIndexPayload;
  onNavigate: (id: string) => void;
  onBack: () => void;
}) {
  const entity = index.entities[id];

  if (!entity) {
    return (
      <div className="p-6">
        <button onClick={onBack} className="mb-4 text-gold hover:underline">
          ← All entries
        </button>
        <p className="text-ember-bright">
          {id} has an invalid or missing wiki page. Check the console for
          the file/field that failed to validate.
        </p>
      </div>
    );
  }

  const infobox = extractInfobox(entity.frontmatter);
  const backlinks = index.backlinks[id] ?? [];
  const broken = index.brokenLinks.filter((link) => link.from === id);

  return (
    <div className="p-6">
      <button onClick={onBack} className="mb-4 text-gold hover:underline">
        ← All entries
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
        <div>
          {entity.frontmatter.portrait && (
            <img
              src={`iornia://${entityType(id)}s/${id.split(":")[1]}/${entity.frontmatter.portrait}`}
              alt=""
              className="mb-3 w-full rounded border border-gold/40 object-cover"
            />
          )}
          <span className="mb-2 inline-block rounded border border-gold/30 px-2 py-0.5 text-xs uppercase tracking-wide text-gold">
            {entityType(id)}
          </span>
          <InfoboxTable rows={infobox} />
        </div>

        <div>
          <h1 className="font-display text-2xl text-gold-bright">
            {entity.frontmatter.name}
          </h1>

          {entity.frontmatter.tags.length > 0 && (
            <div className="my-2 flex flex-wrap gap-1">
              {entity.frontmatter.tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
          )}

          <div className="mt-4">
            <WikiProse body={entity.body} entities={index.entities} onNavigate={onNavigate} />
          </div>

          {broken.length > 0 && (
            <div className="mt-4 rounded border border-ember/60 bg-night-deep px-3 py-2 text-sm text-ember-bright">
              Broken {broken.length === 1 ? "link" : "links"}:{" "}
              {broken.map((link) => link.to).join(", ")}
            </div>
          )}

          <RelationshipsPanel id={id} entities={index.entities} onNavigate={onNavigate} />

          <div className="mt-6">
            <h2 className="font-display text-gold">Mentioned in</h2>
            {backlinks.length === 0 ? (
              <p className="text-sm text-parchment-dark">Nothing links here yet.</p>
            ) : (
              <ul className="mt-1 space-y-1">
                {backlinks.map((sourceId) => (
                  <li key={sourceId}>
                    <button
                      onClick={() => onNavigate(sourceId)}
                      className="text-gold hover:underline"
                    >
                      {index.entities[sourceId]?.frontmatter.name ?? sourceId}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
