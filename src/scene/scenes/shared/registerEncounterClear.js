export function registerEncounterClear({ scene, enemy, loopState, encounterKey }) {
    let markedCleared = false;

    scene.onBeforeRenderObservable.add(() => {
        if (markedCleared || enemy?.health?.isAlive !== false) {
            return;
        }

        markedCleared = true;
        loopState.markEncounterCleared(encounterKey);
    });
}
