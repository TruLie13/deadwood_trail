# Deadwood Trail GUI Concept

## Goal

Add a Phaser-based GUI without replacing the existing shell game loop. The TypeScript simulation remains the source of truth. The shell and GUI become two render modes over the same engine.

## Presentation Direction

The target is the original Oregon Trail presentation grammar, adapted to Deadwood Trail:

- a traveling wagon scene as the primary viewport
- landscape layers that scroll during travel to sell westward motion
- a strong event callout band when story beats or hazards trigger
- a fixed information panel that stays legible while the trail scene moves

The reference image suggests a simple, readable composition rather than a dense simulation screen. Deadwood should keep that clarity, but with a harsher Weird West palette and custom trail landmarks.

## Recommended GUI Layout

### 1. Trail Viewport

- Main Phaser scene across the top half to top two-thirds of the screen
- Wagon and lead cattle stay anchored in a stable screen region while the trail scrolls
- Background should use layered movement:
  - sky and distant mesas move slowly
  - midground landmarks move at medium speed
  - foreground scrub and trail move fastest
- Landmark assets should swap by region:
  - San Antonio
  - Painted Canyons
  - El Paso
  - Staked Plains
  - Trading Post of the Damned
  - Nevada Salt Flats
  - Silver Fold approach

### 2. Event Banner

- Retro caption strip for moment-to-moment narrative
- Used for sickness, encounters, warnings, arrivals, and trade opportunities
- Should be short and high contrast, similar to the original Oregon Trail callout box

### 3. Fixed HUD

- `Week`, `Miles`, and `Location` pinned in one stable block
- `Items` card for food, blighted food, ammo, supplies, cash, whiskey, blessed grain, and warding oil
- `Crew` summary bar for morale, fear, and optionally mutiny pressure
- `Cattle` summary bar for amount, health, stress, fatigue, and blight
- `Wagon` summary bar for structure and sanctity
- Five `Crew Member` cards showing:
  - name
  - role/job
  - current status label

## Crew Card Recommendation

Each crew card should show the visible essentials first:

- name
- role
- status label: `Steady`, `Worn`, `Shaken`, `Breaking`, or `Gone`

The GUI snapshot now also exposes these member stats if the card design wants to use them:

- health
- morale
- fear
- hunger

That is enough to make the party feel readable without exposing every hidden calculation.

## Hidden Stats: What To Surface

Visible in GUI:

- per-crew `health`
- per-crew `hunger`
- per-crew `fear`
- group `mutinyPressure`
- group `mutinyChance` only if we want a more explicit strategy view later
- herd `blight`

Keep hidden for now:

- loyalty
- cattle skill
- hunt skill
- passive proc chances
- exact trigger logic for crew consequences
- exact trigger logic for stampede checks

That split preserves tension while still making failure feel legible.

## Engine Contract

The engine now exposes a GUI-oriented snapshot through:

- `DeadwoodGame.getUiSnapshot()`
- `window.DeadwoodTrailUi.snapshot`
- `window` event: `deadwood:ui-snapshot`

The snapshot includes:

- render mode
- current phase
- current and next location
- week and miles
- items/resources
- crew cards
- cattle and wagon bars
- status alerts
- currently available commands

This is the data contract the Phaser HUD should read from.

## Phaser Scene Split

Recommended first pass:

- `BootScene`: fonts, palette, sprite sheets, UI theme
- `TitleScene`: choose `Shell` or `GUI`
- `TrailScene`: scrolling trail viewport and persistent HUD
- `EventOverlayScene`: caption box, notices, landmark arrivals, encounter prompts

## First GUI Slice

The first playable GUI vertical slice should avoid custom encounter staging and focus on proving the loop:

1. Start a run in GUI mode.
2. Show the wagon scene with scrolling travel.
3. Render the fixed HUD with all requested summary stats.
4. Render five crew cards.
5. Update the HUD from engine snapshots after each command.
6. Keep command selection simple at first, with buttons for the current available commands.

Once that works, the scene can become more visual without risking the simulation layer.
