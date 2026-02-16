# Action RPG Example for Babylon.js
![Example Image](https://i.ibb.co/D7tywtK/2024-06-2910-15-38-ezgif-com-speed.gif)

Gets you started with examples of character movement, physics, terrain, scene loading, animation, and more.

Includes a scene manager to switch between levels.


## Demo
[Play in your browser](https://www.rpgskilltreegenerator.com/RPG/index.html?scene=outdoor) instantly.

### Switching Demo Levels
You can switch scenes by adding [`?scene=inn`](https://rpgskilltreegenerator.com/RPG/index.html?scene=inn), or [`?scene=outdoor`](https://rpgskilltreegenerator.com/RPG/index.html?scene=outdoor), or [`?scene=builder`](https://rpgskilltreegenerator.com/RPG/index.html?scene=builder).

You can add [`&debug=true`](https://rpgskilltreegenerator.com/RPG/index.html?scene=outdoor&debug=true) to load a scene inspector. 

When debug mode is enabled, `SceneManager` now prints tagged logs in the browser console to help track scene selection, scene switching, and load timing.

`SceneManager` now also reports lightweight scene-cache telemetry in debug mode, including scene count, GUI texture count, and a simple memory-pressure hint (low/medium/high).

You can view the full scene list in [`SceneManager.js`](/src/scene/SceneManager.js). 

### Scene Lifecycle and Caching Policy
- Scenes are now cached with a policy map (`defaultScenePolicy` + `scenePolicyMap`) in `SceneManager`.
- On scene switch, the previous scene is disposed when it is non-persistent and marked `evictOnLeave`.
- Disposal includes both the Babylon scene (`scene.dispose()`) and its associated fullscreen GUI texture.
- Cache size is managed with `maxCachedScenes` to reduce long-session memory growth.

To keep a scene loaded across switches, mark it as persistent in `src/scene/SceneManager.js`:

```js
this.scenePolicyMap = {
  outdoor: { persistent: true, evictOnLeave: false }
};
```

To preload scenes without immediately rendering them:

```js
await sceneManager.preloadScene('inn');
await sceneManager.preloadScenes(['town', 'builder']);
```

### Canonical Scene Entrypoints
`src/scene/SceneManager.js` is the source of truth for scene query names and their creator functions:

- `night` → `createNight` (`src/scene/scenes/night.js`)
- `day` → `createDayDynamicTerrain` (`src/scene/scenes/day.js`)
- `outdoor` → `createOutdoor` (`src/scene/scenes/outdoor.js`)
- `room` → `createRoom` (`src/scene/scenes/room.js`)
- `underground` → `createUnderground` (`src/scene/scenes/underground.js`)
- `town` → `createTown` (`src/scene/scenes/town.js`)
- `roomGI` → `createRoomGI` (`src/scene/scenes/roomGI.js`)
- `inn` → `createInn` (`src/scene/scenes/inn.js`)
- `builder` → `createBuilder` (`src/scene/scenes/builder.js`)

### Scene Import Integrity Check
Run this quick static check to validate relative import paths used by files in `src/scene/scenes`:

```bash
node scripts/check-scene-imports.mjs
```

## Run Locally
`git clone` the repo.

Run a local server, then open `index.html` in your browser. 

### Low Latency Changes
Make a code change, save the file, and watch as your change is immediately live. No build process needed.

## Debugging Notes
- Use `?debug=true` to enable Babylon inspector and `SceneManager` debug logs.
- If scene loading fails, verify the `scene` query parameter is one of the names listed in `src/scene/SceneManager.js`.
- Invalid `scene` values now safely fall back to `outdoor` and report that fallback through debug logs.


## Contributing
Please feel free to contribute or open an issue.

### Support the project
[Patreon](https://www.patreon.com/OpenRPGTools) or [join the discord](https://discord.gg/NcJYR65HHZ).
