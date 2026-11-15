import { Fragment } from "react";
import { LINK_PATTERN } from "../../../core/wiki/links";
import type { WikiEntity } from "../../../core/wiki";

// The carried-over gap from phase 1: full markdown-to-HTML isn't wired
// yet, so everything else in the body still renders as plain text. Only
// [[links]] get special-cased into clickable navigation (or a visibly
// broken marker), since that's what "working links both ways" requires.
export function WikiProse({
  body,
  entities,
  onNavigate,
}: {
  body: string;
  entities: Record<string, WikiEntity>;
  onNavigate: (id: string) => void;
}) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // matchAll clones the regex internally, so this never mutates
  // LINK_PATTERN's shared lastIndex across renders.
  for (const match of body.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(
        <Fragment key={`text-${lastIndex}`}>{body.slice(lastIndex, index)}</Fragment>,
      );
    }

    const id = match[1];
    const label = match[3] ?? entities[id]?.frontmatter.name ?? id;
    const exists = Boolean(entities[id]);

    parts.push(
      exists ? (
        <button
          key={`link-${index}`}
          onClick={() => onNavigate(id)}
          className="text-gold underline hover:text-gold-bright"
        >
          {label}
        </button>
      ) : (
        <span
          key={`broken-${index}`}
          title={`Broken link: ${id}`}
          className="text-ember-bright underline decoration-wavy decoration-ember"
        >
          {label}
        </span>
      ),
    );

    lastIndex = index + match[0].length;
  }

  if (lastIndex < body.length) {
    parts.push(<Fragment key={`text-${lastIndex}`}>{body.slice(lastIndex)}</Fragment>);
  }

  return (
    <p className="whitespace-pre-wrap font-reading leading-relaxed text-parchment">
      {parts}
    </p>
  );
}
