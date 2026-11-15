# IORNIA — Design Document

Last updated: 14 November 2026

## Overview

IORNIA is an installable desktop app for Windows and Linux that acts as the living book of the campaign: rules, people, map, history, relationships and character sheets in one place. It runs entirely from local files, with no server and no account.

The game runs on GURPS mechanics extended by the campaign's own house rules (Aura, Essos, Exceed, Boost, Bloodied, ablative DR and the rest). The app treats those house rules as data it reads, not logic baked into code, because they are still changing.

**Goals**

- One app holding six sections: Rules Codex, Character Sheets, Character Wiki, Relationship Web, World Map and Lore Tree.

- The house rules, combat included, written out cleanly as a reference that is quick to consult mid-session.

- Character sheets with live tracking: two animated Essos pools, HP, FP and current effects.

- All content lives in a plain campaign folder. Dropping in or editing a Markdown, YAML or JSON file updates the app while it is running.

- A hand-crafted high-fantasy look with heavy, deliberate motion. It should feel like opening an illuminated book, not a dashboard.

- Built one section at a time. Each section is usable on its own before the next begins.

- A GM's tool first. Player copies and player editing are decided later.

**Non-goals for version 1**

- No hosted backend, login or cloud database.

- No combat tracker or virtual tabletop. Fights are run in Owlbear Rodeo; IORNIA supplies the rules reference and the character tracking beside it.

- No GURPS rulebook text. The app carries only the house rules and the campaign's own material.

- No macOS or mobile build, though nothing in the stack rules them out later.

## Decisions at a glance

The recommended stack is Electron, React and TypeScript, with GSAP and Motion for animation and a plain folder of Markdown and YAML files as the only data store.

| Layer               | Choice                                                                                          | Why this one                                                                                                           |
|---------------------|-------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Desktop shell       | Electron (45.x is current stable)                                                               | Ships its own Chromium, so animation and the map render identically on Windows and Linux. See the note below on Tauri. |
| Build and packaging | electron-vite for development, electron-builder for installers                                  | One command produces a Windows installer (NSIS .exe) and Linux AppImage and .deb.                                      |
| Language            | TypeScript, strict mode                                                                         | One language across main process, renderer and rules engine. Types double as the content schema.                       |
| UI framework        | React with Vite                                                                                 | Largest ecosystem for the animation and graph libraries below, and the one Claude writes most fluently.                |
| Styling             | Tailwind CSS plus CSS variables for design tokens                                               | Tokens (parchment, gold, ink, ember) are defined once and reused by every section.                                     |
| Component base      | Radix UI primitives, skinned by hand                                                            | Unstyled and accessible. Pre-themed kits such as MUI fight a fantasy look.                                             |
| Cinematic animation | GSAP with SplitText, DrawSVG, MorphSVG and Flip                                                 | Timeline control for title reveals, ink-drawn lines and image-to-image transitions. All plugins are now free.          |
| Interface animation | Motion (formerly Framer Motion)                                                                 | Enter, exit, layout and shared-element transitions declared on React components.                                       |
| Ambient effects     | PixiJS on a WebGL canvas layer                                                                  | Embers, drifting fog, dust and parallax without slowing the interface above it.                                        |
| Content formats     | Markdown with YAML front matter for prose, YAML for structured data, JSON for app-written state | Hand-editable, diff-friendly, and standard. XML is not used.                                                           |
| Content pipeline    | gray-matter and remark to parse, Zod to validate, chokidar to watch the folder                  | A bad file produces a readable error naming the file and field. A good file appears in the app within a second.        |
| Search              | MiniSearch, in-memory index built at launch                                                     | Full-text search over the whole campaign with no database.                                                             |
| App state           | Zustand, with each character's tracking saved to its own file                                   | Small and sufficient: the only live state is each character's pools, HP, FP and effects.                               |
| World map           | Azgaar's Fantasy Map Generator, vendored at a pinned version and loaded in a sandboxed frame    | MIT-licensed, and already ships as an Electron desktop app itself.                                                     |
| Relationship graph  | React Flow, with d3-force for layout                                                            | Nodes are ordinary React components, so each can be a portrait medallion with the same styling as the rest of the app. |
| PDF sheets          | PDF.js to display the existing Canva and GCS sheet                                              | Shows each sheet exactly as it was designed. The interactive sheet reads the GCS file directly.                        |
| Tests               | Vitest for the loaders and the pool rules, Playwright for the packaged app                      | File loading and the pool arithmetic are the parts most worth testing.                                                 |

