import { setPlayer } from '../../core/runtimeState.js';
import { loadHeroModel } from '../../character/hero.js';
import { setupCamera } from '../../utils/camera.js';
import { setupPhysics } from '../../utils/physics.js';
import { setupInputHandling } from '../../movement.js';
import { setupAnim } from '../../utils/anim.js';

import { Health } from '../../character/health.js';


import { loadModels } from '../../utils/load.js';
import { getLoopState } from '../../rpg/loopState.js';
import { setupUndergroundEnvironment } from './underground/setupEnvironment.js';
import { setupUndergroundLighting } from './underground/setupLighting.js';
import { setupUndergroundQuestActors } from './underground/setupQuestActors.js';
import { setupUndergroundTerrain } from './underground/setupTerrain.js';

export async function createUnderground(engine) {
    const scene = new BABYLON.Scene(engine);
    const loopState = getLoopState();

    const { terrain } = setupUndergroundTerrain(scene);
    setupUndergroundEnvironment(scene);
    //   createSkydome(scene);


    const { character, dummyAggregate } = await setupPhysics(scene);
    const camera = setupCamera(scene, character);
    const { hero, skeleton } = await loadHeroModel(scene, character);
    //   move anim with character model
    let anim = setupAnim(scene, skeleton);
    setupInputHandling(scene, character, camera, hero, anim, engine, dummyAggregate);
    character.health = new Health("Hero", 100, dummyAggregate);
    character.health.rotationCheck = hero;
    character.health.rangeCheck = character;
    setPlayer(character);

    const light = setupUndergroundLighting(scene);
    addTorch(scene, new BABYLON.Vector3(1, 10, 1));
    //   todo huge performance hit
    //   setupShadows(light, hero);
    // setupPostProcessing(scene,camera);
    setUpFollowCamera(scene, camera, character);
    setupTurnCamera(scene, camera, engine);

    const modelUrls = ["characters/enemy/slime/Slime1.glb", "characters/weapons/Sword2.glb"];
    const models = await loadModels(scene, modelUrls);

    setupUndergroundQuestActors({
        scene,
        character,
        terrain,
        slimeModel: models['Slime1'],
        loopState,
    });

    return scene;
}



function setUpFollowCamera(scene, camera, character) {
    let desiredRadius = 50;
    scene.onBeforeRenderObservable.add(() => {
        if (character.position) {

            const offsetPosition = character.position.add(new BABYLON.Vector3(0, 10, 0));

            // Update camera target smoothly towards the character position
            // camera.setTarget(BABYLON.Vector3.Lerp(camera.getTarget(), offsetPosition, 0.5));
            camera.setTarget(BABYLON.Vector3.Lerp(camera.getTarget(), offsetPosition, 0.1));
            camera.radius = BABYLON.Scalar.Lerp(camera.radius, desiredRadius, 0.05); // Smoothly interpolate to the desired radius
            // You can also adjust camera radius dynamically if needed

            // camera.beta = 3 * Math.PI / 8;
        }
    });


}

function setupTurnCamera(scene, camera, engine) {
    var cameraRotationSpeed = 2.25;  // Adjust this value for faster or slower rotation
    var keyStates = {};

    // Function to handle keydown event
    function onKeyDown(event) {
        keyStates[event.key] = true;
    }

    // Function to handle keyup event
    function onKeyUp(event) {
        keyStates[event.key] = false;
    }

    // Add event listeners to the window
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    scene.onBeforeRenderObservable.add(() => {
        if (keyStates['a']) {
            (camera.alpha);
            camera.alpha += cameraRotationSpeed * engine.getDeltaTime() / 1000;
        }

        // Check if 'D' is pressed for rotating right
        if (keyStates['d']) {
            camera.alpha -= cameraRotationSpeed * engine.getDeltaTime() / 1000;
        }
    });

}

function setupPostProcessing(scene, camera) {
    // scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    const pipeline = new BABYLON.DefaultRenderingPipeline(
        "default", // The name of the pipeline
        true,     // Do you want HDR textures?
        scene,    // The scene linked to
        [camera]  // The list of cameras to be attached to
    );

    // Configure effects
    pipeline.samples = 4;  // MSAA anti-aliasing
    pipeline.bloomEnabled = true;  // Enable bloom
    pipeline.fxaaEnabled = true;   // Enable FXAA

    const imgProc = pipeline.imageProcessing;

    // Apply contrast and exposure adjustments
    imgProc.contrast = 1.3;
    imgProc.exposure = 1.7;

    // Enable tone mapping
    imgProc.toneMappingEnabled = true;
    imgProc.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;

    // Apply vignette effect
    imgProc.vignetteEnabled = true;
    imgProc.vignetteWeight = 2.1;
    imgProc.vignetteColor = new BABYLON.Color4(0, 0, 0, 1);
    imgProc.vignetteBlendMode = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;

}

function addTorch(scene, position) {
    const light2 = new BABYLON.PointLight("pointLight", position, scene);
    light2.diffuse = new BABYLON.Color3(1, 0.29, 0);
}



