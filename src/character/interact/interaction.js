const DEFAULT_INTERACTION_RANGE = 6;
const INTERACTABLE_TAG = "interactable";

const interactionHandlers = {
    door: ({ mesh, interactable }) => {
        const state = interactable.state || (interactable.state = { open: false });
        const hingeMesh = mesh.parent ?? mesh;
        const closedRotationY = interactable.closedRotationY ?? hingeMesh.rotation.y;
        if (interactable.closedRotationY == null) {
            interactable.closedRotationY = closedRotationY;
        }

        state.open = !state.open;
        hingeMesh.rotation.y = state.open
            ? interactable.closedRotationY + (interactable.openAngle ?? Math.PI / 2)
            : interactable.closedRotationY;

        console.log(`Door ${state.open ? "opened" : "closed"}:`, hingeMesh.name);
    },
    pickup: ({ mesh }) => {
        mesh.setEnabled(false);
        mesh.isPickable = false;
        console.log("Picked up:", mesh.name);
    },
    chest: ({ mesh, interactable }) => {
        const state = interactable.state || (interactable.state = { open: false });
        state.open = !state.open;
        mesh.rotation.x = state.open ? -0.35 : 0;
        console.log(`Chest ${state.open ? "opened" : "closed"}:`, mesh.name);
    }
};

function ensureCrosshairOverlay() {
    let overlay = document.getElementById("crosshairOverlay");
    if (overlay) {
        return overlay;
    }

    overlay = document.createElement("div");
    overlay.id = "crosshairOverlay";
    overlay.className = "crosshair";

    const horizontal = document.createElement("span");
    horizontal.className = "line horizontal";
    const vertical = document.createElement("span");
    vertical.className = "line vertical";
    const dot = document.createElement("span");
    dot.className = "dot";

    overlay.append(horizontal, vertical, dot);

    const prompt = document.createElement("div");
    prompt.id = "interactPrompt";

    document.body.append(overlay, prompt);
    return overlay;
}

function setCrosshairState(isOnTarget, promptText = "") {
    const overlay = ensureCrosshairOverlay();
    overlay.classList.toggle("crosshair--active", isOnTarget);

    const prompt = document.getElementById("interactPrompt");
    prompt.textContent = isOnTarget ? promptText || "Press E" : "";
}

function getInteractableRecord(mesh) {
    let currentMesh = mesh;
    while (currentMesh) {
        const metadata = currentMesh.metadata?.interactable;
        const isTagged = BABYLON.Tags?.MatchesQuery(currentMesh, INTERACTABLE_TAG);
        if (metadata || isTagged) {
            const interactable = metadata || { type: "generic" };
            return { mesh: currentMesh, interactable };
        }
        currentMesh = currentMesh.parent;
    }

    return null;
}

export function markMeshAsInteractable(mesh, interactable = {}) {
    if (!mesh) {
        return;
    }

    const defaultPrompt = interactable.prompt || (interactable.type ? `Press E - ${interactable.type}` : "Press E");
    mesh.metadata = {
        ...(mesh.metadata || {}),
        interactable: {
            ...interactable,
            prompt: defaultPrompt,
            type: interactable.type || "generic"
        }
    };

    BABYLON.Tags?.AddTagsTo(mesh, `${INTERACTABLE_TAG} interact:${mesh.metadata.interactable.type}`);
    mesh.isPickable = true;
}

export function performInteractRaycast(scene, maxDistance = DEFAULT_INTERACTION_RANGE) {
    const camera = scene?.activeCamera;
    if (!camera) {
        return null;
    }

    const origin = camera.position;
    const direction = camera.getForwardRay().direction;
    const ray = new BABYLON.Ray(origin, direction, maxDistance);

    const pickInfo = scene.pickWithRay(ray, (mesh) => {
        if (!mesh || !mesh.isEnabled() || !mesh.isPickable) {
            return false;
        }

        return !!getInteractableRecord(mesh);
    });

    if (!pickInfo?.hit || !pickInfo.pickedMesh) {
        return null;
    }

    const target = getInteractableRecord(pickInfo.pickedMesh);
    if (!target) {
        return null;
    }

    return {
        pickInfo,
        ...target
    };
}

export function createInteractionController(scene, options = {}) {
    const maxDistance = options.maxDistance || DEFAULT_INTERACTION_RANGE;

    const dispatch = (target) => {
        if (!target) {
            return false;
        }

        const { interactable, mesh, pickInfo } = target;
        const handler = interactionHandlers[interactable.type] || interactionHandlers[interactable.action];

        if (handler) {
            handler({ mesh, pickInfo, interactable, scene });
        }

        if (typeof interactable.onInteract === "function") {
            interactable.onInteract({ mesh, pickInfo, interactable, scene });
            return true;
        }

        if (handler) {
            return true;
        }

        console.log("Interacted with", mesh.name, interactable.type);
        return true;
    };

    const poll = () => {
        const target = performInteractRaycast(scene, maxDistance);
        setCrosshairState(!!target, target?.interactable?.prompt);
        return target;
    };

    const interact = () => {
        const target = performInteractRaycast(scene, maxDistance);
        if (!target) {
            return false;
        }

        return dispatch(target);
    };

    return {
        poll,
        interact,
        dispatch
    };
}
