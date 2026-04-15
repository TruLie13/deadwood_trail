# Deadwood Trail Project Context

This repository starts from the open-source browser adaptation of Oregon Trail:

- Source import: `attilabuti/Oregon-Trail-Browser`
- Imported on: 2026-04-12
- Reason for import: use its browser-hostable shell, terminal presentation, and web asset pipeline as the starting point for a new TypeScript-driven game variation

## High-Level Pitch

This game is a "Weird West" supernatural cattle-drive survival RPG inspired by Oregon Trail.

The primary win condition is not keeping a wagon party alive. The score is the number of cattle delivered to the destination, with 500 cattle as the target benchmark. The player is moving the last untainted herd across a cursed frontier toward a sanctuary in Nevada called The Silver Fold.

## Core Design Hierarchy

1. Primary focus: protect the herd
2. Core engine: manage Fear and Morale
3. Friction systems: wagon decay, barter, hunting risk, supernatural encounters

Rule of thumb: if the game starts feeling like a spreadsheet, automate background decay and only interrupt the player for critical thresholds and meaningful choices.

## Setting

- Title/theme: "The Deadwood Trail"
- Year: 1888
- Start: San Antonio, Texas
- Destination: The Silver Fold, Nevada
- Tone: normal Western by day, reality-warping nightmare by night
- Travel arc: the farther west the player goes, the deeper they move into "The Veil"

## World Logic

- Day phase is the mundane layer: travel, repairs, hunting, supply management
- Night phase is the supernatural layer: camp decisions, watch assignments, ambush risk, stampedes, sanity pressure
- Geography becomes increasingly impossible as the trip continues

## Primary Systems

### Herd First

- The cattle herd is the main score and the main failure surface
- The player may slaughter cattle in emergencies for food, but that directly harms the final outcome

### Fear

Fear is external pressure applied by the environment and supernatural events.

Sources:

- nights in the open desert
- cursed landmarks
- eldritch encounters
- decaying wagon sanctity
- night driving

Effects:

- worsens outcomes from random events
- increases chance of catastrophic stampedes
- amplifies the danger of supernatural encounters

### Morale

Morale is the crew's internal resilience.

High morale can provide:

- better hunting or defense
- sickness resistance
- better herd control

Low morale can cause:

- bickering
- theft
- slower pace
- desertion, betrayal, or disappearance when combined with high Fear

### Night Watch Phase

Each evening should present a focused choice rather than a long checklist.

Candidate actions:

- Sing Around the Campfire: `+10 Morale`, `-5 Fear`, but raises ambush chance
- Double Guard Duty: `-5 Morale`, `-15 Fear`, but risks exhaustion or hallucination
- Ration Whiskey: `+15 Morale`, costs a resource, raises sickness risk
- Consult the Occultist: `-10 Morale`, `-20 Fear`, but unsettles the crew

### Stampede as a Fear Check

Stampedes should usually be triggered by state, not pure randomness.

- Trigger examples: thunderstorms, howling, night assaults
- If Fear is above a threshold, the herd panics
- Cattle loss scales with current Fear
- High morale can unlock a "Calm the Herd" mitigation option

### Wagon Sanctity

The wagon is more than transportation. It is the group's fragile protection against the supernatural.

- Mechanical integrity affects how quickly Fear rises
- Rust-Moths and cursed terrain accelerate decay
- Repairs should use thematic materials like Blessed Timber, Cold Iron Nails, or Warding Oil

### Desperation Trading

Trading should feel dangerous and morally expensive.

- Caravan barter instead of ordinary shops
- Some merchants may trade relics for cattle, memories, or years of life
- Use this system as a relief valve when the run is collapsing

### Hunting and Blight

Food gathering should create a food-versus-sanity tradeoff.

- hunted meat can be Blighted
- feeding Blighted meat prevents starvation but harms the crew psychologically
- the stealth hunting loop should punish noise by attracting larger predators

## Major Factions / Threat Types

- Gloam-Walkers: distant stalking silhouettes
- Rust-Moths: supernatural cause of wagon decay
- Skin-Mimics: sabotage, morale collapse, infiltration

Keep monsters partially obscured whenever possible. Fear works better when the player fills in the gaps.

## Landmark Intent

- San Antonio: final place of ordinary daylight
- Painted Canyons: beauty by day, predatory strangeness by night
- El Paso: midpoint neutral zone built on salt; likely the only truly safe settlement on the trail
- Staked Plains: navigation nightmare without supernatural tools
- Nevada Salt Flats: final stretch where hidden horrors fully manifest
- The Silver Fold: sanctuary, but potentially with a dark ending if the curse is delivered there

## Key Items

- Warding Oil
- Cold Iron Nails
- Pocket Watch
- Blessed Grain
- Deadeye Tonic

## Signature Event Ideas

- The Humming Rust
- The Mirror-Twin
- The Blood-Rain
- The Whispering Cache
- The Gravity Hiccup

Each event should force a tradeoff between the herd, the wagon, Fear, Morale, time, and scarce resources.

## Ending Philosophy

Reaching the destination with 500 cattle is not automatically a clean victory.

If Morale is shattered and Fear is maxed, the player may have preserved the herd while carrying a curse into the sanctuary. Endings should acknowledge both material success and psychological or supernatural cost.

## Current Product Direction

- Preserve the browser-playable format
- Move new gameplay logic toward TypeScript
- Treat the imported upstream project as a reference shell and a structure reference
- Reproduce the original Oregon Trail loop where it helps: outfitting, trail actions, ration pressure, landmark progression, and event cadence
- Replace irrelevant legacy mechanics with Deadwood-specific systems instead of preserving them for nostalgia alone
- MVP priority: get the new mechanics working in the current terminal-style presentation first
- Revisit a fuller GUI layer only after the gameplay MVP is stable and testable
