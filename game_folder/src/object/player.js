class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, walls, minerals, hpStart, interactionTargets = [], numberMap) {
        // Chiamata al costruttore della classe padre (Phaser.Physics.Arcade.Sprite)
        super(scene, x, y, "player");

        // Inizializza lo stato di interazione del giocatore
        this.interactionActive = true;

        this.scene.playerCanMove;

        // Aggiungi il player alla scena e alla fisica
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Imposta i limiti di mondo per evitare che il giocatore esca dallo schermo
        this.setCollideWorldBounds(true);
        this.setDisplaySize(50, 50); // Imposta la dimensione del giocatore

        // Aggiungi il giocatore come collider con muri e minerali (se passati)
        if (walls) scene.physics.add.collider(this, walls);
        if (minerals) scene.physics.add.collider(this, minerals);

        this.numberMap = numberMap;

        // Punti vita, danno e stamina iniziali
        this.hp = hpStart;
        this.damage = 10;
        this.endurance = 100; // durata stamina

        // Direzione iniziale del giocatore (verso il basso)
        this.direction = "d"; 
        scene.player = this;  // Assegna il giocatore alla scena

        // Imposta le dimensioni del corpo del giocatore per la fisica
        this.scene.player.body.setSize(26, 40);

        // Aggiungi tasti per il movimento e interazione
        this.projectiles = scene.add.group();
        this.projectiles.danni = this.danni;
    
        this.holdTime = 0;
        this.requiredHoldTime = 50;
        this.delta = 0;
        this.progressBar = scene.add.graphics();
        this.hpBar = scene.add.graphics();

        scene.overlay = scene.add.graphics();
        scene.overlay.fillStyle(0x000000, 0.6); // Black with 60% opacity
        scene.overlay.fillRect(0, 0, 768, 384);
        scene.overlay.setDepth(100); // Make sure it's above everything else
        scene.overlay.setScrollFactor(0);
        scene.overlay.setVisible(false);

        scene.inventoryContainer = scene.add.container(768/2, 40);
    
        this.heartLast = 3;
        this.lifeChecked = false;
        
        // Definizione dei tasti
        this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // tasto interazione
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spacebar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // tasto per sparare
        this.shift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        

        // Gruppi e grafica per i proiettili e le barre
        this.projectiles = scene.add.group();
        this.progressBar = scene.add.graphics();
        this.hpBar = scene.add.graphics();
        this.staminaBar = scene.add.graphics();
        this.hpBar.setDepth(10);

        // Variabili di interazione
        this.holdTime = 0;  // Tempo di interazione
        this.requiredHoldTime = 50;  // Tempo richiesto per completare l'interazione
        this.delta = 0;  // Variabile per il delta di aggiornamento
        this.interactionTargets = interactionTargets;  // Oggetti con cui il giocatore può interagire

        this.moving = false;  // Flag per determinare se il giocatore si sta muovendo
    }
    
    // Funzione per trovare oggetti interagibili vicini al giocatore
    getNearbyInteractable(scene) {
        const tileSize = 64;  // Dimensione di un tile nel gioco
        const maxDistance = 0.7;  // Distanza massima per considerare un oggetto interagibile
        const px = this.x / tileSize;  // Posizione del giocatore in termini di tile
        const py = this.y / tileSize;
        var tipo, collisionMap, mx, my;
        // Controlla gli oggetti interagibili nella lista 'interactionTargets'
        for (let target of this.interactionTargets) {
            const dist = Phaser.Math.Distance.Between(px, py, target.tileX, target.tileY);
            if (dist <= maxDistance) return target;  // Ritorna l'oggetto se entro la distanza
        }

        // Controlla se ci sono minerali vicini
        if (this.scene.minerals?.children) {
            var nearbyMineral = null;
            this.scene.minerals.children.iterate((mineral) => {
                if (!mineral) return;
                mx = mineral.x / tileSize;
                my = mineral.y / tileSize;
                const dist = Phaser.Math.Distance.Between(px, py, mx, my);
                // console.log("The value of dist is: " + dist);
                
                if (dist <= maxDistance){
                    // console.log("The value of dist is " + dist + "; The value of maxDistance is : " + maxDistance);
                    nearbyMineral = mineral;
                }
            });

            // Ritorna minerale se trovato
            if (nearbyMineral) {
                mx = nearbyMineral.x / tileSize;
                my = nearbyMineral.y / tileSize;
                switch(this.numberMap){
                    case 1:
                        collisionMap = collisionMap1;
                        break;
                    case 2:
                        collisionMap = collisionMap2;
                        break;
                }
                tipo = collisionMap[Math.trunc(my)][Math.trunc(mx)];

                let imageMineral;
                let nameMineral;
                switch(tipo){
                    case 2:
                        imageMineral = "mineral1";
                        nameMineral = "PowerRel";
                        break;
                    case 3:
                        imageMineral = "mineral2";
                        nameMineral = "HealtRel";
                        break;
                }

                return {
                    type: tipo,
                    object: nearbyMineral,
                    tileX: Math.floor(mx),
                    tileY: Math.floor(my),
                    onComplete: (scene) => {
                        Inventory.addItem(scene, tipo, imageMineral, nameMineral);
                        nearbyMineral.destroy()
                    }// gestione raccolta minerali
                }
            }
        }

        return null;  // Nessun oggetto interagibile trovato
    }

    // Gestisce il movimento del giocatore in base ai tasti premuti
    movePlayerManager(delta) {
        var baseSpeed = gameSettings.speedPlayer;
        var speed = baseSpeed;
        var staminaBoost = 2;
    
        this.staminaConsumeRate = 33;
        this.staminaChargeRate = 10;
    
        this.moving = false;
    
        // --- Gestione MOVIMENTO ---
        // sinistra e destra
        if (this.keyA.isDown) {
            this.setVelocityX(-1);
            this.setFlipX(true);
            this.direction = "l";
            this.anims.play("player_animRight", true);
            this.moving = true;
        } else if (this.keyD.isDown) {
            this.setVelocityX(1);
            this.setFlipX(false);
            this.direction = "r";
            this.anims.play("player_animRight", true);
            this.moving = true;
        } else {
            this.setVelocityX(0);
        }
        // alto e basso 
        if (this.keyW.isDown) {
            this.setVelocityY(-1);
            this.direction = "u";
            this.anims.play("playerUp", true);
            this.moving = true;
        } else if (this.keyW.isDown && this.keyA.isDown) {
            this.setVelocityX(-1*(1/1.44));
            this.setVelocityY(-1*(1/1.44));
            this.direction = "u";
            this.anims.play("playerUp", true);
            this.moving = true;
        } else if (this.keyW.isDown && this.keyD.isDown) {
            this.setVelocityY(-1*(1/1.44));
            this.setVelocityY(1*(1/1.44));
            this.direction = "u";
            this.anims.play("playerUp", true);
            this.moving = true;
        } else if (this.keyS.isDown) {
            this.setVelocityY(1);
            this.direction = "d";
            this.anims.play("playerDOWN", true);
            this.moving = true;
        } else if (this.keyS.isDown && this.keyA.isDown) {
            this.setVelocityY(1*(1/1.44));
            this.setVelocityX(-1*(1/1.44));
            this.direction = "d";
            this.anims.play("playerDOWN", true);
            this.moving = true;
        } else if (this.keyS.isDown && this.keyD.isDown) {
            this.setVelocityY(1*(1/1.44));
            this.setVelocityX(1*(1/1.44));
            this.direction = "d";
            this.anims.play("playerDOWN", true);
            this.moving = true;
        } else {
            this.setVelocityY(0);
        }
    
        // --- Gestione STAMINA e velocità ---
        if (this.shift.isDown && this.endurance > 0 && this.moving) {
            speed *= staminaBoost;
            this.endurance -= this.staminaConsumeRate * (delta / 1000);
        } else {
            speed = baseSpeed;
            if (this.endurance < 100 && !this.shiftisDown) {
                this.endurance += this.staminaChargeRate * (delta / 1000);
            }
        }
        
        this.endurance = Phaser.Math.Clamp(this.endurance, 0, 100);
    
        // Applica velocità finale (dopo boost)
        this.setVelocityX(this.body.velocity.x * speed);
        this.setVelocityY(this.body.velocity.y * speed);
    
        // --- Gestione animazione di fermo ---
        if (!this.moving) {
            switch (this.direction) {
                case "l":
                    this.setFlipX(true);
                    this.anims.play("player_animStoppedRight", true);
                    break;
                case "r":
                    this.setFlipX(false);
                    this.anims.play("player_animStoppedRight", true);
                    break;
                case "u":
                    this.anims.play("player_animStoppedUp", true);
                    break;
                case "d":
                    this.anims.play("player_animStoppedDown", true);
                    break;
            }
            this.interactionActive = true;
        } else {
            this.interactionActive = false;
            this.scene.camera.startFollow(this);
        }
    }
    

    // Funzione per gestire i danni subiti dal giocatore
    gotHitted(scene, damage) {
        this.hp -= damage;  // Riduci gli HP del giocatore

        if(this.hp <= 0){
            // Qui puoi aggiungere logica per il Game Over
            
            if(this.heartLast <= 0){
                Inventory.removeAll();
                scene.scene.start("GameOver");
            }else{
                this.heartLast -= 1;
            }
            this.lifeChecked = false;
            this.hp = 100;
        }
    }

    // Mostra la barra della salute
    showBarHp(scene){
        this.hpBar.clear(); // Pulisce la barra
        let x = 10; // Posizione X della barra
        let y = 20 + 48; // Posizione Y della barra

        // Calcola la percentuale della salute
        let progress = Phaser.Math.Clamp(this.hp / 100, 0, 1);

        // Imposta il colore e lo stile della barra
        this.hpBar.fillStyle(0x00ff00, 1); // Verde
        this.hpBar.lineStyle(2, 0x000000); // Linea nera

        // Disegna la barra di salute
        this.hpBar.fillRect(x, y, barPlayerHpWidth * progress, barPlayerHpHeight);
        this.hpBar.strokeRect(x, y, barPlayerHpWidth, barPlayerHpHeight);
        this.hpBar.setScrollFactor(0);  // La barra non si muove con la telecamera
    }

    // Mostra la barra della salute
    showBarStamina(scene){
        this.staminaBar.clear(); // Pulisce la barra
        let x = 10; // Posizione X della barra
        let y = 384 - 20; // Posizione Y della barra

        // Calcola la percentuale della salute
        let progress = Phaser.Math.Clamp(this.endurance / 100, 0, 1);

        // Imposta il colore e lo stile della barra
        this.staminaBar.fillStyle(0x00b6ff, 1); // Verde
        this.staminaBar.lineStyle(2, 0x000000); // Linea nera

        // Disegna la barra di salute
        this.staminaBar.fillRect(x, y, barPlayerStaminaWidth * progress, barPlayerStaminaHeight);
        this.staminaBar.strokeRect(x, y, barPlayerStaminaWidth, barPlayerStaminaHeight);
        this.staminaBar.setScrollFactor(0);  // La barra non si muove con la telecamera
    }

    // Funzione di interazione con oggetti come porte, minerali, ecc.
    crossing(scene, target, delta) {
        if (this.interactionActive) {
            this.holdTime += delta / 1000;  // Aumenta il tempo di interazione

            let progress = Phaser.Math.Clamp(this.holdTime / this.requiredHoldTime, 0, 1);  // Calcola la percentuale di interazione
            let x = this.x - 15, y = this.y - 23;  // Posizione per la barra di progresso

            this.progressBar.clear();  // Pulisce la barra precedente
            this.progressBar.fillStyle(0xffffff, 1);  // Colore verde
            this.progressBar.lineStyle(2, 0x000000);  // Bordo nero
            this.progressBar.fillRect(x, y, barProgressWidth * progress, barProgressHeight);
            this.progressBar.strokeRect(x, y, barProgressWidth, barProgressHeight);

            // Se il tempo di interazione è sufficiente, esegui l'azione e distruggi l'oggetto
            if (this.holdTime >= this.requiredHoldTime) {
                this.progressBar.clear();
                this.holdTime = 0;
                this.delta = 0;
                if (target.onComplete) target.onComplete(scene);  // Esegui l'azione di completamento
            } else {
                this.delta += 16;
            }
        } else {
            this.holdTime = 0;
            this.delta = 0;
            this.progressBar.clear();  // Pulisce la barra se non c'è interazione
        }
    }

    // Funzione per sparare un proiettile
    shoot() {
        const beam = new Beam(this.scene, this, this.scene.avversario, "beamUd", this.direction);
        this.projectiles.add(beam);  // Aggiungi il proiettile al gruppo
    }

    initHearts(scene){
        if (this.heartImages) {
            this.heartImages.forEach(h => h.destroy());
        }
        this.heartImages = [];

        let heartsToDraw = this.heartLast;
        let heartX = 10;
        for(let i=0; i<heartsToDraw; i++){
            let hL = this.scene.add.image(heartX, 10,"heart_life").setOrigin(0,0);
            this.heartImages.push(hL);
            hL.setDisplaySize(48, 48);
            heartX += 10 + 48;
            hL.setScrollFactor(0);
            hL.setDepth(3); 
        }

        if(this.heartLast < 3){
            for(let i=0; i< 3 - heartsToDraw; i++){
                let hL = this.scene.add.image(heartX, 10,"heart_dead").setOrigin(0,0);
                hL.setDisplaySize(48, 48);
                this.heartImages.push(hL);
                heartX += 10 + 48;
                hL.setScrollFactor(0);
            }
        }
    }
    // Metodo di aggiornamento chiamato ad ogni frame
    update(time, delta, scene){
        
        if(this.scene.playerCanMove){
            this.movePlayerManager(delta);
        }
        if(this.lifeChecked == false){
            this.initHearts(scene);
            this.lifeChecked = true;
        }

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
            this.shoot();
        }

        // Se si tiene premuto il tasto E, interagisci con gli oggetti vicini
        if (this.keyE.isDown) {
            const interactable = this.getNearbyInteractable(scene);  // Trova un oggetto interagibile

            if (interactable) {
                this.crossing(scene, interactable, this.delta);  // Esegui l'interazione
                return;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
            if(!this.QisPressed){
                Inventory.showInventory(scene);
                this.QisPressed = true;
            }else{
                Inventory.removeInventory(scene);
                this.QisPressed = false;
            }
        }

        // Se non c'è interazione, resetta la barra di progresso
        this.holdTime = 0;
        this.delta = 0;
        this.progressBar.clear();
    }
}
