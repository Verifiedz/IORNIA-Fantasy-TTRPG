# Phase 3 — Character Wiki

schema: 1

## Goal

One page per entity — character, place, faction or item — with a
portrait, an infobox built straight from front matter, prose, `[[links]]`
to other entities, backlinks ("mentioned in"), and tags. New entries are
files: the wiki grows by adding to the campaign folder by hand, or
through an in-app "new entry" form that writes the file.

**Done when (per docs/DESIGN.md's roadmap):** a new character file
dropped into the campaign folder appears in the wiki with working links
both ways — the new page's `[[links]]` resolve and navigate, and any
existing page linking to the new entity picks it up as a backlink.

## Content layout

Per DESIGN.md's campaign-folder example, wiki pages are **not** a
separate `wiki/` tree — they live inside each entity's own folder,
alongside whatever else that entity has:

```
characters/<slug>/<slug>.md   (alongside sheet.yaml/profile.yaml/tracking.json from phase 2)
places/<slug>/<slug>.md
factions/<slug>/<slug>.md
items/<slug>/<slug>.md
```

Front matter (per DESIGN.md's worked example):

```markdown
---
schema: 1
id: character:kael
name: Kael Varros
tags: [essos-user, trial-contestant]
portrait: portrait.webp
visibility: public
---
Raised in the ash markets of [[place:veyra]], Kael ...
```

`id` is `type:slug` and is the entity's address everywhere else in the
app (architecture rule 3) — `type` is read from it, not a separate field.
Every other front-matter key beyond the five reserved ones above
(`schema`, `id`, `name`, `tags`, `portrait`, `visibility`) is passed
through untouched and becomes an infobox row — DESIGN.md's "kind: pc" /
"player: ahad" in its example are exactly this, not part of the fixed
schema. This is what lets a place's infobox (region, population) and a
character's infobox (player, class) differ without separate schemas.

`sample-campaign/` gets one small fictional entry per entity type
(character, place, faction, item), cross-linking each other plus one
deliberately broken link, to exercise links/backlinks/broken-link
collection in tests. The existing `characters/thistlewood/` folder from
phase 2 gets a `thistlewood.md` added to it — same folder, new file.

## Schema and core logic (`src/core/schemas/wikiEntry.ts`, `src/core/wiki/`)

- `wikiEntrySchema`: `schema: 1`, `id` (regex `^(character|place|faction|item):[a-z0-9-]+$`),
  `name`, `tags: string[]` (default `[]`), `portrait?: string`,
  `visibility: "public" | "gm"` (default `"public"`, per CLAUDE.md — unused
  by anything yet, same as every other section). `.passthrough()` keeps
  extra keys for the infobox.
- `extractInfobox(frontmatter)`: strips the five reserved keys, returns
  the rest as ordered `{ key, value }` rows for display. Pure.
- `parseLinks(body)`: finds every `[[type:slug]]` / `[[type:slug|label]]`,
  returns `{ id, label? }[]`. Pure, regex-based — no markdown parsing yet
  (see "Out of scope").
- `buildWikiIndex(entries)`: given every loaded entity, returns:
  - a `Map<id, WikiEntity>`
  - `backlinks: Map<id, id[]>` — who links to this entity
  - `brokenLinks: { from: id; to: id; label?: string }[]` — links whose
    target isn't in the entity map, collected rather than thrown, per
    CLAUDE.md's content rule
  Pure, fully unit-tested (this is phase 3's equivalent of phase 2's
  tracking state machine — the one piece of real logic).
- `slugify(name)`: lowercase, hyphenate, strip anything that isn't
  `[a-z0-9-]`. Used by the new-entry form.

## Loader

`loadWikiEntry.ts`, same gray-matter + Zod pattern as `loadCodexPage.ts`.
A page that fails validation reports file/field and keeps the last good
version, same as every other content type — never crashes the section.

## Main process / bridge

- `listWikiEntities()`: scans `characters/`, `places/`, `factions/`,
  `items/` for `<slug>/<slug>.md`, loads and validates each.
- `createWikiEntry({ type, name, tags, body })`: slugifies the name,
  refuses if that type+slug already exists (never silently overwrites),
  creates `<type>s/<slug>/` if needed, writes `<slug>.md` with the
  generated front matter. This is the first content **file** (not JSON
  state) the app writes on the user's behalf — still only from
  `src/main`, per architecture rule 1.
- The watcher distinguishes a wiki `.md` under `characters/<slug>/` from
  that same folder's `sheet.yaml`/`profile.yaml`/`tracking.json` (phase
  2) and rebuilds the wiki index (including backlinks) on any wiki-page
  change, broadcasting a `wiki:changed` event.

## Screens

1. **Wiki home** — all entities, filterable by type and by tag, a name
   search.
2. **Entity page** — portrait, infobox (rendered from the passthrough
   front-matter fields), prose with `[[links]]` rendered as clickable
   navigation to the target entity (or a visibly broken-link marker if
   the target doesn't exist — reusing the `StatusBanner`-style treatment
   from phase 1 rather than inventing a new one), a tag list, and a
   "Mentioned in" backlinks section.
3. **New entry form** — type, name, tags, body. Writes the file through
   the bridge; the new page opens once the watcher confirms it landed.

Full prose-to-HTML Markdown rendering (headers, bold, blockquotes) stays
the carried-over gap from phase 1 — this phase only special-cases
`[[links]]` into clickable elements, since that's what "working links
both ways" requires. Everything else in the body still renders as
preformatted text.

## Design

New patterns needed (added to `renderer/design` first, per CLAUDE.md,
not built one-off in `sections/wiki`): an infobox table component and a
tag chip component. The broken-link marker reuses phase 1's
`StatusBanner` rather than adding a third new component.

**Deferred, same pattern as phase 1's markdown gap:** the "shared
element" portrait transition from a list into its page (DESIGN.md's
motion table) is not built this phase — it needs Motion's shared layout
across a route change the shell doesn't support structurally yet. Note
it and move on rather than block the phase on it.

