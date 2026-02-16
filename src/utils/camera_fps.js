export function setupFpsCamera(scene, characterCapsule, engine) {
    const eyeHeight = 1.6;
    const cameraPosition = characterCapsule.position.add(new BABYLON.Vector3(0, eyeHeight, 0));
    const camera = new BABYLON.UniversalCamera("fpsCam", cameraPosition, scene);

    const canvas = document.getElementById('renderCanvas');
    camera.attachControl(canvas, false);

    camera.minZ = 0.05;
    camera.inertia = 0.2;
    camera.angularSensibility = 4000;

    camera.parent = characterCapsule;
    scene.activeCamera = camera;

    scene.onPointerDown = () => {
        if (!document.pointerLockElement && canvas) {
            canvas.requestPointerLock();
        }
    };

    return camera;
}
