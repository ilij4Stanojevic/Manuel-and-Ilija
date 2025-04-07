let direction; // Usare quando si invocherà la classe per gli spari
// "u" = up
// "d" = down
// "l" = left
// "r" = right

class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, walls, hpStart){  
        super(scene, x, y, "player");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setDisplaySize(50,50);

        if(walls){
            scene.physics.add.collider(this, walls);
        }
        
        this.hp = hpStart;

        this.damage = 10;

        scene.player = this;
        this.scene.player.body.setSize(26, 40);

        this.spacebar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.projectiles = this.scene.add.group();
        this.projectiles.danni = this.danni;

        this.holdTime = 0;  // Track how long the player holds the "E" key
        this.requiredHoldTime = 50;  // Time required to fill the bar (in seconds)
        this.delta = 0;

        this.progressBar = scene.add.graphics();

        // Vari tasti
        this.cursorKeys = scene.input.keyboard.createCursorKeys();
        this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Prendo in una variabile il tasto interazione (e)
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // Prendo in una variabile il tasto avanti (w)
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // Prendo in una variabile il tasto sinistra (a)
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); // Prendo in una variabile il tasto sotto (s)
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // Prendo in una variabile il tasto destra (d)
    }

    movePlayerManager(scene, cursorKeys){
        let moving = false;
        let speed = 200;
        let flipped = false;

        if (this.cursorKeys.left.isDown || this.keyA.isDown) {
            scene.player.setVelocityX(-speed);
            moving = true;
            flipped = true;
            direction = "l";
            scene.player.anims.play("player_animRight", true);
        } else if (this.cursorKeys.right.isDown || this.keyD.isDown) {
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

        if (this.cursorKeys.up.isDown || this.keyW.isDown) {
            scene.player.setVelocityY(-speed);
            moving = true;
            direction = "u";
            scene.player.anims.play("playerUp", true);
        } else if (this.cursorKeys.down.isDown || this.keyS.isDown) {
            scene.player.setVelocityY(speed);
            moving = true;
            direction = "d";
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
        let playerX = Math.floor(this.scene.player.x / tileSize);
        let playerY = Math.floor(this.scene.player.y / tileSize);

        let doorPositionX = x;
        let doorPositionY = y;
        if(playerX === doorPositionX && playerY === doorPositionY){
            return true;
        }
        return false;
    }

    gotHitted(scene, damage){
        this.hp -= damage;

        if(this.hp <= 0){
            // scene.scene.start("GameOver");
        }
    }
    showBarHp(scene, camera, hpBar){
        hpBar.clear();
        let x = 0;
        let y = 0;

        let progress = Phaser.Math.Clamp(this.hp / 100, 0, 1);

        scene.hpBar.fillStyle(0x00ff00, 1);
        scene.hpBar.lineStyle(2, 0x000000);

        scene.hpBar.fillRect(x, y, barHpWidth * progress, barHpHeight);
        scene.hpBar.strokeRect(x, y, barHpWidth, barHpHeight);

        hpBar.setScrollFactor(0);
    }
    
    crossing(scene, holdTime,requiredHoldTime, delta, progressBar, camera){
        holdTime += delta / 1000;

        let progress = Phaser.Math.Clamp(holdTime / requiredHoldTime, 0, 1);

        scene.progressBar.fillStyle(0x00ff00, 1);
        scene.progressBar.lineStyle(2, 0x000000);

        let centerX = this.scene.camera.scrollX + (768 / 2) - (barProgressWidth / 2); // (768/2) perché è la metà dei quello che vediamo 
        let centerY = this.scene.camera.scrollY;

        scene.progressBar.fillRect(centerX, centerY, barProgressWidth * progress, barProgressHeight);
        scene.progressBar.strokeRect(centerX, centerY, barProgressWidth, barProgressHeight); 

        return holdTime;
    }

    shoot(scene, player){
        let proiettile = new Beam(this.scene, this.scene.player, this.scene.avversario, "beamUd", direction);
            this.projectiles.add(proiettile);
    }
    update(){
            this.projectiles.getChildren().forEach(proiettile => {
                proiettile.update();
            });
            if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shoot(this, this.scene.player);
        }
        if (this.keyE.isDown) { // Controllo quando viene cliccato una volta sola
            if(this.scene.player.checkPositionToDoor(this, 13, 0, tileSize)){ // Funzione che controlla la posizione del giocatore con la posizione della porta  
                this.holdTime = this.scene.player.crossing(this, this.holdTime, this.requiredHoldTime, this.delta,this.progressBar, this.camera);

                if(this.holdTime >= this.requiredHoldTime){
                    this.progressBar.clear();

                    this.scene.registry.set("playerHP", this.scene.player.hp);

                    this.scene.scene.start("Boss_room1");
                }

                this.delta += 16;
            }
        }else{
            this.holdTime = 0;
            this.delta = 0;
            this.progressBar.clear();
        }
    }
}