## Acceptance checks

1. `wikiEntrySchema` validates the five reserved fields and passes
   through everything else; a broken entity page reports file/field
   without taking down the wiki or the app.
2. `parseLinks`/`buildWikiIndex` are pure and unit-tested, including: a
   link to an existing entity, a link with a `|label`, a broken link, and
   a backlink computed correctly in both directions.
3. Dropping a new character folder+file into the campaign folder (not
   just editing an existing one) makes it appear in the wiki without a
   restart, with its outgoing links resolved and incoming backlinks from
   existing pages picked up.
4. The new-entry form writes a real file through the bridge and refuses
   a name that collides with an existing slug of the same type, rather
   than overwriting it.
5. A deliberately broken `[[link]]` in `sample-campaign/` renders
   visibly broken in the page, not silently dropped or thrown.
6. `sample-campaign/` has one fictional entity per type (character,
   place, faction, item), cross-linked, plus the one deliberate broken
   link — never real campaign content.
7. typecheck, lint and tests pass; the change has been run in the app.

## Out of scope for this phase

- Full Markdown-to-HTML rendering (phase 1's carried-over gap).
- The Relationship Web slice on each wiki page (DESIGN.md explicitly
  defers this to phase 4, which depends on the Wiki existing first).
- A cross-section "campaign health panel" — broken links surface inline
  on the entity page that has them for now; a dedicated panel spanning
  every section's links can wait until another section (Relationship
  Web, Lore Tree) also produces links worth auditing together.
- Editing an existing entry in-app — the form only creates new files
  this phase, per DESIGN.md's "grows by adding to the folder... or
  through an in-app 'new entry' form." Editing is hand-editing the file
  for now, same as every other content type.
- Character Sheets, Relationship Web, World Map, Lore Tree.
