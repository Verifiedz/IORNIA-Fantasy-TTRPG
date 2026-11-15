# Phase 1 — Rules Codex

schema: 1

## Goal

Move the house rules (currently `~/iornia-campaign-notes/HOUSE_RULES.md`,
transcribed from the 41-page PDF) into the app as a clean, searchable,
cross-linked static reference: tables render from YAML, prose from
Markdown. This is the heart of the app and the first real section built.
Nothing here is interactive beyond search, links, navigation and pinning.

The real content goes into `~/iornia-campaign/` (outside this repo, per the
earlier decision). `sample-campaign/` in this repo gets a small fictional
placeholder subset — enough to exercise the schema and UI in tests — not
the real rules.

**Done when:** every rule in HOUSE_RULES.md can be found in the app, the
maneuver table renders from `maneuvers.yaml`, the combat reference panels
are pinnable, search finds a rule by name, and every `[OPEN]`/rework item
from the source shows as `open-question`/`rework` instead of being
invented or silently dropped.

## Content mapping

CLAUDE.md fixes the data file set at exactly seven files. Every HOUSE_RULES
section maps to one of these, or to a Markdown codex page. (Section numbers
below refer to HOUSE_RULES.md.)

### `rules/data/maneuvers.yaml`

- §2.1 Maneuver list, Special options, Extra Effort options
- §2.2 Active defenses
- §2.3 Posture
- §10 New maneuvers (Extra Effort: Attack!, Reckless, Tactical Retreat, 3D
  Awareness, Long, Defensive Attack, Concentrate) — appended as additional
  maneuver/option entries, not a separate file
- `[OPEN]` carried through: Concentrate "WILL-3 2" (§2.1), damage penalty
  amounts for All-Out Attack: Long and Defensive Attack (§10)

### `rules/data/conditions.yaml`

- §2.6 Injury/Fatigue/Shock/Stun, knockdown
- §3.2 Bloodied (GM ruling already settled: both effect sets apply
  together — kept as the setting, not open)
- §3.3 Essos-counter Shock/knockdown
- This is also what the character sheet's effect presets read from later
  (Phase 2) — the entity shape (`name`, `effect`, modifiers) needs to work
  for both uses
- `[OPEN]` carried through: knockdown stated two ways (§2.6 vs §3.3) — **you
  asked to park this; marked `open-question`, not settled**

### `rules/data/modifiers.yaml`

- §2.4 Damage after DR (wounding multipliers)
- §2.5 Speed/Range modifier
- §2.8 Situation modifiers
- §12.1 Task Difficulty chart
- §12.3 BAD system tables
- §12.4 Issues system
- `[OPEN]` carried through: Task Difficulty +1 row label (§12.1), BAD table
  vs. stated formula (§12.3), Issues sentence cut off (§12.4)

### `rules/data/essos.yaml`

- §3.3 Essos counters (first part: type-counter damage multipliers)
- §3.4 Damage Resistance (natural/Aura DR, Ablative DR, PL templates) — DR
  is Aura-tied in the source, so it lives here rather than a new file
- §3.6 Aura (spend table, recharge, example actions)
- §13 Essos (Advantage cost, Essos-User skill, talent modifiers)
- `[OPEN]` carried through: Ablative DR example arithmetic (§3.4), Essos
  Advantage starting level + Essos-User formula ambiguity (§13), §13.1
  Abilities heading is empty

### `rules/data/exceed.yaml`

- §3.7 Exceed (3 slots, burn options)
- `[OPEN]` carried through, explicitly parked by you: Boost (§3.8) kept as
  a separate `status: open-question` entry here (no units/gain defined) —
  **not a rules/data file of its own**, since CLAUDE.md fixes the file set

### `rules/data/hit-locations.yaml`

- §11 Reworked hit locations
- `[OPEN]` carried through, explicitly parked by you: legs rule cut off

### `rules/data/xp.yaml`

- §8.1 XP for defeating enemies
- §8.3 Training XP + Training Points
- §8.4 Milestones (including the x2 group bonus)
- §8.5 Events tiers
- §8.2 marked `status: deprecated` per the source ("Deprecated")
- `[OPEN]` carried through: XP summary list cut off at "Completing" (§8.4)

### Markdown codex pages (`rules/codex/*.md`)

One page per topic, prose with embedded references to the YAML tables
above where relevant:

