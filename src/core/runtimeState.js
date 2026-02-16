const runtimeState = {
  sceneManager: null,
  player: null,
  dummy: null,
  inputMap: {},
  flags: {
    debug: false,
    fastReload: false,
    onMobile: true
  }
};

export function getRuntimeState() {
  return runtimeState;
}

export function getSceneManager() {
  return runtimeState.sceneManager;
}

export function setSceneManager(sceneManager) {
  runtimeState.sceneManager = sceneManager;
  return runtimeState.sceneManager;
}

export function getPlayer() {
  return runtimeState.player;
}

export function setPlayer(player) {
  runtimeState.player = player;
  return runtimeState.player;
}

export function getDummy() {
  return runtimeState.dummy;
}

export function setDummy(dummy) {
  runtimeState.dummy = dummy;
  return runtimeState.dummy;
}

export function getInputMap() {
  return runtimeState.inputMap;
}

export function setInputMap(inputMap) {
  runtimeState.inputMap = inputMap;
  return runtimeState.inputMap;
}

export function getDebug() {
  return runtimeState.flags.debug;
}

export function setDebug(debugEnabled) {
  runtimeState.flags.debug = Boolean(debugEnabled);
  return runtimeState.flags.debug;
}

export function getFastReload() {
  return runtimeState.flags.fastReload;
}

export function setFastReload(fastReloadEnabled) {
  runtimeState.flags.fastReload = Boolean(fastReloadEnabled);
  return runtimeState.flags.fastReload;
}

export function getOnMobile() {
  return runtimeState.flags.onMobile;
}

export function setOnMobile(onMobile) {
  runtimeState.flags.onMobile = Boolean(onMobile);
  return runtimeState.flags.onMobile;
}
