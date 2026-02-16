/**
 * @deprecated Global runtime values are being migrated to src/core/runtimeState.js.
 * Keep this file as a temporary compatibility bridge for legacy modules that still
 * rely on window-scoped identifiers.
 */

var DEBUG = false;

var SCENE_MANAGER = {};

var PLAYER = {};
var DUMMY = {};

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
var ON_MOBILE = true;
var CANVASES = []; //One canvas For Game, one for Mobile Input Detection

// todo move this from global. used for mobile input
var inputMap = {};


var FAST_RELOAD = false; //Enable for fast development, disable for prod


// Graphics Settings
var WEBGPU = false; //otherwise use WebGL