| Page | Source | Status |
|---|---|---|
| `combat-overview.md` | §1 Initiative/surprise, §2.7 to-hit formulas, §2.9 Grappling | `open-question` note on §2.9 (stops after the first step) |
| `combat-systems.md` | §9 Grid/Cinematic/Deck overview, §9.1 Cinematic battles, §9.2 Extra considerations | Deck Combat — **you said ignore**: page keeps §9's mention but shows a `placeholder` banner and no rules, per CLAUDE.md |
| `posture-break.md` | §3.5 | settled, no issues |
| `wildcard-skills.md` | §5 | settled |
| `fates.md` | §6, §6.1 Dharma/Karma | **you said ignore**: `rework` banner, Dharma/Karma kept since the sheet tracks Karma regardless |
| `meta-currencies.md` | §4 Plot Points, Flashback Points | settled |
| `healing.md` | §7 First Aid, recovery, potions | settled |
| `noncombat-modifiers.md` | §12.2 Degrees of success, prose around the §12.1/12.3/12.4 tables | `[NOTE]` on the +1 Task Difficulty row kept visible |
| `downtime.md` | §14 Time-Lock system | settled |
| `planned-systems.md` | §15 Retainer Protocol, Relationship System, World of Survival | `placeholder`, headings only |

`hit-locations.md`, `boost.md` are intentionally **not** separate codex
pages — hit locations render straight from `hit-locations.yaml`, and Boost
is one open-question entry in `exceed.yaml`, both with a reminder banner
rather than a dedicated page, since there's no settled prose to write yet.

## Schema additions (`src/core/schemas/`)

- `rulesTable.ts` — generic schema for a `rules/data/*.yaml` file: a
  `kind` discriminant (maneuver, condition, modifier, essos, exceed,
  hit-location, xp) and a list of entries, each with optional
  `status: open-question | rework | placeholder | deprecated` and
  `note` (renders the `[OPEN]`/`[NOTE]` banner).
- `codexPage.ts` — frontmatter schema for `rules/codex/*.md`: `schema`,
  `title`, optional `status`/`note` (page-level banner, e.g. Fates/Deck
  Combat/Planned Systems), `pinnable: boolean` (for the combat reference).

## Screens

1. **Codex home** — table of contents grouped by the sections above, a
   search box (MiniSearch over page titles/bodies and table entry names).
2. **Codex page** — renders a `codex/*.md` page's prose plus any
   referenced `rules/data/*.yaml` tables inline, with a status banner at
   the top if `status` is set.
3. **Combat reference** — the pinnable mid-fight panel set: maneuver
   table, active defenses, posture, situation modifiers, hit locations.
   Each panel fits one screen; a pin toggle keeps it visible while
   browsing elsewhere in the Codex (per CLAUDE.md's "mid-fight lookup"
   requirement). This is the first real use of the shell's search/pin
   affordances and of Radix primitives (tabs between panels, tooltip on
   open-question markers).

## Open-question / rework banner

A reusable `design` component (`StatusBanner`) shows `open-question`
(amber, "parked — ask the GM"), `rework` (amber, "under rework"), or
`placeholder` (grey, "not written yet"), reading the page's or table
entry's `status`/`note` field. This is the only new design-system
component Phase 1 needs beyond what Phase 0 already built.

## Acceptance checks

1. Every section of HOUSE_RULES.md has a home: either a `rules/data/*.yaml`
   entry or a `rules/codex/*.md` page (the table above is the checklist).
2. The maneuver table in the Combat Reference renders from
   `maneuvers.yaml`, not hardcoded JSX.
3. Search finds "Feint" (a maneuver), "Bloodied" (a condition) and
   "BAD" (a modifier system) and opens the right page/panel.
4. The 16 `[OPEN]` items (5 you parked explicitly + 11 found during
   transcription) all render a visible `open-question` banner; none are
   silently resolved or invented.
5. Fates, Deck Combat and Planned Systems show their `rework`/`placeholder`
   banner and no invented rules.
6. The Combat Reference panels can be pinned and stay visible while
   navigating to a different Codex page.
7. `sample-campaign/rules/` in this repo has a small fictional subset
   (2-3 maneuvers, 1-2 conditions) sufficient for the Vitest/Playwright
   suite — never the real content.
8. typecheck, lint, test pass; the change has been run in the app against
   `~/iornia-campaign/`, not only against `sample-campaign/`.

## Out of scope for this phase

- Any interactivity beyond search/pin/navigation — no dice rollers, no
  calculators, no state (per CLAUDE.md's Rules Codex rule and Scope
  guard).
- Character Sheets, Wiki, Map, Lore Tree, Relationship Web.
- Settling any of the 16 parked/open items — they stay visibly open until
  you resolve them.
- Boost meter and Knockdown specifically: **you asked to be reminded
  later** — this spec is that reminder; revisit when you're ready, not
  as a blocker for the rest of Phase 1.