**Why Electron and not Tauri.** Tauri makes much smaller installers, but on Linux it renders through the system's WebKitGTK instead of Chromium. WebKitGTK trails Chromium on newer CSS and on animation and WebGL performance, and it varies by distribution. Linux is a main target here and heavy animation is a core requirement, so a consistent engine matters more than a 100 MB saving on disk.

**Licence notes.** GSAP's no-charge licence covers this kind of app; its one restriction concerns tools that let users build animations visually, which IORNIA is not. Azgaar's generator is MIT; keep its licence notice in the About screen.

## Architecture

The app has three layers, and only one of them touches the disk: the Electron main process reads and writes the campaign folder, and the interface asks it for everything through a small typed bridge.

```
Campaign folder  <-- files -->  Main process  <-- typed bridge -->  Interface (React)
(Markdown, YAML, JSON,          (parse, validate, index,            (shell + six section
 images, map file)               watch, write, serve)                modules; no file access)

                                 Shared core: content schemas and tracking rules
                                 (pure TypeScript, used by both sides, unit-tested)
```

**Main process (Node).** Opens the campaign folder, parses and validates every file, builds the in-memory index, and watches for changes. It also serves the vendored map generator and campaign images over a private iornia:// protocol, and performs every write: saving a character's pools and effects, a new wiki entry, an edited relationship.

**Preload bridge.** Exposes a narrow, typed API to the interface, for example content.get, content.search, content.onChange, tracking.save and campaign.open. The interface has no direct file or Node access. This keeps the security model simple and makes every section testable against a fake bridge.

**Renderer (React).** One shell providing navigation, theme, transitions, search and the ambient effects layer, plus one self-contained module per section. Modules never import from each other. They share only the content API, the design system and the entity link format.

**Shared core.** Plain TypeScript with no Electron or React imports: the content schemas, and the small tracking engine that applies pool, HP, FP and effect changes. Because it is pure, it is unit-tested directly.

Three rules hold the design together:

1.  **Every piece of content is an entity with a stable id.** A character, place, faction, lore event or rule is addressed as type:slug, for example character:kael. Wiki links, map markers, relationship edges and sheets all point at these ids, which is what lets the sections cross-link.

2.  **The folder is the source of truth.** The index is rebuilt from files at every launch. Nothing lives only inside the app.

3.  **Rules are data.** Maneuvers, conditions, modifiers and costs are YAML tables the Codex renders, so a house-rule change is a file edit, not a release.

## The campaign folder

Everything the app shows comes from one folder the GM owns, kept separate from the installed program. Updating the campaign means adding or editing a file in it; updating the app means installing a new version. Neither touches the other.

```
iornia-campaign/
  campaign.yaml            name, calendar, eras, theme options
  rules/
    codex/                 house rules as Markdown pages
    data/                  maneuvers.yaml, conditions.yaml, modifiers.yaml,
                           essos.yaml, exceed.yaml, hit-locations.yaml, xp.yaml
  characters/
    salazar/
      salazar.md           wiki page: front matter + prose
      salazar.gcs          GURPS Character Sheet file, read as-is
      sheet.yaml           the same data typed by hand, until a .gcs file exists
      profile.yaml         what GCS does not hold: Essos affinities, title, player
      sheet.pdf            the Canva + GCS sheet, for the PDF view
      portrait.webp
      tracking.json        live pools, HP, FP, counters, effects (app-written)
  places/  factions/  items/   more wiki entities, same shape
  lore/
    eras.yaml              the sections of the tree
    events/                one Markdown file per lore bubble
  relationships/
    edges.yaml             who is tied to whom, and how
  map/
    world.map              Azgaar save file
  assets/                  shared images, textures, audio
```

**Three formats, one rule each**

| Format                          | Used for                                                                     | Written by                                          |
|---------------------------------|------------------------------------------------------------------------------|-----------------------------------------------------|
| Markdown with YAML front matter | Anything read as prose: wiki pages, lore events, rule pages                  | People, in any text editor, or through in-app forms |
| YAML                            | Structured data people maintain: sheets, rule tables, relationships, eras    | People, or in-app editors                           |
| JSON                            | State the app writes for itself: character tracking, settings, window layout | The app only                                        |

