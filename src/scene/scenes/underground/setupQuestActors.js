import { setupEnemies } from '../../../character/enemy.js';
import { markMeshAsInteractable } from '../../../character/interact/interaction.js';
import { registerEncounterClear } from '../shared/registerEncounterClear.js';

export function setupUndergroundQuestActors({ scene, character, terrain, slimeModel, loopState }) {
    const [banditEncounter] = setupEnemies(scene, character, terrain, 1, slimeModel);
    if (banditEncounter) {
        banditEncounter.position = new BABYLON.Vector3(10, -16, 10);
        const banditTint = new BABYLON.StandardMaterial('banditTint', scene);
        banditTint.diffuseColor = new BABYLON.Color3(0.5, 0.25, 0.2);
        banditTint.emissiveColor = new BABYLON.Color3(0.2, 0.08, 0.08);
        banditEncounter.getChildMeshes().forEach((mesh) => {
            mesh.material = banditTint;
        });

        registerEncounterClear({ scene, enemy: banditEncounter, loopState, encounterKey: 'banditCleared' });
    }

    addCaveKeyPickup({ scene, loopState });
}

function addCaveKeyPickup({ scene, loopState }) {
    const keyPickup = BABYLON.MeshBuilder.CreateTorus('caveKeyPickup', { diameter: 1, thickness: 0.25 }, scene);
    keyPickup.position = new BABYLON.Vector3(4, -17, 4);
    const keyMaterial = new BABYLON.StandardMaterial('keyPickupMaterial', scene);
    keyMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.75, 0.2);
    keyMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.42, 0.08);
    keyPickup.material = keyMaterial;

    markMeshAsInteractable(keyPickup, {
        type: 'pickup',
        prompt: 'Press E - Pick up cave key',
        onInteract: ({ mesh }) => {
            if (loopState.pickupItem('key')) {
                mesh.setEnabled(false);
                mesh.isPickable = false;
            }
        }
    });
}
