let direction; // Usato per determinare la direzione quando il giocatore spara
// "u" = up (su)
// "d" = down (giù)
// "l" = left (sinistra)
// "r" = right (destra)

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, walls, minerals, hpStart, interactionTargets = []) {
        super(scene, x, y, "player");
    
        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        this.setCollideWorldBounds(true);
        this.setDisplaySize(50, 50);
        if (walls) scene.physics.add.collider(this, walls);
        if (minerals) scene.physics.add.collider(this, minerals);
    
        this.hp = hpStart;
        this.damage = 10;
        scene.player = this;
    
        this.scene.player.body.setSize(26, 40);
    
        this.spacebar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = scene.add.group();
        this.projectiles.danni = this.danni;
    
        this.holdTime = 0;
        this.requiredHoldTime = 50;
        this.delta = 0;
        this.progressBar = scene.add.graphics();
        this.hpBar = scene.add.graphics();
        
        // Definizione dei tasti per il movimento
        this.cursorKeys = scene.input.keyboard.createCursorKeys();
        this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    
        this.interactionTargets = interactionTargets; // 👈 Ora è una lista di target
    }
    
    //controlla se è vicino a oggetti con cui può interagire
    getNearbyInteractable(tileSize = 64) {
        let playerTileX = Math.floor(this.x / tileSize);
        let playerTileY = Math.floor(this.y / tileSize);
    
        // Interazione con oggetti interattivi (porte, NPC, ecc.)
        for (let target of this.interactionTargets) {
            if (target.tileX === playerTileX && target.tileY === playerTileY) {
                return target;
            }
        }
    
        // Interazione con minerali, solo se esistono
        if (this.scene.minerals && this.scene.minerals.children) {
            let nearbyMineral = null;
            this.scene.minerals.children.iterate((mineral) => {
                if (!mineral) return;
                let mineralTileX = Math.floor(mineral.x / tileSize);
                let mineralTileY = Math.floor(mineral.y / tileSize);
                if (Math.abs(playerTileX - mineralTileX) <= 1 && Math.abs(playerTileY - mineralTileY) <= 1) {
                    nearbyMineral = mineral;
                }
            });
    
            if (nearbyMineral) {
                return {
                    type: "mineral",
                    object: nearbyMineral,
                    tileX: Math.floor(nearbyMineral.x / tileSize),
                    tileY: Math.floor(nearbyMineral.y / tileSize),
                    onComplete: () => {
                        nearbyMineral.destroy();
                    }
                };
            }
        }
    
        return null;
    }
    
    
    // Gestisce il movimento del giocatore
    movePlayerManager(scene, cursorKeys){
        let moving = false;
        let speed = 200; // Velocità del giocatore
        let flipped = false;

        // Movimento a sinistra
        if (this.cursorKeys.left.isDown || this.keyA.isDown) {
            scene.player.setVelocityX(-speed); // Muove il giocatore verso sinistra
            moving = true;
            this.setFlipX(true);
            direction = "l"; // Direzione sinistra
            scene.player.anims.play("player_animRight", true); // Riproduce animazione sinistra
        } 
        // Movimento a destra
        else if (this.cursorKeys.right.isDown || this.keyD.isDown) {
            scene.player.setVelocityX(speed); // Muove il giocatore verso destra
            this.setFlipX(false);
            moving = true;
            direction = "r"; // Direzione destra
            scene.player.anims.play("player_animRight", true); // Riproduce animazione destra
        } 
        // Se non si muove
        else {
            scene.player.setVelocityX(0);
            switch(direction){
                case "l":
                    this.setFlipX(true);
                    scene.player.anims.play("player_animStoppedRight", true); // Riproduce animazione ferma
                    break;
                case "r":
                    this.setFlipX(false);
                    scene.player.anims.play("player_animStoppedRight", true); // Riproduce animazione ferma
                    break;
            }
        }

        // Movimento su
        if (this.cursorKeys.up.isDown || this.keyW.isDown) {
            scene.player.setVelocityY(-speed); // Muove il giocatore verso l'alto
            moving = true;
            direction = "u"; // Direzione su
            scene.player.anims.play("playerUp", true); // Riproduce animazione su
        } 
        // Movimento giù
        else if (this.cursorKeys.down.isDown || this.keyS.isDown) {
            scene.player.setVelocityY(speed); // Muove il giocatore verso il basso
            moving = true;
            direction = "d"; // Direzione giù
            scene.player.anims.play("playerDOWN", true); // Riproduce animazione giù
        }
        // Se non si muove
        else {
            scene.player.setVelocityY(0);
            switch(direction){
                case "d":
                    scene.player.anims.play("player_animStoppedDown", true); // Animazione ferma giù
                    break;
                case "u":
                    scene.player.anims.play("player_animStoppedUp", true); // Animazione ferma su
                    break;
            }
        }

        // Inizia a seguire il giocatore con la telecamera quando si muove
        if (moving) {
            scene.camera.startFollow(scene.player);
        }
    }

    // Controlla se il giocatore è sulla stessa posizione della porta
    checkPositionToDoor(scene, x, y, tileSize){
        let playerX = Math.floor(this.scene.player.x / tileSize); // Posizione X del giocatore
        let playerY = Math.floor(this.scene.player.y / tileSize); // Posizione Y del giocatore

        let doorPositionX = x; // Posizione X della porta
        let doorPositionY = y; // Posizione Y della porta
        if(playerX === doorPositionX && playerY === doorPositionY){
            return true; // Se il giocatore è sulla porta, ritorna true
        }
        return false; // Altrimenti, ritorna false
    }

    // Gestisce il danno subito dal giocatore
    gotHitted(scene, damage){
        this.hp -= damage; // Sottrae i danni dai punti vita

        // if(this.hp <= 0){
        //     // Qui puoi aggiungere logica per il Game Over
        //     // scene.scene.start("GameOver");
        // }
    }

    // Mostra la barra della salute
    showBarHp(){
        this.hpBar.clear(); // Pulisce la barra
        let x = 10; // Posizione X della barra
        let y = 10; // Posizione Y della barra

        // Calcola la percentuale della salute
        let progress = Phaser.Math.Clamp(this.hp / 100, 0, 1);

        // Imposta il colore e lo stile della barra
        this.hpBar.fillStyle(0x00ff00, 1); // Verde
        this.hpBar.lineStyle(2, 0x000000); // Linea nera

        // Disegna la barra di salute
        this.hpBar.fillRect(x, y, barPlayerHpWidth * progress, barPlayerHpHeight);
        this.hpBar.strokeRect(x, y, barPlayerHpWidth, barPlayerHpHeight);

        this.hpBar.setScrollFactor(0); // La barra non si sposterà con la telecamera
    }
    
    // Gestisce l'interazione con la porta e la barra di progresso
    crossing(target, delta) {
        this.holdTime += delta / 1000;
    
        let progress = Phaser.Math.Clamp(this.holdTime / this.requiredHoldTime, 0, 1);
        let centerX = this.scene.camera.scrollX + (768 / 2) - (barProgressWidth / 2); 
        let centerY = this.scene.camera.scrollY;
    
        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.lineStyle(2, 0x000000);
        this.progressBar.fillRect(centerX, centerY, barProgressWidth * progress, barProgressHeight);
        this.progressBar.strokeRect(centerX, centerY, barProgressWidth, barProgressHeight);
    
        if (this.holdTime >= this.requiredHoldTime) {
            this.progressBar.clear();
            this.holdTime = 0;
            this.delta = 0;
            if (target.onComplete) target.onComplete();
        } else {
            this.delta += 16;
        }
    }
    

    // Gestisce il tiro del giocatore
    shoot(scene, player){
        let proiettile = new Beam(this.scene, this.scene.player, this.scene.avversario, "beamUd", direction);
        this.projectiles.add(proiettile); // Aggiunge il proiettile al gruppo
    }

    // Metodo di aggiornamento chiamato ad ogni frame
    update(){
        // Aggiorna tutti i proiettili
        this.projectiles.getChildren().forEach(proiettile => {
            proiettile.update();
        });

        // Se il giocatore preme il tasto spazio, spara
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shoot(this, this.scene.player);
        }
        // Se il tasto "E" è premuto, interagisce con la porta
        this.projectiles.getChildren().forEach(p => p.update());
    
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.shoot(this, this.scene.player);
        }
    
        if (this.keyE.isDown) {
            const interactable = this.getNearbyInteractable();
    
            if (interactable) {
                this.crossing(interactable, this.delta);
                return;
            }
        }
        this.holdTime = 0;
        this.delta = 0;
        this.progressBar.clear();     
    }
}