A wiki page looks like this:

```markdown
---
id: character:kael
name: Kael Varros
kind: pc
player: ahad
tags: [essos-user, trial-contestant]
portrait: portrait.webp
visibility: public
---
Raised in the ash markets of [[place:veyra]], Kael ...
```

**How a drop-in update works**

1.  A file lands in the folder: copied in, saved from an editor, or pulled from a shared copy.

2.  The watcher notices, and the loader parses and validates that one file against its schema.

3.  If it is valid, the index updates and any open view refreshes in place. If not, a notice names the file, the line and the field, and the previous version stays in use.

**Conventions**

- [[type:slug]] links any entity from any prose. Broken links are listed in a campaign health panel instead of failing silently.

- Every file carries a schema version, so later app versions can migrate old content automatically.

- JSON Schemas are generated from the Zod definitions and shipped with the app, so an editor such as VS Code autocompletes and checks campaign files as they are typed.

- **Content packs:** a pack is a zip of this same layout. Importing one merges it into the folder, which covers both handing content to players and downloading published updates.

## The six sections

Each section is a separate module that reads entities through the content API and can be built, shipped and used without the others.

### Rules Codex

The house rules as a clean, searchable, cross-linked book, replacing the 41-page PDF. This is the heart of the app and the first section built. It is static reference: nothing here is interactive beyond search, links and navigation.

Pages are Markdown; the tables (maneuvers, posture, range, task difficulty, hit locations, Essos costs, XP awards, event tiers) are YAML rendered as styled tables, so a rule change is one file edit.

**Combat reference.** Combat is run in Owlbear Rodeo, so IORNIA's job is to make the rules fast to consult beside it. The combat chapter is laid out for use mid-fight: the turn sequence, the colour-coded maneuver table, active defences, modifiers and conditions each on one screen, with any panel pinnable so it stays visible while browsing elsewhere.

Rules marked as under rework or with open questions carry a status field and show a banner. Fates and Deck combat go in this way, as placeholders.

### Character Wiki

One page per character, place, faction or item, with a portrait, an infobox built from front matter, prose, backlinks ("mentioned in") and tags. New entries are files, so the wiki grows by adding to the folder or through an in-app "new entry" form that writes the file.

### World Map

Azgaar's Fantasy Map Generator runs inside the app as it is, in a sandboxed frame, and opens map/world.map. All map work, viewing and editing alike, happens in the generator's own interface. The section can be switched off in settings, in which case the generator is never loaded.

It is vendored at a pinned version so a generator update can never break the saved map. Linking towns on the map to wiki pages is a possible later addition, not part of the first build.

### Character Sheets

The one interactive section. Each character has a PDF view, showing the existing Canva and GCS sheet untouched, and a live sheet that rebuilds the same layout natively and adds tracking.

**Where the sheet's content comes from**

| Part of the sheet                                                                                                                                               | Source                                                                                                                                                                         |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Attributes, secondary characteristics, speed, HP and FP maximums, traits, skills, melee weapons, equipment, point totals                                        | The character's .gcs file, read directly. Re-saving in GCS updates the app. Until the file is to hand, the same fields can be typed into a sheet.yaml in the app's own format. |
| Name and title, player, portrait, the six Essos affinities on the hexagon (Cultivation, Magic, Invocation, Awakened, Modulation, Transmission), inventory notes | profile.yaml, the parts the Canva header adds                                                                                                                                  |
| Current pools, HP, FP and effects                                                                                                                               | tracking.json, written by the app                                                                                                                                              |

**Essos pools.** Two animated vessels side by side, Essos and Reserve, each starting at 100% and marked at 90, 75, 50 and 25 as on the current sheet.

- **Spend:** enter a percentage and the pool drains by that amount, the level falling smoothly. Quick buttons cover the common costs (10, 15, 25, 30, 40).

- **Gain:** the Essos pool can also be raised by an amount, for recharge from Concentrate or an Exceed slot. It never passes 100%.

