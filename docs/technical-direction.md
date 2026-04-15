# Technical Direction

## Starting Point

The repository currently contains an imported copy of `attilabuti/Oregon-Trail-Browser`, which is a browser-based recreation of Oregon Trail with:

- HTML/CSS shell
- JavaScript runtime files in `js/`
- a custom Node-based build pipeline in `scripts/`
- the original game logic running through `wasm/oregon78.wasm`

## Important Constraint

The imported project is a strong presentation baseline, but it is not a clean gameplay-editing baseline.

Why:

- the browser app shell is editable in JavaScript
- the original game simulation is not implemented directly in the browser source tree
- substantial gameplay logic is encapsulated in `wasm/oregon78.wasm`

This means major system changes like Fear, Morale, Night Watch, supernatural events, and a cattle-first victory structure will be much easier if we reimplement the simulation layer in TypeScript rather than trying to patch the existing WebAssembly game behavior.

## Recommended Plan

### Phase 1: Preserve the shell

Reuse and adapt:

- terminal or retro presentation ideas
- hosting/build structure
- static assets and browser deployment shape

Avoid deep coupling to the current wasm-driven command loop.

### Phase 1.5: Study and mirror the original game structure

The practical approach is not to modify the wasm directly, but to study the original Oregon Trail flow and selectively reproduce the parts that still serve Deadwood Trail.

Current structure targets:

- initial outfitting before departure
- repeated trail turns with one primary daytime action
- food pressure through explicit ration choices
- landmark-driven pacing and milestone relief
- random event cadence that compounds mistakes instead of feeling arbitrary

Current replacement targets:

- family survival focus becomes cattle-delivery scoring
- plain wagon damage becomes wagon sanctity
- historical hazards expand into supernatural hazards
- random stampedes become Fear-based checks

### Phase 2: Introduce TypeScript app structure

Create a TypeScript gameplay layer for:

- game state
- turn resolution
- day/night phase transitions
- event generation
- herd, supplies, wagon, morale, and fear systems

Suggested top-level domain model:

- `GameState`
- `CrewMember`
- `HerdState`
- `WagonState`
- `EncounterState`
- `Landmark`
- `NightAction`
- `RunOutcome`

### Phase 3: Replace or bypass the wasm gameplay core

Two possible implementation paths:

1. Keep the retro terminal UI and feed it from a new TypeScript simulation
2. Build a new UI layer on top of the same browser app with the imported assets as inspiration

Path 1 is probably the fastest route to a playable prototype.

Current decision:

- use the terminal-style presentation for the MVP
- defer a fuller 1990-style or image-forward GUI revisit until the mechanics are proven in playtests

## Proposed First Vertical Slice

Build a short playable route with:

- San Antonio to El Paso only
- herd count as the main score
- Fear and Morale meters
- one night watch choice per day
- 5 to 8 supernatural events
- one stampede check
- one safe-zone payoff at El Paso

This gives us a way to validate pacing before building the full trail.

## UX Guidance

- Keep player decisions chunky and legible
- surface causes for losses clearly
- use warnings when a hidden system crosses a dangerous threshold
- let the player understand why the herd is collapsing

If a run goes badly, the player should be able to say "I lost cattle because Fear spiked after three night drives and I ignored wagon sanctity," not "the game randomly ruined me."

## Narrative Note: El Paso

El Paso works very well as the only truly safe zone left on the map.

Why it helps:

- it creates a meaningful midpoint objective
- it gives the player emotional relief after early pressure
- it supports pacing by letting us reset intensity before the back half
- it makes the westward descent into the supernatural feel earned

Design implication:

The first half of the game can be about reaching safety. The second half can be about leaving it behind.
