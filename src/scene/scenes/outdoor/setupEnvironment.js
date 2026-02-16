import { createDaySkydome, setupDayEnvironment } from '../shared/setupDayEnvironment.js';

export function setupOutdoorEnvironment(scene) {
    setupDayEnvironment(scene);
    createDaySkydome(scene);
}
