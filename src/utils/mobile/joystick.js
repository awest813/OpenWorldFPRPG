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




    // Add an action button for jumping
    const jumpButton = document.createElement('button');
    jumpButton.innerText = 'Jump';
    jumpButton.style.position = 'absolute';
    jumpButton.style.bottom = '20px';
    jumpButton.style.right = '20px';
    jumpButton.style.width = '100px';
    jumpButton.style.height = '50px';
    jumpButton.style.zIndex = '2';





    // Append the button to the body
    document.body.appendChild(jumpButton);

    // Add event listener for the jump button
    jumpButton.addEventListener('touchstart', () => {
        // Example jump logic
        if (player.physicsImpostor) {
            const jumpForce = new BABYLON.Vector3(0, 10, 0);
            player.physicsImpostor.applyImpulse(jumpForce, player.getAbsolutePosition());
        }
    });



    scene.onBeforeRenderObservable.add(() => {
        const inputMap = getInputMap();
        if (movementJoystick.deltaPosition.y > 0.4) {
            inputMap["w"] = true;
            inputMap["s"] = false;
            inputMap["a"] = false;
            inputMap["d"] = false;
        }
        if (movementJoystick.deltaPosition.y < -0.4) {
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
