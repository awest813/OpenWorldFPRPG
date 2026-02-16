import { setupWater } from '../../../utils/water.js';

export function setupOutdoorWater({ scene, terrain, engine, hero }) {
    setupWater(scene, terrain, engine, hero, 12.16, 8000);
}
