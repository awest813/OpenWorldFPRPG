import { markMeshAsInteractable } from '../../../character/interact/interaction.js';
import { setupEnemies } from '../../../character/enemy.js';
import { QUEST_STATES } from '../../../rpg/loopState.js';

export function setupTownQuestActors({ scene, character, terrain, slimeModel, loopState }) {
    setupEnemies(scene, character, terrain, 7, slimeModel);
    addTownChest({ scene, character, loopState });
}

function addTownChest({ scene, character, loopState }) {
    const chestBase = BABYLON.MeshBuilder.CreateBox('townChestBase', { width: 2, height: 1.2, depth: 1.2 }, scene);
    chestBase.position = new BABYLON.Vector3(141, 31, -266);

    const chestLid = BABYLON.MeshBuilder.CreateBox('townChestLid', { width: 2, height: 0.45, depth: 1.2 }, scene);
    chestLid.position = chestBase.position.add(new BABYLON.Vector3(0, 0.85, -0.5));
    chestLid.parent = chestBase;

    const chestMaterial = new BABYLON.StandardMaterial('townChestMaterial', scene);
    chestMaterial.diffuseColor = new BABYLON.Color3(0.35, 0.2, 0.1);
    chestMaterial.emissiveColor = new BABYLON.Color3(0.08, 0.04, 0.02);
    chestBase.material = chestMaterial;
    chestLid.material = chestMaterial;

    const chestState = { open: false };

    markMeshAsInteractable(chestBase, {
        type: 'generic',
        prompt: 'Press E - Locked chest',
        state: chestState,
        onInteract: ({ interactable }) => {
            if (loopState.quest === QUEST_STATES.complete) {
                interactable.prompt = 'Press E - Chest emptied';
                return;
            }

            if (!loopState.hasItem('key')) {
                chestState.open = false;
                chestBase.rotation.x = 0;
                interactable.prompt = 'Press E - Need cave key';
                return;
            }

            if (loopState.quest !== QUEST_STATES.chestUnlocked) {
                chestState.open = true;
                chestBase.rotation.x = -0.35;
                loopState.setQuest(QUEST_STATES.chestUnlocked);
                interactable.prompt = 'Press E - Claim chest reward';
                return;
            }

            loopState.setQuest(QUEST_STATES.complete);
            loopState.rewardClaimed = true;
            character.health?.heal?.(character.health.maxHealth);
            interactable.prompt = 'Press E - Reward claimed';
        }
    });
}
