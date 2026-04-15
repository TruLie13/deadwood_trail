# Deadwood Trail

Deadwood Trail is a Weird West survival game about driving the last untainted herd from San Antonio to the Silver Fold while Fear, Morale, wagon decay, and supernatural encounters grind the crew down.

This repository is the game project. It uses the browser-hostable terminal shell imported from `attilabuti/Oregon-Trail-Browser` as a starting point, but the active gameplay work here is the Deadwood-specific TypeScript simulation and presentation.

## Current Focus

- Terminal-style MVP with Deadwood branding and flow
- TypeScript gameplay systems in `src/`
- Herd-first survival loop instead of the original family-survival framing
- Fear, Morale, night actions, cursed events, and wagon sanctity

## Project Structure

- `src/`: Deadwood Trail TypeScript gameplay and model code
- `js/ts/`: compiled browser-ready gameplay bundles
- `views/`, `css/`, `js/`: terminal shell and browser runtime
- `tests/`: automated model coverage for Deadwood systems
- `PROJECT_CONTEXT.md`: design intent and creative direction
- `docs/technical-direction.md`: implementation notes and roadmap

## Local Reference Repo

The local folder `upstream-oregon-trail-browser/` is intentionally kept out of git history. It exists only as a private reference copy of the imported upstream shell while the playable repo stays focused on Deadwood Trail itself.

## Commands

- `npm run dev`
- `npm run build`
- `npm test`
- `npm run typecheck`
