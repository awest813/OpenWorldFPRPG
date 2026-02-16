import SceneManager from './src/scene/SceneManager.js';
import { setSceneManager as setDamagePopupSceneManager } from './src/character/damagePopup.js';
import { getRuntimeState, setSceneManager } from './src/core/runtimeState.js';

window.__RUNTIME_STATE__ = getRuntimeState();

window.addEventListener('DOMContentLoaded', async function () {
    const sceneManager = new SceneManager('renderCanvas');
    setSceneManager(sceneManager);

    // Deprecated compatibility bridge for legacy global access.
    SCENE_MANAGER = sceneManager;

    await sceneManager.start();

    setDamagePopupSceneManager(sceneManager);
});
