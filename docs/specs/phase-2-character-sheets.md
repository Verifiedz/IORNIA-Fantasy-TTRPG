# Phase 2 — Character Sheets

schema: 1

## Goal

The only interactive section. Each character gets a live sheet that
rebuilds the Canva layout natively and adds tracking (pools, HP, FP,
Exceed, meta-currencies, effects), plus an untouched PDF view of the
existing Canva+GCS sheet. Everything the GM touches mid-session — a pool
spend, an HP change, a new effect — saves to disk immediately.

**Done when (per docs/DESIGN.md's roadmap):** a real character's live
sheet matches its PDF field for field, and a session's worth of pool
spends, refills and a long rest behave as specified and survive a
restart.

**Known gap, carried in from docs/DESIGN.md's "to confirm before phase
2":** no real `.gcs` file or Salazar PDF has been supplied to this
environment yet. Per CLAUDE.md's character-sheet section, this phase
builds the schema and the `sheet.yaml` hand-written path first, proves it
against a fictional sample character, and adds the GCS importer only when
a real file arrives — at which point the "done when" check above gets
re-run against the real character instead of the sample one. Do not parse
the GCS PDF export as a data source; it is reference for which fields
exist, not a read path.

**Resolved before this phase started:** reset-from-Reserve is allowed any
time Reserve >= 25%, not gated on Essos being at 0 (confirmed with the
user 2026-11-14). Implemented as a named option
(`resetRequiresEmptyEssos: boolean`, default `false`) per CLAUDE.md's
"keep it as a named option so it is a one-line change" — so flipping the
house rule later doesn't touch the call sites.

## Content mapping

Per character, in `characters/<slug>/`:

| File | Holds | Written by |
|---|---|---|
| `<slug>.gcs` | Attributes, secondary characteristics, speed, HP/FP maximums, traits, skills, weapons, equipment, point totals | GCS, read-only — **deferred, no importer yet** |
| `sheet.yaml` | The same fields as above, hand-typed | GM, until a `.gcs` file exists |
| `profile.yaml` | Name, title, player, portrait, the six Essos affinities (Cultivation, Magic, Invocation, Awakened, Modulation, Transmission), inventory notes | GM |
| `sheet.pdf` | The Canva+GCS sheet, shown untouched | External (Canva export) |
| `tracking.json` | Essos/Reserve pools, current HP/FP, Exceed slots, meta-currencies, effects | The app, exclusively |

`sheet.yaml` and a future `.gcs` import both resolve to one internal
schema (`src/core/schemas/sheet.ts`) — the rest of the app never knows
which source filled it. This mirrors how `rulesTable.ts` already serves
multiple YAML `kind`s behind one shape.

`sample-campaign/characters/` gets one small fictional character (working
name: `characters/thistlewood/`) with a `sheet.yaml`, `profile.yaml`,
`tracking.json` and a placeholder `sheet.pdf` (plain text, no borrowed
art) — enough to exercise every schema field and the full tracking state
machine in tests. Never real campaign content, per CLAUDE.md.

## Schema additions (`src/core/schemas/`)

- `sheet.ts` — attributes (ST/DX/IQ/HT or campaign equivalents — confirm
  exact GURPS attribute set against `sheet.yaml` fields once drafted),
  secondary characteristics, speed, HP/FP maximums, traits, skills,
  weapons, equipment, point totals. `schema: 1`. Validation failure
  reports file/field and keeps the last good version in use, per CLAUDE.md
  content rules — never crashes the app.
- `profile.ts` — title, player, portrait path, the six Essos affinities
  (each a number or rank — confirm scale when the first real profile is
  drafted), inventory notes (free text). `schema: 1`.
- `tracking.ts` — the only schema the app itself writes:
  - `essos: number` (0–100), `reserve: number` (0–100)
  - `hp: number`, `fp: number` (current; maximums come from `sheet.ts`)
  - `exceed: { used: 0 | 1 | 2 | 3 }`
  - `metaCurrencies: { plotPoints, flashbackPoints, dharma, karma, wildcardPoints }`
    (all non-negative running integers)
  - `effects: { name: string; note?: string; turnsLeft?: number }[]`
  - `schema: 1`

No new dependency and no database: `tracking.json` is plain JSON, written
by `src/main` only, per architecture rule 1.

## Core tracking logic (`src/core/tracking/`)

Pure TypeScript, no Electron/React, fully unit-tested in Vitest — this is
the one piece of real app logic in the whole section, so it carries the
weight of the "done when" check.

| Function | Rule |
|---|---|
| `spend(pool, amount)` | Refuses (returns a typed error, never clamps) if `amount > current`. |
| `gainEssos(amount)` | Caps at 100. No gain action exists for `reserve`. |
| `resetFromReserve(state, options)` | Sets `essos = 100`, `reserve -= 25`. Refused below 25 Reserve. Refused above 0 Essos only if `options.resetRequiresEmptyEssos` is true (default `false`, per the resolved question above). |
| `longRest(state)` | Sets both pools to 100. |
| `medicalTreatment(state, value)` | GM sets `reserve` to a chosen value directly (no formula). |
| `isDepleted(state)` | `reserve === 0`. |
| `adjustHp` / `adjustFp` | Plus/minus against the sheet's maximums; `isBloodied` at or below 1/3, flagged at or below 0. |
| `burnExceed` / `newEncounter` | 3 slots per encounter; `newEncounter` restores all three. |
| `spendMetaCurrency` | Enforces the per-currency spend limits from CLAUDE.md (Plot Points: max 1 spent per combat; Flashback Points: 2 in combat / 1 outside) — these limits need an `inCombat: boolean` passed in, since the pure function has no notion of session state on its own. Dharma spent increases Karma; warn (return a flag, not a thrown error) as Karma nears 108. |
| `addEffect` / `removeEffect` / `tickEffects` | List operations; `tickEffects` decrements every `turnsLeft` and drops effects that hit 0. |

Every function takes and returns a `TrackingState`, never mutates in
place — this is what makes the short undo history in the renderer
(Zustand, a plain array of recent states, capped at some small N, **not**
persisted to `tracking.json`) trivial: push the previous state before
applying a change.

## Loader and content API

- `src/main`: read `characters/<slug>/{sheet.yaml, profile.yaml,
  tracking.json, sheet.pdf}`, validate `sheet.yaml`/`profile.yaml`/
  `tracking.json` with their Zod schemas, build an in-memory index
  alongside the existing codex/rules index at launch. Re-reads on
  `chokidar` change like the rest of the content pipeline.
- Writes: a typed preload call per tracking action (`spendPool`,
  `gainEssos`, `resetFromReserve`, `longRest`, `medicalTreatment`,
  `adjustHp`, `adjustFp`, `burnExceed`, `newEncounter`,
  `spendMetaCurrency`, `addEffect`, `removeEffect`) — the renderer never
  computes a new `TrackingState` itself; it calls the bridge, main runs
  the pure `core/tracking` function, writes the result to
  `tracking.json`, and pushes the update back over the existing
  content-change channel. This keeps "only `src/main` touches the disk"
  intact and keeps the renderer from duplicating rule logic.
- A `sheet.yaml`/`profile.yaml`/`tracking.json` that fails validation
  reports file/field and the section shows that one character as broken
  without taking down the others or the rest of the app.

## Screens

1. **Character list** — one entry per `characters/<slug>/`, portrait
   thumbnail, name/title from `profile.yaml`. Opens the live sheet.
2. **Live sheet** — the Canva layout rebuilt natively:
   - Header: portrait, name, title, player, the six-affinity hexagon.
   - Two pool vessels (Essos, Reserve) side by side, marks at 90/75/50/25,
     quick-spend buttons (10/15/25/30/40), a gain control, reset-from-
     reserve action, long rest action, medical-treatment action (GM-only
     framing — no auth model, just a clearly separate control).
   - Depleted state (`reserve === 0`) shown unmistakably — not just a
     number at 0.
   - HP/FP with +/- controls against sheet maximums, Bloodied marker at
     1/3, flagged at 0.
   - Attributes, secondary characteristics, speed, traits, skills,
     weapons, equipment, point totals — read-only, straight from
     `sheet.ts`.
   - Exceed: three seals, break/restore, "new encounter" control.
   - Meta-currency counters with their spend-limit rules surfaced in the
     UI (not just enforced silently).
   - Effects list: presets read from `rules/data/conditions.yaml`
     (first column = name, second = effect text as the preset's note) via
     the same content API the Codex section already uses — this does
     **not** import from the codex section's React code, only its data,
     per architecture rule 4 — plus free-text entry, optional note,
     optional `turnsLeft` with a per-turn tick-down control.
3. **PDF view** — `sheet.pdf` shown untouched via PDF.js, view-only.
4. **Party view** — several characters' live sheets open side by side
   (a layout concern on top of the same single-character sheet
   component, not a separate data model).

## Design and motion

Built last, after schema/loader/interface-with-placeholder-styling, per
CLAUDE.md's phase order:

- Pool vessels: animated fill level (GSAP), the number updates instantly
  and the animation follows, per CLAUDE.md and DESIGN.md. Honors the
  motion setting (Full/Reduced/Off) — Reduced means the vessel still
  reaches its new level but as a cross-fade, not a flowing drain/fill; Off
  means it jumps instantly.
- Uses only existing design tokens and components from Phase 0/1; any new
  pattern (the pool vessel itself, the seal/Exceed control) gets added to
  `renderer/design` first, not built one-off inside `sections/sheets`.
- No new named transition — reuse "unfurl" for the effects list opening
  and panel-style layout already established.

## Acceptance checks

1. `sheet.yaml`, `profile.yaml` and `tracking.json` each validate via
   their Zod schema; a broken file reports file/field and doesn't crash
   the section or the app.
2. Every `src/core/tracking` function is pure and unit-tested, including
   every refusal path (overspend, reset below 25 Reserve, reset above 0
   Essos when `resetRequiresEmptyEssos` is true) and every cap (Essos
   gain at 100, both pools at 100 after long rest).
3. A spend larger than the current pool value is refused with a message,
   never silently clamped.
4. `reserve === 0` is visibly unmistakable as Depleted in the UI, not
   just a number.
5. A pool spend, a gain, a reset-from-reserve, and a long rest, performed
   in sequence, leave `tracking.json` matching the expected end state
   after an app restart (the restart check from DESIGN.md's "done when").
6. Effect presets render from `rules/data/conditions.yaml`, not
   hardcoded JSX; free-text effects work alongside presets.
7. `sample-campaign/characters/thistlewood/` exercises every schema field
   and is what Vitest/Playwright run against — never real campaign
   content.
8. typecheck, lint and tests pass; the change has been run in the app
   (`IORNIA_CAMPAIGN_PATH` pointed at a campaign folder with at least one
   character), not only compiled.
9. **Blocked pending a real file, tracked as a known gap, not a silent
   skip:** the GCS importer and the real "Salazar's sheet matches the PDF
   field for field" check from DESIGN.md's roadmap. Phase 2 is otherwise
   complete without them, the same way Phase 0 shipped Linux-only pending
   Windows access.

## Out of scope for this phase

- The GCS importer (no real `.gcs` file supplied yet — build the schema
  and `sheet.yaml` path only, per CLAUDE.md).
- Spending Essos straight from a trait/skill's listed cost — DESIGN.md
  calls this out as "a later step," not part of the first build.
- Any combat tracker, initiative, or turn engine — per the Scope guard,
  pool/HP/FP/effect tracking is the only live state; there is no fight
  engine underneath it.
- Character Wiki, Relationship Web, World Map, Lore Tree.
- Visibility-based player export filtering — the `visibility` field
  exists on every entity already but nothing reads it yet, per CLAUDE.md.
