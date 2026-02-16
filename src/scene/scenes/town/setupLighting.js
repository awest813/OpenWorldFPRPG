import { setupDirectionalLighting, setupDirectionalShadows } from '../shared/setupDirectionalLighting.js';

export function setupTownLighting(scene) {
    return setupDirectionalLighting(scene);
}

export function setupTownShadows(light, shadowCaster) {
    setupDirectionalShadows(light, shadowCaster);
}
