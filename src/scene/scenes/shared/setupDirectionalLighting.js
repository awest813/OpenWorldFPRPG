export function setupDirectionalLighting(scene) {
    const light = new BABYLON.DirectionalLight('light0', new BABYLON.Vector3(-800, -1400, -1000), scene);
    light.intensity = 1.7;
    light.shadowMinZ = 1500;
    light.shadowMaxZ = 2300;
    light.diffuse = new BABYLON.Color3(1, 1, 1);

    return light;
}

export function setupDirectionalShadows(light, shadowCaster) {
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.darkness = 0.6;
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.nearPlane = 1;
    shadowGenerator.farPlane = 10000;
    shadowGenerator.minZ = -100;
    shadowGenerator.addShadowCaster(shadowCaster);
}
