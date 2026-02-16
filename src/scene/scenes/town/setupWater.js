import { setupWater } from '../../../utils/water.js';

export function setupTownWater({ scene, terrain, engine, hero }) {
    setupWater(scene, terrain, engine, hero, 12.16, 8000);
}
