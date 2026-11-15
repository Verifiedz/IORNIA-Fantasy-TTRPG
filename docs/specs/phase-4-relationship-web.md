# Phase 4 — Relationship Web

schema: 1

## Goal

A graph of who is bound to whom: character portraits and faction nodes
connected by typed, directional edges (kin, ally, rival, sworn, debt,
secret), each with an optional strength and note. Filterable by edge
type or by centering on one entity. Every wiki entity page also shows
that entity's own slice of the web.

**Done when (per docs/DESIGN.md's roadmap):** editing `relationships/
edges.yaml` redraws the web without a restart, and clicking a node opens
that entity's wiki page.

This phase depends on phase 3 (every node is a wiki entity) and is the
first phase to need real cross-section navigation — architecture rule 4
("cross-section navigation goes through the shell") gets its first actual
user here.

## Content

One file, not one-per-entity, per DESIGN.md's campaign-folder layout:

```
relationships/
  edges.yaml   # who is tied to whom, and how
```

```yaml
schema: 1
edges:
  - from: character:thistlewood
    to: faction:ashbrand-company
    type: ally
    strength: 2
    note: Left on good terms.
    start: "1402-03-01"
    end: "1402-09-01"
```

- `from`/`to` are entity ids (reusing `entityIdSchema` from
  `wikiEntry.ts` — relationships only connect things the wiki already
  knows about; `src/core` schemas are shared across sections by design).
- `type`: `kin | ally | rival | sworn | debt | secret`, per DESIGN.md.
- `strength`: an optional positive number. DESIGN.md doesn't specify a
  scale, so none is invented — it's a relative visual weight (thicker
  edge = larger number), not a house-rule value.
- `start`/`end`: optional ISO date strings. **Assumption, stated rather
  than hidden:** DESIGN.md ties date ranges to "a given era," which is
  `lore/eras.yaml` — phase 6, not built yet. This phase filters by a
  plain "as of" date against `start`/`end` directly, with no dependency
  on named eras. Wiring named eras in is a phase-6 follow-up, not a
  blocker here.
- Edges are **hand-edited YAML**, same as the Codex's rule tables — this
  phase's "done when" line says editing the file redraws the web, not
  that an in-app editor exists. No new-entry form this phase (unlike
  phase 3's wiki, which DESIGN.md explicitly asked for one).

`sample-campaign/relationships/edges.yaml` gets 3–4 edges connecting the
existing phase 3 sample entities (thistlewood, veyra, ashbrand-company,
ember-blade), covering at least two edge types and one dated range, to
exercise filtering in tests.

## Schema and core logic

- `src/core/schemas/relationshipEdge.ts`: `edgeTypeSchema`,
  `relationshipEdgeSchema`, `relationshipsFileSchema` (`schema: 1`,
  `edges: []` default).
- `src/core/content/loadRelationships.ts`: same YAML+Zod pattern as
  `loadRulesTable.ts`.
- `src/core/relationships/filterEdges.ts`: pure, unit-tested filtering —
  by `type`, by `centeredOn` (an entity id; this single mechanism covers
  both of DESIGN.md's "faction" and "centred on this character" filters,
  since a faction is just another entity id — two UI pickers, one filter
  function), and by `asOf` (an edge is active when `(!start || start <=
  asOf) && (!end || asOf <= end)`).
- `src/core/relationships/graph.ts`: `buildGraphNodes(edges, wikiIndex)`
  — pure, derives the node list from whichever entities actually appear
  in the (already-filtered) edge list, looking up each one's name/type/
  portrait from the wiki index. The graph shows entities with
  relationships, not a full entity browser — phase 3 already has that.

## Main process / bridge

- `readRelationships()`: loads `relationships/edges.yaml`, validates,
  caches the last good version — a broken file never blanks the graph.
- Watcher: `relationships/edges.yaml` changes broadcast
  `relationships:changed`.

## Screens

1. **Relationship Web** — a force-directed graph (`@xyflow/react` for
   rendering, `d3-force` for layout): character nodes as circular
   portrait medallions (`iornia://` protocol, same as the wiki), faction
   nodes as a simple diamond "crest" placeholder with initials (no real
   crest art exists). Edge type filter (checkboxes), a "center on"
   entity picker, an "as of" date input. Clicking a node navigates to
   that entity's wiki page — see "Cross-section navigation" below.
2. **Wiki entity page addition** — a "Relationships" panel (list, not a
   mini-graph: the dedicated section above is where the graph lives)
   showing this entity's direct edges, each naming the other entity, the
   edge type, and the note if present, clickable through the page's
   existing `onNavigate`. This is DESIGN.md's "every wiki page shows that
   entity's slice of the web," scoped to what a page-embedded panel
   should reasonably be.

## Cross-section navigation

The shell (`App.tsx`) gains the first real instance of architecture rule
4: a graph node click needs to switch the active section to the wiki
*and* open a specific entity, not just flip a tab. `App.tsx` holds a
small `pendingWikiEntityId` alongside its existing `section` state;
`WikiSection` accepts an optional initial-entity prop. No section comes
to know about another section's internals — the shell is still the only
thing passing an id across the boundary.

## Design and motion

New pattern: the faction "crest" placeholder node shape, added to
`renderer/design` (a `FactionCrest` component) rather than built inline
in the graph. Character nodes reuse the portrait-medallion treatment
already established in the wiki's list view.

**Deferred, same pattern as prior phases:** the "camera move" transition
for flying between graph regions (DESIGN.md's motion table) and smooth
d3-force settling animation are not built this phase — the graph renders
with its final computed layout, no motion pass. Note it and move on.

## Acceptance checks

1. `relationshipEdgeSchema`/`relationshipsFileSchema` validate; a broken
   `edges.yaml` reports file/field and keeps the last good graph, never
   crashing the section.
2. `filterEdges` and `buildGraphNodes` are pure and unit-tested: type
   filter, centered-on filter (character and faction), the `asOf`
   date-range check (before/inside/after a range, and edges with no
   range at all), and node derivation from a filtered edge list.
3. Editing `relationships/edges.yaml` on disk redraws the graph without
   restarting the app.
4. Clicking a graph node opens that entity's wiki page, exercising the
   new shell-level cross-section navigation.
5. A wiki entity page with at least one edge shows its "Relationships"
   panel; an entity with none shows an empty state, not an error.
6. `sample-campaign/relationships/edges.yaml` has 3–4 edges across the
   phase-3 sample entities, covering at least two types and one dated
   range.
7. typecheck, lint and tests pass; the change has been run in the app.

## Out of scope for this phase

- An in-app edge editor/new-edge form — hand-edit the YAML, per the
  "done when" line's own wording.
- Named eras from `lore/eras.yaml` — phase 6 isn't built yet; `asOf`
  takes a raw date, not an era name.
- The "camera move" motion transition and force-settling animation.
- World Map, Lore Tree, and anything beyond this phase's scope guard.
