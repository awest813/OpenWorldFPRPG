import { setupDirectionalLighting, setupDirectionalShadows } from '../shared/setupDirectionalLighting.js';

export function setupOutdoorLighting(scene) {
    return setupDirectionalLighting(scene);
}

export function setupOutdoorShadows(light, shadowCaster) {
    setupDirectionalShadows(light, shadowCaster);
}
