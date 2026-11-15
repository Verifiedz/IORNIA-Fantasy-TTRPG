# IORNIA

Desktop companion app for a custom tabletop campaign: GURPS mechanics plus the
campaign's own house rules. Windows and Linux. Fully local and file-based: no
server, no accounts, no network calls at runtime.

It is a GM's tool first. One person edits content; players may get copies and
limited editing later. Fights are run in Owlbear Rodeo, not here.

The full design lives in `docs/DESIGN.md`. Read it before starting any phase.
Per-section specs live in `docs/specs/`. If code and a spec disagree, stop and
ask; do not silently pick one.

## Current status

Phase 0 (Foundation) — done on Linux. Electron shell, typed preload bridge,
content pipeline with live reload, design tokens, animated wordmark launch,
and AppImage/.deb installers are built and verified. The Windows NSIS
installer has not been built (no Wine on the dev machine yet); build it
once Wine is installed, and do a real Windows install/run check once there
is Windows access. Phase 1 (Rules Codex) starts next.

Update this line at the end of every phase. Phases, in order:

0. Foundation: shell, content pipeline, design system, installers
1. Rules Codex (static reference, including the combat reference)
2. Character Sheets (the only interactive section: pools, HP, FP, effects)
3. Character Wiki
4. Relationship Web
5. World Map
6. Lore Tree
7. Players and polish

Work on one phase at a time. Do not scaffold later sections "while we're here".

## Scope guard

- There is no combat tracker. Do not build initiative order, turn engines,
  maneuver enforcement, battle grids or tokens. Combat rules are static pages
  and tables in the Codex.
- The only live, changing state in the app is per-character tracking on the
  sheet: Essos pool, Reserve pool, HP, FP and current effects.
- The map section embeds Azgaar's generator as it is. Do not build map
  editing, map-to-wiki linking or custom markers unless a spec asks for it.

## Stack

- Electron (45.x) with electron-vite; electron-builder for installers
  (NSIS .exe, AppImage, .deb)
- TypeScript, `strict: true`, no `any` without a comment saying why
- React + Vite in the renderer
- Tailwind CSS + CSS variables for design tokens; Radix UI primitives, skinned
  by hand
- Animation: GSAP (timelines, SplitText, DrawSVG, MorphSVG, Flip), Motion for
  component/route/layout transitions, PixiJS for ambient effects
- Content: gray-matter + remark (Markdown), yaml, Zod (validation), chokidar
  (watching), MiniSearch (search)
- State: Zustand
- Graph: React Flow + d3-force. Lore tree camera: d3-zoom.
- PDF: PDF.js (view only)
- Tests: Vitest (core, loaders), Playwright (packaged app)

Do not add a dependency that overlaps one of these without asking first.
Do not add a database, a backend, telemetry, or auto-update that phones home.

## Repository layout

```
src/
  main/          Electron main process: file access, watcher, index, protocol
  preload/       The typed bridge. Only place contextBridge is used.
  renderer/
    shell/       Navigation, theme, transitions, search, ambient layer
    design/      Tokens, core components, named transitions
    sections/
      codex/ sheets/ wiki/ relationships/ map/ lore/
  core/          Pure TypeScript: schemas, GCS import, tracking rules.
                 No Electron, no React.
vendor/fmg/      Azgaar's Fantasy Map Generator, pinned. Do not edit casually.
sample-campaign/ A small campaign folder used in development and tests
docs/
  DESIGN.md
  specs/         One spec per section, written before that section's code
```

## Commands

Create these scripts in phase 0 and keep this list true:

