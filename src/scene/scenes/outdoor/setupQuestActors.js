import { setupEnemies } from '../../../character/enemy.js';
import { markMeshAsInteractable } from '../../../character/interact/interaction.js';
import { registerEncounterClear } from '../shared/registerEncounterClear.js';

export function setupOutdoorQuestActors({ scene, character, terrain, slimeModel, loopState }) {
    const [slimeEncounter] = setupEnemies(scene, character, terrain, 1, slimeModel);
    if (slimeEncounter) {
        slimeEncounter.position = new BABYLON.Vector3(120, 31, -252);
        registerEncounterClear({ scene, enemy: slimeEncounter, loopState, encounterKey: 'slimeCleared' });
    }

    addOutdoorPickups({ scene, loopState });
}

function addOutdoorPickups({ scene, loopState }) {
    const swordPickup = BABYLON.MeshBuilder.CreateBox('swordPickup', { size: 1.1 }, scene);
    swordPickup.position = new BABYLON.Vector3(130, 31, -262);
    swordPickup.material = createPickupMaterial(scene, new BABYLON.Color3(0.7, 0.7, 0.75));
    markMeshAsInteractable(swordPickup, {
        type: 'pickup',
        prompt: 'Press E - Pick up sword',
        onInteract: ({ mesh }) => {
            if (loopState.pickupItem('sword')) {
                mesh.setEnabled(false);
                mesh.isPickable = false;
            }
        }
    });

    const potionPickup = BABYLON.MeshBuilder.CreateCylinder('potionPickup', { diameter: 0.8, height: 1.4 }, scene);
    potionPickup.position = new BABYLON.Vector3(137, 31, -257);
    potionPickup.material = createPickupMaterial(scene, new BABYLON.Color3(0.5, 0.15, 0.7));
    markMeshAsInteractable(potionPickup, {
        type: 'pickup',
        prompt: 'Press E - Pick up potion',
        onInteract: ({ mesh }) => {
            if (loopState.pickupItem('potion')) {
                mesh.setEnabled(false);
                mesh.isPickable = false;
            }
        }
    });
}

function createPickupMaterial(scene, color) {
    const material = new BABYLON.StandardMaterial(`pickup-${color.toHexString()}`, scene);
    material.emissiveColor = color;
    material.diffuseColor = color;
    return material;
}
