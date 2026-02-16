export function setupUndergroundLighting(scene) {
    const light = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.5;
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(1, 1, 1);
    light.groundColor = new BABYLON.Color3(1.0, 1.0, 1.0);

    return light;
}
