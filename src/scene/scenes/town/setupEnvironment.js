import { createDaySkydome, setupDayEnvironment } from '../shared/setupDayEnvironment.js';

export function setupTownEnvironment(scene) {
    setupDayEnvironment(scene);
    createDaySkydome(scene);
}
