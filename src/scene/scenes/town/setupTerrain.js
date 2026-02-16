export function setupTownTerrain(scene) {
    const terrainMaterial = new BABYLON.TerrainMaterial('terrainMaterial', scene);
    terrainMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    terrainMaterial.specularPower = 64;
    terrainMaterial.mixTexture = new BABYLON.Texture('assets/textures/terrain/mixMap.png', scene);
    terrainMaterial.diffuseTexture1 = new BABYLON.Texture('assets/textures/terrain/floor.png', scene);
    terrainMaterial.diffuseTexture2 = new BABYLON.Texture('assets/textures/terrain/rock.png', scene);
    terrainMaterial.diffuseTexture3 = new BABYLON.Texture('assets/textures/terrain/grass.png', scene);

    terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 15;
    terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 8;
    terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 23;

    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap('ground', 'assets/textures/terrain/hieghtMap.png', {
        width: 2000,
        height: 2000,
        subdivisions: 100,
        minHeight: 0,
        maxHeight: 30,
        onReady(readyGround) {
            readyGround.position.y = 10.05;
            readyGround.material = terrainMaterial;
            readyGround.receiveShadows = true;
            new BABYLON.PhysicsAggregate(readyGround, BABYLON.PhysicsShapeType.MESH, { mass: 0, restitution: 0.0, friction: 1000000000.8 }, scene);
            setTimeout(() => {
                scene.physicsEnabled = true;
            }, 10);
        }
    }, scene);

    return ground;
}