- **Reset from Reserve:** one action returns Essos to 100%, ready for its next use, and takes 25% from Reserve. A full Reserve therefore holds four resets. The action is unavailable when Reserve is below 25%.

- **Reserve only goes down in play.** At 0% the character is marked Depleted: practically dead until treated. The vessel shows this state unmistakably.

- **Long rest:** one action returns both pools to 100%.

- **Medical treatment:** the GM can set Reserve to a chosen value, for a character brought back by treatment instead of rest.

- A spend larger than what is left is refused with a prompt, not silently clamped.

**HP and FP.** Current values with plus and minus controls against the maximums from GCS. The 1/3 threshold raises a Bloodied marker, and 0 is flagged.

**Exceed and the meta-currencies.** Counters on the same sheet, each with its own reset rule:

| Counter          | Behaviour                                                                                                |
|------------------|----------------------------------------------------------------------------------------------------------|
| Exceed slots     | 3 per encounter, shown as three seals that are broken one at a time. "New encounter" restores all three. |
| Plot Points      | A running total the GM awards. Spending is limited to 1 per combat.                                      |
| Flashback Points | A running total. A spend costs 2 in combat and 1 outside it.                                             |
| Dharma           | Gained in play and spent on rerolls, flesh wounds and the like.                                          |
| Karma            | Rises by each point of Dharma spent. A warning shows as it nears 108.                                    |
| Wildcard Points  | A running total, spent as a Karma-free alternative to Dharma.                                            |

**Current effects.** A list on the sheet where effects are added and removed: a name, an optional note, and an optional number of turns that can be counted down. Common ones (Bloodied, Stunned, Shock, Desperation, posture) are offered as presets from conditions.yaml; anything else is typed freely.

**Behaviour.** Every change saves at once to tracking.json, so closing the app mid-session loses nothing. An undo steps back through recent changes. The GM can open several characters side by side as a party view.

A later step is spending straight from an ability: the traits on the sheet already state their Essos cost, so selecting one could drain the pool by that amount.

### Lore Tree

The history of the world drawn as one great illustrated tree, in the manner of a tapestry. Roots are the oldest age and the crown is the present; each era from lore/eras.yaml is a region of the tree.

Entering an era zooms the camera into that bough, where each lore event appears as a glowing bubble sized by importance. Opening a bubble unfurls its text, images and links to the people and places involved.

New bubbles are added through a form that writes a Markdown file into lore/events/. Letting players add their own, kept in a separate layer, is planned for when player editing is opened up.

Technically: layered artwork, pan and zoom with d3-zoom, bubbles as React components positioned in tree coordinates, GSAP for camera moves, and the PixiJS layer for drifting motes and leaves.

### Relationship Web

A graph of who is bound to whom. Nodes are portrait medallions for characters and crests for factions; edges are typed (kin, ally, rival, sworn, debt, secret) with a strength and an optional note, stored in relationships/edges.yaml.

The view filters by edge type, faction or "centred on this character", and edges can carry a date range so the web can be viewed as it stood in a given era. Every wiki page shows that entity's slice of the web.

## Visual and motion design

The look is an illuminated manuscript brought to life: aged parchment, ink and gold leaf for reading surfaces, deep night-blue and ember light for the frame around them. The reference points are the hand-drawn warmth of Tolkien-style cartography and the ornate menu craft of the Final Fantasy series, without copying either.

**Design system first.** Before any section is built, a small design system fixes the tokens and core components every section reuses. This is what keeps six sections built months apart looking like one app.

| Element       | Direction                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Wordmark      | IORNIA as custom lettering in an uncial, hand-cut style, drawn as SVG so it can be animated stroke by stroke on launch.                   |
| Display type  | Cinzel or Cinzel Decorative for titles; Uncial Antiqua or IM Fell English for ornamental use.                                             |
| Reading type  | EB Garamond or Cormorant Garamond for body text. Sheet numbers use a clear tabular face so they stay readable at a glance.                |
| Colour tokens | Parchment, ink, gold, ember, verdigris, blood and night, each with a small tonal range. Sections may add one accent, never a new palette. |
| Surfaces      | Parchment panels with torn or gilded edges, carved frame borders built as scalable SVG, wax-seal and ribbon details for status.           |
| Iconography   | One hand-drawn icon set in a single line weight, used everywhere.                                                                         |

