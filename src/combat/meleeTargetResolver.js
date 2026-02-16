const DEFAULT_MELEE_RANGE = 18;
const DEFAULT_CONE_DOT_THRESHOLD = 0.5;
let showMeleeTargetingDebug = false;

export function setMeleeTargetingDebugEnabled(enabled) {
    showMeleeTargetingDebug = Boolean(enabled);
}

export function isMeleeTargetingDebugEnabled() {
    return showMeleeTargetingDebug;
}

export function resolveMeleeTarget(scene, origin, cameraForward, options = {}) {
    if (!scene || !origin || !cameraForward) {
        return null;
    }

    const maxDistance = options.maxDistance ?? DEFAULT_MELEE_RANGE;
    const coneDotThreshold = options.coneDotThreshold ?? DEFAULT_CONE_DOT_THRESHOLD;
    const candidates = getNearbyEnemyCandidates(scene, options.enemyMeshes);

    const forward = cameraForward.clone();
    forward.y = 0;
    if (forward.lengthSquared() === 0) {
        return null;
    }
    forward.normalize();

    const validCandidates = [];
    for (const enemy of candidates) {
        if (!enemy?.position) continue;

        const toEnemy = enemy.position.subtract(origin);
        toEnemy.y = 0;
        const distance = toEnemy.length();
        if (distance === 0 || distance > maxDistance) {
            continue;
        }

        const directionToEnemy = toEnemy.scale(1 / distance);
        const dot = BABYLON.Vector3.Dot(forward, directionToEnemy);
        if (dot < coneDotThreshold) {
            continue;
        }

        validCandidates.push({ enemy, distance, dot });
    }

    validCandidates.sort((a, b) => a.distance - b.distance);
    const result = validCandidates[0]?.enemy ?? null;

    if (showMeleeTargetingDebug) {
        drawMeleeResolverDebug(scene, origin, forward, {
            maxDistance,
            coneDotThreshold,
            candidates,
            validCandidates,
            selected: result
        });
    }

    return result;
}

function getNearbyEnemyCandidates(scene, providedEnemyMeshes) {
    if (Array.isArray(providedEnemyMeshes)) {
        return providedEnemyMeshes.filter(isAliveEnemyMesh);
    }

    return scene.meshes.filter(isAliveEnemyMesh);
}

function isAliveEnemyMesh(mesh) {
    return mesh?.name === 'enemy' && mesh?.health?.isAlive;
}

function drawMeleeResolverDebug(scene, origin, forward, debugData) {
    const debugColor = BABYLON.Color3.Yellow();
    const selectedColor = BABYLON.Color3.Green();
    const rejectedColor = BABYLON.Color3.Red();

    const base = origin.clone();
    base.y += 0.5;

    const rangePoint = base.add(forward.scale(debugData.maxDistance));
    const forwardLine = BABYLON.MeshBuilder.CreateLines(
        'melee-debug-forward',
        { points: [base, rangePoint], updatable: false },
        scene
    );
    forwardLine.color = debugColor;

    const coneAngle = Math.acos(debugData.coneDotThreshold);
    const leftDir = rotateOnY(forward, coneAngle);
    const rightDir = rotateOnY(forward, -coneAngle);
    const leftLine = BABYLON.MeshBuilder.CreateLines('melee-debug-left', { points: [base, base.add(leftDir.scale(debugData.maxDistance))] }, scene);
    leftLine.color = debugColor;
    const rightLine = BABYLON.MeshBuilder.CreateLines('melee-debug-right', { points: [base, base.add(rightDir.scale(debugData.maxDistance))] }, scene);
    rightLine.color = debugColor;

    const candidateLines = debugData.candidates.map((enemy) => {
        const color = enemy === debugData.selected
            ? selectedColor
            : debugData.validCandidates.some(candidate => candidate.enemy === enemy)
                ? debugColor
                : rejectedColor;

        const line = BABYLON.MeshBuilder.CreateLines(
            'melee-debug-candidate',
            { points: [base, enemy.position.clone()] },
            scene
        );
        line.color = color;
        return line;
    });

    setTimeout(() => {
        forwardLine.dispose();
        leftLine.dispose();
        rightLine.dispose();
        candidateLines.forEach((line) => line.dispose());
    }, 120);
}

function rotateOnY(direction, angle) {
    const quaternion = BABYLON.Quaternion.FromEulerAngles(0, angle, 0);
    return direction.rotateByQuaternionToRef(quaternion, new BABYLON.Vector3());
}
