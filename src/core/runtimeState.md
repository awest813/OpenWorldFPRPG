# Runtime State Ownership Boundaries

This module documents ownership and lifecycle for shared runtime state in `src/core/runtimeState.js`.

## Scene lifecycle state

These values are recreated or swapped when scenes are created/switched:

- `sceneManager`: owned by app bootstrap (`game.js`) and scene orchestration (`SceneManager`).
- `flags.debug`: controlled by scene boot URL params and debug tooling.
- `flags.fastReload`: controlled by startup/config decisions for scene load behavior.

## Player/session lifecycle state

These values follow the active player session and are set by scene creators and movement systems:

- `player`: active controllable character reference.
- `dummy`: physics aggregate attached to the active player.
- `inputMap`: current frame-to-frame input map from keyboard/mobile controls.
- `flags.onMobile`: runtime environment capability used by input/UI layers.

## Deprecated global bridge

`src/GLOBALS.js` remains as a temporary compatibility layer for modules that still read/write
window-scoped globals. New/updated modules should use `runtimeState` helper getters/setters.

## Migration status (legacy globals)

Legacy write paths for `SCENE_MANAGER`, `PLAYER`, `DUMMY`, `inputMap`, `DEBUG`, and `ON_MOBILE`
have been migrated to `runtimeState` setters/getters.

Remaining exception(s): none in `src/` at this time. `src/GLOBALS.js` is now read-only for those
runtime-backed names and exists only to support legacy reads.