All of the named typefaces are open-licence and are bundled with the app so it works offline. The wordmark and frames should be original work, not film or game assets.

**Motion language.** Motion is heavy but consistent. A handful of named transitions are built once and reused, instead of each screen inventing its own.

| Transition             | Where it is used                                                                             | Built with                                             |
|------------------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------|
| Ink reveal             | Titles and headings write themselves in; ornamental lines draw on.                           | GSAP SplitText and DrawSVG                             |
| Page turn              | Moving between sections, like leaves of a book.                                              | Motion route transitions with a GSAP mask              |
| Dissolve through light | Image to image: the old picture burns out to gold as the new one fades up with a slow drift. | GSAP timeline over a mask, or the View Transitions API |
| Unfurl                 | Panels, lore bubbles and sheets open like a scroll.                                          | Motion layout animation                                |
| Shared element         | A portrait travels from a list into its page, or from the web into the wiki.                 | Motion shared layout, GSAP Flip                        |
| Camera move            | Flying into an era of the lore tree or across the relationship web.                          | GSAP driving d3-zoom                                   |
| Ambient                | Embers, dust, fog and slow parallax behind the interface.                                    | PixiJS                                                 |

**Guard rails**

- One transition plays at a time, and none blocks input for longer than about 600 ms. Sheet tracking is the exception: a pool or HP change registers at once and the animation follows.

- A motion setting offers Full, Reduced and Off, and the operating system's reduced-motion preference is respected by default.

- Animate transforms and opacity only, and hold 60 frames per second on a mid-range laptop with integrated graphics. Ambient effects drop quality automatically if frames fall.

- Optional sound (page rustle, a low chime) is off by default and separate from the motion setting.

## GM first, players later

IORNIA is a GM's tool first: one person, one machine, one campaign folder, with play happening remotely over Discord and Owlbear Rodeo. Nothing needs to be synced or hidden in the first build.

**During a session.** The GM runs IORNIA alongside Owlbear Rodeo and shares its window when the table needs to see a rule, a sheet or the map.

**Later, when players get copies.** The campaign folder is ordinary files, so it can be handed over as a content pack (a zip the app imports) or kept in a synced folder. What players may edit is decided then. Two things are kept in the design now so that step is cheap:

- Every entity has a visibility field, public by default. A player pack would leave GM-only files out entirely, since hiding them in the interface is not enough when players hold the files.

- Tracking is saved per character in its own file, so a player running their own sheet never touches anyone else's.

## Build roadmap

The build runs as a foundation phase followed by one section per phase, and no phase starts until the one before it meets its "done when" line. There are no dates; the pace is yours.

| Phase                  | What gets built                                                                                                                       | Done when                                                                                                                                                 |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0. Foundation         | Repository, Electron shell, content pipeline with live reload, design system, launch sequence with the animated wordmark, installers. | The app installs on Windows and Linux, opens a sample campaign folder, and a Markdown file edited on disk re-renders in the open app.                     |
| 1. Rules Codex        | The house rules moved from the PDF into Markdown pages and YAML tables, with search and the pinnable combat reference.                | Every rule in the PDF can be found in the app, and the maneuver table renders from maneuvers.yaml.                                                        |
| 2. Character Sheets   | GCS import, the live sheet in the Canva layout, PDF view, the two Essos pools, HP, FP, effects, party view.                           | Salazar's sheet matches the PDF field for field, and a session's worth of pool spends, refills and a long rest behave as specified and survive a restart. |
| 3. Character Wiki     | Entity pages, infoboxes, [[links]], backlinks, tags, the new-entry form.                                                          | A new character file dropped in the folder appears with working links both ways.                                                                          |
| 4. Relationship Web   | Graph view, typed edges, filters, the per-entity slice on wiki pages.                                                                 | Editing edges.yaml redraws the web, and a node opens its wiki page.                                                                                       |
| 5. World Map          | The embedded generator, automatic map load, the on/off setting.                                                                       | The campaign map opens and can be edited and saved inside the app.                                                                                        |
| 6. Lore Tree          | Tree artwork, eras, bubbles, camera, the add-a-bubble form.                                                                           | The full timeline is navigable and a new bubble can be added from inside the app.                                                                         |
| 7. Players and polish | Content packs, player copies, what players may edit, performance pass.                                                                | A player installs the app, imports a pack and sees the campaign without GM-only content.                                                                  |

