# Phase 0 — Foundation

schema: 1

## Goal

Stand up the repository, the Electron shell, and the content pipeline well
enough to prove the mechanism every later phase depends on: a campaign
folder on disk drives what the app shows, live, with no server and no
database. No section (Codex, Sheets, Wiki, etc.) is built in this phase —
only one placeholder screen exists, to prove the shell and pipeline work.

## Screens

**Placeholder screen** (`src/renderer/shell/App.tsx`), shown after the
launch sequence:

- Shows the active campaign's name (from `campaign.yaml`).
- Shows the title and body of one sample document
  (`lore/events/founding-of-iornia.md`), read through the content API.
- Re-renders automatically when that file changes on disk — no manual
  refresh, no app restart.
- Styled with design tokens (Step 5), not raw hex/fonts.

**Launch sequence** (`src/renderer/shell/LaunchSequence.tsx`): the IORNIA
wordmark animates in once per launch, then yields to the placeholder screen.
Respects the Full/Reduced/Off motion setting and `prefers-reduced-motion`.

## File schemas

### `campaign.yaml`

```yaml
schema: 1
name: string          # required
tagline: string        # optional
```

Zod schema: `src/core/schemas/campaign.ts`.

### Generic doc (Markdown + YAML front matter)

Used for the one sample content file in this phase. Later phases replace
this with their own specific schemas (character, lore event, rule page,
etc.) — this generic shape only needs to prove the pipeline.

```yaml
---
schema: 1
title: string          # required
date: string            # optional, ISO date
---
Markdown body...
```

Zod schema: `src/core/schemas/doc.ts`.

### Validation behavior (applies to both schemas, and to every schema added
in later phases)

- A file that fails validation must never crash the app.
- The loader returns a structured error naming the file, and where possible
  the offending field, instead of throwing.
- On a reparse failure (e.g. the user saves a momentarily-invalid file), the
  last good parsed version stays in use until a valid version is saved.

## Sample campaign content

`sample-campaign/` contains exactly two files for this phase:

- `campaign.yaml`
- `lore/events/founding-of-iornia.md`

No other folders (`rules/`, `characters/`, `map/`, etc.) are created yet —
each later phase adds the directories and schemas it actually needs.
Placeholder prose only; no real campaign content, no GURPS rulebook text.

## Acceptance checks

1. `npm run dev` opens a window, plays the wordmark launch sequence once,
   then shows the placeholder screen with the sample campaign's name and
   the sample document's title/body.
2. Editing `sample-campaign/lore/events/founding-of-iornia.md` on disk while
   the dev app is running updates the open window without a restart.
3. `npm run typecheck`, `npm run lint`, `npm run test` all pass.
4. `npm run dist` produces installers for `nsis` (Windows), `AppImage`, and
   `deb` (Linux) without error, built locally on Linux.
5. Installing and running the built Linux package (`.deb` or `AppImage`)
   and repeating check 2 against that installed app behaves the same as
   `npm run dev`.
6. `npm run e2e` (Playwright, against the built app) passes.

Windows installer verification is build-only for this phase — no
install-and-run check on a real Windows machine yet; that is deferred until
Windows access exists.

## Out of scope for this phase

- Any of the six sections (Codex, Sheets, Wiki, Relationships, Map, Lore
  Tree) beyond the one placeholder screen.
- Search (MiniSearch is installed as a dependency but not wired up).
- Character tracking, GCS import, the map generator, content packs.
- Section-specific content schemas (characters, rules, relationships, lore
  events, etc.) — only the generic doc schema and `campaign.yaml` exist.