- `npm run dev` — run the app against `sample-campaign/`
- `npm run test` — Vitest
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint`
- `npm run e2e` — Playwright against a built app
- `npm run dist` — build installers for the current platform

Before saying a task is done: typecheck, lint and tests must pass, and the
change must have been run in the app, not only compiled.

## Architecture rules

1. **Only `src/main` touches the disk.** The renderer has `contextIsolation`
   on, `nodeIntegration` off, and reaches files only through the preload
   bridge. Never import `fs`, `path` or `electron` in the renderer.
2. **The campaign folder is the source of truth.** The index is rebuilt from
   files at launch. Never store campaign content only in app state,
   localStorage or a cache.
3. **Everything is an entity with a stable id**, written `type:slug`
   (`character:salazar`, `place:veyra`). Sections refer to each other only
   by id.
4. **Sections do not import from each other.** They share `core/`, `design/`
   and the content API. Cross-section navigation goes through the shell.
5. **`src/core` stays pure.** No Electron, React, DOM or file access.
6. **Rules are data.** Maneuvers, conditions, modifiers and Essos costs come
   from the campaign's `rules/data/*.yaml`. Do not hard-code a house-rule
   number in TypeScript.

## Content rules

- Formats: Markdown with YAML front matter for prose; YAML for structured
  data people maintain; JSON only for state the app writes itself.
- Every content type has a Zod schema in `src/core/schemas/`. The TypeScript
  type is inferred from the schema, never written separately.
- Every file carries `schema: <n>`. A breaking schema change needs a
  migration and a bumped number.
- A file that fails validation must never crash the app. Report file, line
  and field; keep the last good version in use.
- Links in prose are `[[type:slug]]` or `[[type:slug|label]]`. Broken links
  are collected for the health panel, not thrown.
- Every entity has `visibility` (default `public`). Nothing uses it yet; it
  exists so a player export can exclude `gm` files later.
- Never commit real campaign content or borrowed artwork to this repo. Use
  `sample-campaign/` with placeholder art.

## Rules Codex

- Static reference. No dice rollers, calculators or state.
- Tables render from YAML; prose from Markdown. One rule lives in one place.
- The combat chapter is laid out for mid-fight lookup: each reference panel
  fits one screen and can be pinned.
- A page or table may carry `status: rework | placeholder | open-question`
  and then shows a banner. Fates and Deck combat are placeholders.
- Transcribe the house rules as written. Where the source is ambiguous or
  cut off, do not invent the rule: mark it `open-question`.

### Parked questions — raise these with the user when phase 1 starts

- Boost meter: the table mixes unit-less values with "+damage before DR".
  Units and gain per action are undefined.
- Knockdown: "1/2 damage or more" versus "more than 1/2 of HP in a single
  injury".
- Hit locations: the legs rule stops mid-sentence.
- Fates (under rework) and Deck combat (no rules yet): placeholder pages.

Settled: Bloodied applies both effects together — half Move and Dodge, and
-1 HP per turn with -2 active defences.

## Character sheets and tracking

Sources per character, in `characters/<slug>/`:

- `<slug>.gcs` — GURPS Character Sheet file, read as-is, never written.
  Attributes, secondary characteristics, speed, HP/FP maximums, traits,
  skills, weapons, equipment, point totals.
- `profile.yaml` — what GCS does not hold: title, player, portrait, the six
  Essos affinities (Cultivation, Magic, Invocation, Awakened, Modulation,
  Transmission), inventory notes.
- `sheet.pdf` — the Canva + GCS sheet, shown untouched in the PDF view.
- `tracking.json` — written by the app only.

Tracking rules (implement in `src/core/tracking`, pure, fully unit-tested):

- Two pools, `essos` and `reserve`, integers 0–100, both start at 100.
- Spend N from a pool: allowed only if N <= current value. Otherwise refuse
  and tell the user; never clamp silently.
- Gain N to `essos`: caps at 100. `reserve` has no gain action.
- Reset from Reserve: allowed when `reserve` >= 25. Sets `essos` to 100 and
  subtracts 25 from `reserve`.
- `reserve` at 0 puts the character in the Depleted state (practically dead
  until treated). Show it prominently.
- Long rest: sets both pools to 100.
- Medical treatment: a GM action that sets `reserve` to a chosen value.
- HP and FP: current values against sheet maximums. Flag at or below 1/3
  (Bloodied) and at or below 0.
- Exceed: 3 slots per encounter. "New encounter" restores all three.
- Meta-currencies, each a running integer: Plot Points (max 1 spent per
  combat), Flashback Points (cost 2 in combat, 1 outside), Dharma, Karma
  (increases by each Dharma spent; warn approaching 108), Wildcard Points.
- Effects: a list of `{ name, note?, turnsLeft? }`. Presets come from
  `conditions.yaml`; free text is allowed.
- Every change is saved immediately. Keep a short undo history.

One assumption awaits confirmation: whether a reset from Reserve is allowed
at any time or only when `essos` is 0. Keep it as a named option so it is a
one-line change.

Sheet data has one internal schema (`src/core/schemas/sheet.ts`). It is
filled either by the GCS importer or from a hand-written `sheet.yaml`; the
interface never knows which. No real `.gcs` file has been supplied yet, so
build the schema and the `sheet.yaml` path first, from the fields on the GCS
PDF export, and add the importer when a file arrives. Do not parse PDFs.

The pools are the visual centrepiece of the sheet: animated vessels whose
level falls or rises smoothly, with marks at 90, 75, 50 and 25. The number
updates instantly; the animation follows.

## Design and motion rules

- Use tokens from `renderer/design/tokens`. No raw hex colours, font names or
  one-off shadows inside sections.
- Build screens from the core components in `renderer/design`. If a section
  needs a new pattern, add it to the design system first.
- Use the named transitions (ink reveal, page turn, dissolve through light,
  unfurl, shared element, camera move). Do not invent a new transition
  inside a section; propose it for the design system.
- Animate `transform` and `opacity` only. Clean up every GSAP timeline on
  unmount (`useGSAP` with a scope).
- Honour the motion setting (Full / Reduced / Off) and
  `prefers-reduced-motion` in every animation. Reduced means cross-fades
  only; Off means instant.
- No transition may block input for more than about 600 ms.
- Fonts and all assets are bundled locally. No CDN links.
- Visual direction: illuminated manuscript — parchment, ink, gold, ember on
  night blue. No assets from films or games in the app itself.

## Map rules

- FMG is loaded in a sandboxed frame from the `iornia://` protocol and opens
  `map/world.map`. The section can be disabled in settings; when disabled,
  FMG is never loaded.
- Prefer zero patches to `vendor/fmg`. Any patch is minimal and listed in
  `vendor/fmg/PATCHES.md`.
- Keep its MIT licence notice in the About screen.

## How to work in this repo

1. Start each phase by writing or reading its spec in `docs/specs/`. The
   spec lists screens, file schema and acceptance checks.
2. Order within a phase: schema and sample content → loader and tests →
   interface with placeholder styling → design system pass → motion.
3. Small commits, one concern each. Conventional commit prefixes
   (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
4. When a decision changes the design, update `docs/DESIGN.md` and this file
   in the same commit.
5. Ask before: adding a dependency, changing a schema that has shipped,
   editing `vendor/fmg`, or changing anything under "Architecture rules" or
   "Scope guard".

## Legal

GURPS is a trademark of Steve Jackson Games. This app contains only the
campaign's house rules and original content. Never add text from GURPS
rulebooks to the repo or to `sample-campaign/`.
