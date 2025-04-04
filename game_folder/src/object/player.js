let direction; // Usare quando si invocherà la classe per gli spari
// "u" = up
// "d" = down
// "l" = left
// "r" = right

class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, walls){  
        super(scene, x, y, "player");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setDisplaySize(50,50);

        if(walls){
            scene.physics.add.collider(this, walls);
        }
        
        scene.player = this;
    }

    movePlayerManager(scene, cursorKeys){
        let moving = false;
        let speed = 200;
        let flipped = false;

        if (scene.cursorKeys.left.isDown) {
            scene.player.setVelocityX(-speed);
            moving = true;
            flipped = true;
            direction = "l";
            scene.player.anims.play("player_animRight", true);
        } else if (scene.cursorKeys.right.isDown) {
            scene.player.setVelocityX(speed);
            flipped = false;
            moving = true;
            direction = "r";
            scene.player.anims.play("player_animRight", true);
        } else {
            scene.player.setVelocityX(0);
            switch(direction){
                case "l":
                    flipped = true;
                    break;
                case "r":
                    flipped = false;
                    break;
            }
            scene.player.anims.play("player_animStoppedRight",true);
        }

        if (scene.cursorKeys.up.isDown) {
            scene.player.setVelocityY(-speed);
            moving = true;
            direction = "u";
            console.log(scene.anims.exists("playerUp"));
            scene.player.anims.play("playerUp", true);
        } else if (scene.cursorKeys.down.isDown) {
            scene.player.setVelocityY(speed);
            moving = true;
            direction = "d";
            console.log(scene.anims.exists("playerDOWN"));
            scene.player.anims.play("playerDOWN", true);
        } else {
            scene.player.setVelocityY(0);
            switch(direction){
                case "d":
                    scene.player.anims.play("player_animStoppedDown", true);
                    break;
                case "u":
                    scene.player.anims.play("player_animStoppedUp", true);
                    break;
            }
        }

        scene.player.setFlipX(flipped);

        if (moving) {
            scene.camera.startFollow(scene.player);
        }
    }

    checkPositionToDoor(scene, x, y, tileSize){
        let playerX = Math.floor(scene.player.x / tileSize);
        let playerY = Math.floor(scene.player.y / tileSize);

        let doorPositionX = x;
        let doorPositionY = y;
        if(playerX === doorPositionX && playerY === doorPositionY){
            return true;
        }
        return false;
    }
    
    crossing(scene, holdTime,requiredHoldTime, delta, progressBar, camera){
        holdTime += delta / 1000;

        let progress = Phaser.Math.Clamp(holdTime / requiredHoldTime, 0, 1);

        scene.progressBar.fillStyle(0x00ff00, 1);
        scene.progressBar.lineStyle(2, 0x000000);

        let centerX = camera.scrollX + (768 / 2) - (barProgressWidth / 2); // (768/2) perché è la metà dei quello che vediamo 
        let centerY = camera.scrollY;

        scene.progressBar.fillRect(centerX, centerY, barProgressWidth * progress, barProgressHeight);
        scene.progressBar.strokeRect(centerX, centerY, barProgressWidth, barProgressHeight); 

        return holdTime;
    }
}


// BAstardo