import { getDebug, getFastReload, setDebug } from '../core/runtimeState.js';
import { createNight } from './scenes/night.js';
import { createDayDynamicTerrain } from './scenes/day.js';
import { createOutdoor } from './scenes/outdoor.js';
import { createRoom } from './scenes/room.js';
import { createUnderground } from './scenes/underground.js';
import { createTown } from './scenes/town.js';
import { createRoomGI } from './scenes/roomGI.js';
import { createInn } from './scenes/inn.js';
import { createBuilder } from './scenes/builder.js';

class SceneManager {
  constructor(canvasId, engine) {
    this.canvas = document.getElementById(canvasId);
    this.engine = engine || new BABYLON.Engine(this.canvas, true);
    this.guiTextures = new Map();
    this.scenes = [];
    this.sceneKeys = [];
    this.activeScene = null;
    this.activeSceneKey = null;
    this.sceneCreators = {
      night: createNight,
      day: createDayDynamicTerrain,
      outdoor: createOutdoor,
      room: createRoom,
      underground: createUnderground,
      town: createTown,
      roomGI: createRoomGI,
      inn: createInn,
      builder: createBuilder
    };

    this.defaultScenePolicy = {
      persistent: false,
      evictOnLeave: true,
      maxCachedScenes: 3
    };

    this.scenePolicyMap = {
      outdoor: { persistent: true, evictOnLeave: false },
      day: { persistent: true, evictOnLeave: false }
    };
  }

  logDebug(message, data = null) {
    if (!getDebug()) {
      return;
    }

    if (data === null) {
      console.log(`[SceneManager] ${message}`);
      return;
    }

    console.log(`[SceneManager] ${message}`, data);
  }


  getScenePolicy(sceneKey) {
    return {
      ...this.defaultScenePolicy,
      ...(this.scenePolicyMap[sceneKey] || {})
    };
  }

  resolveSceneIdentifier(identifier) {
    if (typeof identifier === 'number') {
      return { index: identifier, key: this.sceneKeys[identifier] || null };
    }

    const index = this.sceneKeys.indexOf(identifier);
    return { index, key: identifier };
  }

  approximateScenePressureHint(scene) {
    return {
      meshes: scene.meshes.length,
      materials: scene.materials.length,
      textures: scene.textures.length,
      transformNodes: scene.transformNodes.length
    };
  }

  logTelemetry(eventName) {
    if (!getDebug()) {
      return;
    }

    const aggregate = this.scenes.reduce((acc, scene) => {
      acc.meshes += scene.meshes.length;
      acc.materials += scene.materials.length;
      acc.textures += scene.textures.length;
      return acc;
    }, { meshes: 0, materials: 0, textures: 0 });

    const memoryHint = aggregate.meshes + aggregate.materials + (aggregate.textures * 2);
    this.logDebug(`Telemetry: ${eventName}`, {
      sceneCount: this.scenes.length,
      textureCount: this.guiTextures.size,
      aggregate,
      memoryPressureHint: memoryHint > 1200 ? 'high' : memoryHint > 450 ? 'medium' : 'low',
      memoryHintScore: memoryHint
    });
  }

  enforceCacheLimit() {
    const globalLimit = this.defaultScenePolicy.maxCachedScenes;
    if (this.scenes.length <= globalLimit) {
      return;
    }

    for (let i = 0; i < this.scenes.length && this.scenes.length > globalLimit; i += 1) {
      const scene = this.scenes[i];
      const sceneKey = this.sceneKeys[i];
      if (!scene || scene === this.activeScene) {
        continue;
      }

      const policy = this.getScenePolicy(sceneKey);
      if (policy.persistent || !policy.evictOnLeave) {
        continue;
      }

      this.disposeSceneAtIndex(i, `cache-limit-${globalLimit}`);
      i -= 1;
    }
  }

  disposeSceneAtIndex(index, reason = 'manual') {
    const scene = this.scenes[index];
    const sceneKey = this.sceneKeys[index];
    if (!scene) {
      return;
    }

    const guiTexture = this.guiTextures.get(scene);
    if (guiTexture) {
      guiTexture.dispose();
      this.guiTextures.delete(scene);
    }

    scene.dispose();
    this.scenes.splice(index, 1);
    this.sceneKeys.splice(index, 1);

    if (scene === this.activeScene) {
      this.activeScene = null;
      this.activeSceneKey = null;
      this.activeGUI = null;
    }

    this.logDebug('Disposed scene', { sceneKey, reason });
  }