**Why this order.** The Codex and the sheets are what you asked for most, so they come first; the Codex also produces the conditions and Essos data the sheet uses. The Lore Tree is late because it depends most on finished artwork, which can be prepared in parallel.

After phase 2, phases 3 to 6 can be reordered freely, except that the Relationship Web needs the Wiki.

**How each phase is run with Claude**

1.  Write a short spec for the section in docs/specs/, covering the screens, the file schema and the acceptance checks. Agree it before any code.

2.  Define the schema and sample content first, then the loader and its tests, then the interface, then motion.

3.  Close the phase by updating CLAUDE.md and the spec with anything that changed, so the next session starts from the truth.

## Risks and open questions

With combat tracking and map linking out of scope, the remaining risks are small. The main one is artwork, because the look depends on it and code cannot supply it.

**Risks**

| Risk              | What could go wrong                                                                                                                      | Mitigation                                                                                                                                                          |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Artwork           | The fantasy look depends on illustration: the tree, frames, textures and wordmark. Generated art can drift in style from piece to piece. | Fix a style reference early and generate against it. Build with placeholder art behind the same tokens so final art drops in.                                       |
| Borrowed images   | Pictures saved from Pinterest belong to their artists.                                                                                   | Fine for private use at your own table. Keep them in the campaign folder, never in the app itself, and replace them before the app or a pack is shared more widely. |
| GCS file format   | The live sheet depends on reading .gcs files, and the format can change between GCS versions.                                            | Build the importer against your real files, record the GCS version, and fail with a clear message on a format it does not know.                                     |
| Map file versions | A newer generator may not open an older .map file cleanly, and the reverse.                                                              | Pin the vendored version. Upgrade deliberately, with a backup of the map.                                                                                           |
| Animation weight  | Heavy motion can make a reference tool tiresome in the middle of a session.                                                              | The motion setting, the 600 ms ceiling, and pool changes that register instantly.                                                                                   |
| GURPS material    | GURPS is a Steve Jackson Games property.                                                                                                 | The app carries only house rules and campaign content, never rulebook text. Check their online policy before distributing beyond the table.                         |

**Decided on 14 November 2026**

- Play is remote. Combat runs in Owlbear Rodeo; IORNIA does not track fights.

- Combat rules are static reference. Only the character sheet is interactive.

- The GM is the only editor for now. What players may change is decided later.

- Art is generated, made by the GM, or collected from Pinterest.

- Sheets are made in GCS and laid out in Canva.

- The map generator runs inside the app unchanged and can be switched off.

- Bloodied applies both effects together: half Move and Dodge, and -1 HP per turn with -2 active defences.

- A long rest restores both pools to 100%. Reserve at 0% means the character is practically dead until treated.

- Exceed slots and the meta-currencies are tracked on the sheet alongside the pools, HP, FP and effects.

**To confirm before phase 2**

1.  Can Essos be reset from Reserve at any point, or only once it has reached 0? The design now allows it at any point.

2.  A real .gcs file is still needed to build the importer against. The exported PDF shows which fields exist but cannot be read back reliably.

**Parked house-rule questions, to raise again when the Codex is written (phase 1)**

- Boost meter: the table mixes unit-less values (+1, -2, -3) with "+damage before DR"; the units and the gain per action need stating.

- Knockdown: "1/2 damage or more" (page 3) and "more than 1/2 of HP in a single injury" (page 7) differ.

- Hit locations: the rule for legs stops mid-sentence.

- Fates is under rework and Deck combat has no rules yet. Both go into the Codex as placeholder pages with a banner.

## Sources

- [Electron releases](https://releases.electronjs.org/) for the current stable version

- [Electron vs Tauri comparison, Capgo](https://capgo.app/blog/electron-vs-tauri-capacitor/) for the Linux WebKitGTK trade-off

- [GSAP standard licence](https://gsap.com/community/standard-license/) for the no-charge terms and their restriction

- [Azgaar's Fantasy Map Generator repository](https://github.com/Azgaar/Fantasy-Map-Generator) for its tooling and desktop builds

- Combat Steps and House Rules PDF and the Salazar character sheet PDF, supplied by the author
