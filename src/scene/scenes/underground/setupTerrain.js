export function setupUndergroundTerrain(scene) {
    const terrainMaterial = new BABYLON.TerrainMaterial('terrainMaterial', scene);
    terrainMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    terrainMaterial.specularPower = 64;
    terrainMaterial.mixTexture = new BABYLON.Texture('assets/textures/terrain/mixMap.png', scene);
    terrainMaterial.diffuseTexture1 = new BABYLON.Texture('assets/textures/terrain/tileDark.png', scene);
    terrainMaterial.diffuseTexture2 = new BABYLON.Texture('assets/textures/terrain/grassRock.png', scene);
    terrainMaterial.diffuseTexture3 = new BABYLON.Texture('assets/textures/terrain/grass.png', scene);

    terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 25;
    terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 20;
    terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 23;

    const terrain = BABYLON.MeshBuilder.CreateGroundFromHeightMap('ground', 'assets/textures/terrain/hieghtMap.png', {
        width: 1000,
        height: 1000,
        subdivisions: 100,
        minHeight: 0,
        maxHeight: -30,
        onReady(readyGround) {
            readyGround.position.y = -10.05;
            readyGround.material = terrainMaterial;
            readyGround.receiveShadows = true;
            setTimeout(() => {
                new BABYLON.PhysicsAggregate(readyGround, BABYLON.PhysicsShapeType.MESH, { mass: 0, restitution: 0.0, friction: 1000000000.8 }, scene);
                setTimeout(() => {
                    scene.physicsEnabled = true;
                }, 1000);
            }, 1000);
        }
    }, scene);

    return { terrain, terrainMaterial };
}
