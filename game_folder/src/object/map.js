
class Map{
    constructor(scene, walls, numberMap){
        var collisionMap = null;
        const mineralDimension = 32;
        var texture;
        
        var rocktype = [
            // bootgame
            {
                occupedTilesX: [6, 6,  7, 7,  8, 8],
                occupedTilesY: [9, 10, 9, 10, 9, 10],
                mineralTypes: [2, 3],
                mineralSpawnRate: [30, 70]
            },
            // boss rooom
            {
                occupedTilesX: [],
                occupedTilesY: [],
                mineralTypes: [],
                mineralSpawnRate: []
            },
            // tutorial
            {
                occupedTilesX: [],
                occupedTilesY: [],
                mineralTypes: [],
                mineralSpawnRate: []
            },
            // azeroth
            {
                occupedTilesX: [6, 6,  7, 7,  8, 8],
                occupedTilesY: [9, 10, 9, 10, 9, 10],
                mineralTypes: [],
                mineralSpawnRate: []
            },
            // spaceship
            {
                occupedTilesX: [],
                occupedTilesY: [],
                mineralTypes: [],
                mineralSpawnRate: []
            }
        ];
        switch(numberMap){
            case 1:
                collisionMap = collisionMap1Backup;
                break;
            case 2:
                collisionMap = collisionMap2Backup;
                break;
            case 3:
                collisionMap = collisionMap3Backup;
                break; 
            case 4:
                collisionMap = collisionMap4Backup;
                break; 
            case 5:
                collisionMap = collisionMap5Backup;
                break; 
        }

        var occupedTilesLength = rocktype[numberMap-1].occupedTilesX.length;

        for (let row = 0; row < collisionMap.length; row++) {
            for (let col = 0; col < collisionMap[row].length; col++) {
                var rockRate = 0
                var totale = 0;
                var accumulato = 0;
                this.salta = false;
                if (collisionMap[row][col] === 1) {
                    let x = col * tileSize + tileSize / 2;
                    let y = row * tileSize + tileSize / 2;
                    
                    let wall = scene.add.rectangle(x, y, tileSize, tileSize); // Red debug box
                    scene.physics.add.existing(wall, true); // Make it a static physics body
                    
                    scene.walls.add(wall);
                } else if(collisionMap[row][col] === 0){
                    for(let i = 0; i < occupedTilesLength; i++){
                        if(rocktype[numberMap-1].occupedTilesY[i] === row && rocktype[numberMap-1].occupedTilesX[i] === col){
                            this.salta = true;
                        }
                    }
                    if(this.salta){
                        continue;
                    } else{
                        if(rocktype[numberMap-1].mineralTypes.length > 0){
                            let x = col * mineralDimension + mineralDimension / 2;
                            let y = row * mineralDimension + mineralDimension / 2;
                            
                            var spawnRate = Math.random() * 100;
                            if(spawnRate < 15){
                                for(var i = 0; i < rocktype[numberMap-1].mineralTypes.length; i++){
                                    totale += rocktype[numberMap-1].mineralSpawnRate[i];
                                }
                                let rnd = Math.random() * totale;
                                for (let i = 0; i < rocktype[numberMap-1].mineralSpawnRate.length; i++) {
                                    accumulato += rocktype[numberMap-1].mineralSpawnRate[i];
                                    if (rnd < accumulato) {
                                        rockRate = rocktype[numberMap-1].mineralTypes[i];
                                        break;
                                    }
                                }
                                switch(rockRate){
                                    case "2":
                                        texture = this.play("rock1_anim");
                                        break;
                                    case "3":
                                        texture = this.play("rock2_anim");
                                        break;
                                    case "4":
        
                                        break;
                                    case "5":
        
                                        break;
                                }
                                collisionMap[row][col] = rockRate;
                                let tipoMinerale = collisionMap[row][col];
                                let mineral = new Minerals(scene, x * 2, y * 2, tipoMinerale);
                                scene.minerals.add(mineral);
                            
                                scene.physics.add.existing(mineral, true); // Make it a static physics body
        
                                scene.minerals.add(mineral);
                            }
                        }
                    }                    
                }
            }
        }
        switch(numberMap){
            case 1:
                collisionMap1 = collisionMap;
                break;
            case 2:
                collisionMap2 = collisionMap;
                break;
            case 3:
                collisionMap3 = collisionMap;
                break; 
            case 4:
                collisionMap4 = collisionMap;
                break; 
            case 5:
                collisionMap5 = collisionMap;
                break; 
        }
    }
}