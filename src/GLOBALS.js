/**
 * @deprecated Legacy global compatibility shim.
 *
 * Runtime state ownership moved to `src/core/runtimeState.js`.
 * This file now only exposes read-only accessors for migrated globals so
 * older modules can continue reading values while new code uses runtimeState.
 */

const getRuntimeStateBridge = () => globalThis.__RUNTIME_STATE__;

function defineRuntimeReadonlyGlobal(name, getter) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    enumerable: true,
    get: getter
  });
}

defineRuntimeReadonlyGlobal('SCENE_MANAGER', () => getRuntimeStateBridge()?.sceneManager ?? null);
defineRuntimeReadonlyGlobal('PLAYER', () => getRuntimeStateBridge()?.player ?? null);
defineRuntimeReadonlyGlobal('DUMMY', () => getRuntimeStateBridge()?.dummy ?? null);
defineRuntimeReadonlyGlobal('inputMap', () => getRuntimeStateBridge()?.inputMap ?? {});
defineRuntimeReadonlyGlobal('DEBUG', () => Boolean(getRuntimeStateBridge()?.flags?.debug));
defineRuntimeReadonlyGlobal('FAST_RELOAD', () => Boolean(getRuntimeStateBridge()?.flags?.fastReload));
defineRuntimeReadonlyGlobal('ON_MOBILE', () => Boolean(getRuntimeStateBridge()?.flags?.onMobile));

var DMGPOP = {};

var HPBAR = {};

var VFX = {};

var SHADERS = {};


var GRID = {};


var MESH_LIBRARY = {};
// Contains:
//   'Plants'
//     'Grass'
//     'Tree'
//   'Buildings'
//     'BuildingType'
//     'Wall'
//     'Roof'

// array of 9 grids, to load in dynamically around the player
var GRIDS;

var TOOLS;

var targetBaseOnCameraView = true; // if false target based on character rotation
// use touch joystick for mobile options

var DYNAMIC_CAMERA = false;
// Used for game controller on pc and shows joystick on mobile.
// Emulates KOA smooth camera follow effect
var CANVASES = []; //One canvas For Game, one for Mobile Input Detection

// Graphics Settings
var WEBGPU = false; //otherwise use WebGL
