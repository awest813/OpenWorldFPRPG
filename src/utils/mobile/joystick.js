import { getInputMap, setOnMobile } from '../../core/runtimeState.js';

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
export function createMobileControls(scene, camera, player) {
    const onMobile = isMobile();
    setOnMobile(onMobile);
    ON_MOBILE = onMobile;
    if (!onMobile) { return; }

    // TODO move to own class
    // Virtual joystick setup for movement
    const movementJoystick = new BABYLON.VirtualJoystick(true); // Left joystick

    movementJoystick.setJoystickSensibility(0.1);
    movementJoystick.setJoystickColor('orange');

    // Optional joystick for camera (if needed)
    const cameraJoystick = new BABYLON.VirtualJoystick(false); // Right joystick
    cameraJoystick.setJoystickSensibility(0.1);
    cameraJoystick.setJoystickColor('blue');


    movementJoystick.setActionOnTouch(() => {
        // Add jump or attack logic here if needed
    });

    scene.registerBeforeRender(() => {
        // Joystick controls for movement
        const inputMap = getInputMap();
        const moveX = movementJoystick.deltaPosition.x;
        const moveZ = movementJoystick.deltaPosition.y;

        if (moveX !== 0 || moveZ !== 0) {
            // Translate joystick movement to world movement

            // const moveDirection = new BABYLON.Vector3(moveX, 0, -moveZ);
            // const transformedDirection = BABYLON.Vector3.TransformCoordinates(moveDirection, camera.getWorldMatrix());
            // transformedDirection.y = 0;

            // // Apply movement to the player
            // player.moveWithCollisions(transformedDirection.scale(0.1));
        } else {
            inputMap["w"] = false;
            inputMap["s"] = false;
            inputMap["a"] = false;
            inputMap["d"] = false;
        }

        // Joystick controls for camera
        const cameraX = cameraJoystick.deltaPosition.x;
        const cameraY = cameraJoystick.deltaPosition.y;

        if (cameraX !== 0 || cameraY !== 0) {

            // camera.alpha += cameraX * 0.02; // Horizontal rotation
            // camera.beta -= cameraY * 0.02; // Vertical rotation

            // // Clamp beta to avoid flipping
            // camera.beta = Math.max(0.1, Math.min(Math.PI / 2, camera.beta));
        }
    });




    const controlsHint = document.createElement('div');
    controlsHint.innerHTML = '<strong>Mobile Controls</strong><br>Left stick: Move<br>Quick: Attack<br>Heavy: Power';
    controlsHint.style.position = 'fixed';
    controlsHint.style.top = '12px';
    controlsHint.style.left = '12px';
    controlsHint.style.padding = '8px 10px';
    controlsHint.style.color = '#ffffff';
    controlsHint.style.background = 'rgba(0, 0, 0, 0.55)';
    controlsHint.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    controlsHint.style.borderRadius = '6px';
    controlsHint.style.fontFamily = 'Open Sans, Helvetica Neue, sans-serif';
    controlsHint.style.fontSize = '12px';
    controlsHint.style.lineHeight = '1.5';
    controlsHint.style.zIndex = '20';

    const quickAttackButton = document.createElement('button');
    quickAttackButton.innerText = 'Attack';
    quickAttackButton.style.position = 'absolute';
    quickAttackButton.style.bottom = '20px';
    quickAttackButton.style.right = '20px';
    quickAttackButton.style.width = '100px';
    quickAttackButton.style.height = '50px';
    quickAttackButton.style.zIndex = '2';

    const heavyAttackButton = document.createElement('button');
    heavyAttackButton.innerText = 'Power';
    heavyAttackButton.style.position = 'absolute';
    heavyAttackButton.style.bottom = '80px';
    heavyAttackButton.style.right = '20px';
    heavyAttackButton.style.width = '100px';
    heavyAttackButton.style.height = '50px';
    heavyAttackButton.style.zIndex = '2';





    document.body.appendChild(controlsHint);
    document.body.appendChild(quickAttackButton);
    document.body.appendChild(heavyAttackButton);

    quickAttackButton.addEventListener('touchstart', (event) => {
        event.preventDefault();
        if (typeof window.onQuickAttack === 'function') {
            window.onQuickAttack();
        }
    });

    heavyAttackButton.addEventListener('touchstart', (event) => {
        event.preventDefault();
        if (typeof window.onHeavyAttack === 'function') {
            window.onHeavyAttack();
        }
    });



    scene.onBeforeRenderObservable.add(() => {
        const inputMap = getInputMap();
        if (movementJoystick.deltaPosition.y < -0.4) {
            inputMap["w"] = true;
            inputMap["s"] = false;
            inputMap["a"] = false;
            inputMap["d"] = false;
        }
        if (movementJoystick.deltaPosition.y > 0.4) {
            inputMap["w"] = false;
            inputMap["s"] = true;
            inputMap["a"] = false;
            inputMap["d"] = false;
        }
        if (movementJoystick.deltaPosition.x > 0.75) { inputMap["d"] = true; inputMap["a"] = false; inputMap["w"] = false; inputMap["s"] = false; }
        if (movementJoystick.deltaPosition.x < -0.75) { inputMap["a"] = true; inputMap["d"] = false; inputMap["w"] = false; inputMap["s"] = false; }

        // if (movementJoystick.deltaPosition.y > 0.4 && movementJoystick.deltaPosition.x > 0.75) { inputMap["e"] = true; inputMap["q"] = false; inputMap["w"] = false; inputMap["s"] = true; }
        // if (movementJoystick.deltaPosition.y < -0.75 && movementJoystick.deltaPosition.x < -0.75) { inputMap["q"] = true; inputMap["e"] = false; inputMap["w"] = false; inputMap["s"] = true; }


        if (movementJoystick.deltaPosition.x > -0.75 && movementJoystick.deltaPosition.x < 0.75 && movementJoystick.deltaPosition.y > -0.4 && movementJoystick.deltaPosition.y < 0.4) {
            // no movement
            inputMap["w"] = false;
            inputMap["s"] = false;
            inputMap["a"] = false;
            inputMap["d"] = false;
        }


    });
}
