export function setupUndergroundEnvironment(scene) {
    scene.clearColor = new BABYLON.Color3.Black();
    const environmentURL = 'https://playground.babylonjs.com/textures/environment.env';
    const environmentMap = BABYLON.CubeTexture.CreateFromPrefilteredData(environmentURL, scene);
    scene.environmentTexture = environmentMap;
    scene.environmentIntensity = 0.0;
}