  async loadScene(sceneCreationFunction, sceneKey = 'ad-hoc') {
    const scene = await sceneCreationFunction(this.engine);
    scene.damagePopupAnimationGroup = new BABYLON.AnimationGroup("popupAnimation", scene);
    this.scenes.push(scene);
    this.sceneKeys.push(sceneKey);
    this.guiTextures.set(scene, new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene));
    this.activeGUI = this.guiTextures.get(scene);
    this.logDebug('Scene loaded into manager', {
      sceneKey,
      sceneCount: this.scenes.length,
      hasGuiTexture: this.guiTextures.has(scene)
    });
    this.logDebug('Loaded scene pressure hint', {
      sceneKey,
      hint: this.approximateScenePressureHint(scene)
    });

    this.enforceCacheLimit();
    this.logTelemetry(`load:${sceneKey}`);

    return scene;
  }

  async preloadScene(sceneKey) {
    if (!this.sceneCreators[sceneKey]) {
      console.warn(`[SceneManager] Unable to preload unknown scene key: ${sceneKey}`);
      return null;
    }

    const { index } = this.resolveSceneIdentifier(sceneKey);
    if (index >= 0) {
      this.logDebug('Scene already cached; skipping preload', { sceneKey, index });
      return this.scenes[index];
    }

    this.logDebug('Preloading scene', { sceneKey });
    return this.loadScene(this.sceneCreators[sceneKey], sceneKey);
  }

  async preloadScenes(sceneKeys = []) {
    const loadedScenes = [];
    for (const sceneKey of sceneKeys) {
      const scene = await this.preloadScene(sceneKey);
      if (scene) {
        loadedScenes.push(scene);
      }
    }

    this.logTelemetry('batch-preload');
    return loadedScenes;
  }

  async switchToScene(identifier) {
    const { index, key } = this.resolveSceneIdentifier(identifier);
    if (index < 0 || !this.scenes[index]) {
      console.warn(`[SceneManager] Unable to switch scenes. No scene exists at identifier: ${identifier}`);
      return;
    }

    const previousScene = this.activeScene;
    const previousSceneKey = this.activeSceneKey;

    if (this.activeScene) {
      this.engine.stopRenderLoop();
      if (getDebug()) this.activeScene.debugLayer.hide();
    }

    this.activeScene = this.scenes[index];
    this.activeSceneKey = key || this.sceneKeys[index];
    this.activeGUI = this.guiTextures.get(this.activeScene);
    this.logDebug('Switching to scene', {
      identifier,
      index,
      sceneKey: this.activeSceneKey
    });

    this.engine.runRenderLoop(() => {
      this.activeScene.render();
    });

    if (getDebug()) this.activeScene.debugLayer.show();

    if (previousScene && previousScene !== this.activeScene) {
      const previousPolicy = this.getScenePolicy(previousSceneKey);
      if (!previousPolicy.persistent && previousPolicy.evictOnLeave) {
        const previousIndex = this.scenes.indexOf(previousScene);
        if (previousIndex >= 0) {
          this.disposeSceneAtIndex(previousIndex, 'leave-non-persistent');
        }
      }
    }

    this.logTelemetry(`switch:${this.activeSceneKey}`);
  }

  // todo map of scenes near the current scene
  // in this case, just load starting zone
  async start() {

    let timeout = 100;
    if (!getFastReload()) timeout = 1000;
    setTimeout(() => {
      this.canvas.classList.add('visible');
    }, timeout);

    const urlParams = new URLSearchParams(window.location.search);

    const debugParam = urlParams.get('debug');
    if (debugParam === 'true') {
      setDebug(true);
      // Deprecated compatibility bridge for legacy global access.
      DEBUG = true;
    }
    this.logDebug('Debug mode enabled through URL parameter');

    const sceneParam = urlParams.get('scene');
    const defaultSceneKey = this.sceneCreators[sceneParam] ? sceneParam : 'outdoor';
    this.logDebug('Scene selection', {
      requestedScene: sceneParam || defaultSceneKey,
      resolvedScene: defaultSceneKey,
      fallbackUsed: !this.sceneCreators[sceneParam]
    });

    await this.preloadScene(defaultSceneKey);
    await this.switchToScene(defaultSceneKey);
    this.canvas.focus();

    // Uncomment this for key based scene switching. 
    // await this.loadScene(this.sceneCreators['inn']);
    // await this.loadScene(this.sceneCreators['builder']);
    // Setup scene switching logic, e.g., based on user input or game events
    // window.addEventListener('keydown', (e) => {
    //   if (e.key === 'i') {
    //     this.switchToScene(0);
    //   } else if (e.key === 'o') {
    //     this.switchToScene(1);
    //   } else if (e.key === 'p') {
    //     this.switchToScene(2);
    //   }
    // });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    const endTime = performance.now();
    const domLoadTime = endTime - startTime;
    console.log(`Scene loaded in ${domLoadTime.toFixed(2)} milliseconds`);
    this.logDebug('Scene load timing complete', {
      milliseconds: Number(domLoadTime.toFixed(2))
    });

  }
}

export default SceneManager;
