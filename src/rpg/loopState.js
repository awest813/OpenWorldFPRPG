const LOOP_STATE_KEY = '__openWorldLoopState';

export const QUEST_STATES = Object.freeze({
    notStarted: 'notStarted',
    gotKey: 'gotKey',
    chestUnlocked: 'chestUnlocked',
    complete: 'complete'
});

const INVENTORY_SLOTS = Object.freeze(['sword', 'potion', 'key']);

function createInventory() {
    return {
        sword: false,
        potion: false,
        key: false
    };
}

function ensureObjectiveOverlay() {
    let objective = document.getElementById('objectiveOverlay');
    if (objective) {
        return objective;
    }

    objective = document.createElement('div');
    objective.id = 'objectiveOverlay';
    objective.style.position = 'fixed';
    objective.style.top = '16px';
    objective.style.left = '16px';
    objective.style.padding = '8px 12px';
    objective.style.background = 'rgba(0, 0, 0, 0.5)';
    objective.style.color = '#f6f2db';
    objective.style.fontFamily = 'monospace';
    objective.style.fontSize = '13px';
    objective.style.border = '1px solid rgba(255, 255, 255, 0.25)';
    objective.style.zIndex = '20';

    document.body.appendChild(objective);
    return objective;
}

function getObjectiveText(state) {
    if (!state.encounters.slimeCleared) {
        return 'Objective: Defeat the slime near the road.';
    }

    if (!state.encounters.banditCleared) {
        return 'Objective: Enter the cave and defeat the bandit.';
    }

    if (!state.inventory.key) {
        return 'Objective: Find the cave key.';
    }

    if (state.quest === QUEST_STATES.gotKey) {
        return 'Objective: Return to town and unlock the chest.';
    }

    if (state.quest === QUEST_STATES.chestUnlocked) {
        return 'Objective: Claim your reward from the opened chest.';
    }

    return 'Objective: Loop complete. Explore freely.';
}

function refreshObjective(state) {
    state.objectiveText = getObjectiveText(state);
    const objective = ensureObjectiveOverlay();
    objective.textContent = state.objectiveText;
}

function createLoopState() {
    const state = {
        inventory: createInventory(),
        quest: QUEST_STATES.notStarted,
        encounters: {
            slimeCleared: false,
            banditCleared: false
        },
        rewardClaimed: false,
        objectiveText: ''
    };

    state.hasItem = (item) => !!state.inventory[item];
    state.pickupItem = (item) => {
        if (!INVENTORY_SLOTS.includes(item)) {
            return false;
        }

        state.inventory[item] = true;
        if (item === 'key' && state.quest === QUEST_STATES.notStarted) {
            state.quest = QUEST_STATES.gotKey;
        }

        refreshObjective(state);
        return true;
    };

    state.consumeItem = (item) => {
        if (!INVENTORY_SLOTS.includes(item) || !state.inventory[item]) {
            return false;
        }

        state.inventory[item] = false;
        refreshObjective(state);
        return true;
    };

    state.markEncounterCleared = (encounter) => {
        if (!(encounter in state.encounters)) {
            return;
        }

        state.encounters[encounter] = true;
        refreshObjective(state);
    };

    state.setQuest = (nextQuestState) => {
        if (!Object.values(QUEST_STATES).includes(nextQuestState)) {
            return;
        }

        state.quest = nextQuestState;
        refreshObjective(state);
    };

    refreshObjective(state);
    return state;
}

export function getLoopState() {
    if (!globalThis[LOOP_STATE_KEY]) {
        globalThis[LOOP_STATE_KEY] = createLoopState();
    }

    return globalThis[LOOP_STATE_KEY];
}

export function resetLoopState() {
    globalThis[LOOP_STATE_KEY] = createLoopState();
    return globalThis[LOOP_STATE_KEY];
}
