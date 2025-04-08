class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, walls, minerals, hpStart, interactionTargets = []) {
        // Chiamata al costruttore della classe padre (Phaser.Physics.Arcade.Sprite)
        super(scene, x, y, "player");

        // Inizializza lo stato di interazione del giocatore
        this.interactionActive = true;

        // Aggiungi il player alla scena e alla fisica
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Imposta i limiti di mondo per evitare che il giocatore esca dallo schermo
        this.setCollideWorldBounds(true);
        this.setDisplaySize(50, 50); // Imposta la dimensione del giocatore

        // Aggiungi il giocatore come collider con muri e minerali (se passati)
        if (walls) scene.physics.add.collider(this, walls);
        if (minerals) scene.physics.add.collider(this, minerals);

        // Punti vita e danno iniziali
        this.hp = hpStart;
        this.damage = 10;

        // Direzione iniziale del giocatore (verso il basso)
        this.direction = "d"; 
        scene.player = this;  // Assegna il giocatore alla scena

        // Imposta le dimensioni del corpo del giocatore per la fisica
        this.scene.player.body.setSize(26, 40);

        // Aggiungi tasti per il movimento e interazione
        this.spacebar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = scene.add.group();
        this.projectiles.danni = this.danni;
    
        this.holdTime = 0;
        this.requiredHoldTime = 50;
        this.delta = 0;
        this.progressBar = scene.add.graphics();
        this.hpBar = scene.add.graphics();

        this.heartLast = 3;
        this.lifeChecked = false;
        
        // Definizione dei tasti per il movimento
        this.cursorKeys = scene.input.keyboard.createCursorKeys();
        this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursorKeys = scene.input.keyboard.createCursorKeys();

        // Gruppi e grafica per i proiettili e le barre
        this.projectiles = scene.add.group();
        this.progressBar = scene.add.graphics();
        this.hpBar = scene.add.graphics();
        this.hpBar.setDepth(10);

        // Variabili di interazione
        this.holdTime = 0;  // Tempo di interazione
        this.requiredHoldTime = 50;  // Tempo richiesto per completare l'interazione
        this.delta = 0;  // Variabile per il delta di aggiornamento
        this.interactionTargets = interactionTargets;  // Oggetti con cui il giocatore può interagire
    }

    // Funzione per trovare oggetti interagibili vicini al giocatore
    getNearbyInteractable() {
        const tileSize = 64;  // Dimensione di un tile nel gioco
        const maxDistance = 0.7;  // Distanza massima per considerare un oggetto interagibile
        const px = this.x / tileSize;  // Posizione del giocatore in termini di tile
        const py = this.y / tileSize;

        // Controlla gli oggetti interagibili nella lista 'interactionTargets'
        for (let target of this.interactionTargets) {
            const dist = Phaser.Math.Distance.Between(px, py, target.tileX, target.tileY);
            if (dist <= maxDistance) return target;  // Ritorna l'oggetto se entro la distanza
        }

        // Controlla se ci sono minerali vicini
        if (this.scene.minerals?.children) {
            let nearbyMineral = null;
            this.scene.minerals.children.iterate((mineral) => {
                if (!mineral) return;
                const mx = mineral.x / tileSize;
                const my = mineral.y / tileSize;
                const dist = Phaser.Math.Distance.Between(px, py, mx, my);
                if (dist <= maxDistance) nearbyMineral = mineral;
            });

            // Ritorna minerale se trovato
            if (nearbyMineral) {
                return {
                    type: "mineral",
                    object: nearbyMineral,
                    tileX: Math.floor(nearbyMineral.x / tileSize),
                    tileY: Math.floor(nearbyMineral.y / tileSize),
                    onComplete: () => nearbyMineral.destroy()  // Distruggi minerale dopo l'interazione
                };
            }
        }

        return null;  // Nessun oggetto interagibile trovato
    }

    // Gestisce il movimento del giocatore in base ai tasti premuti
    movePlayerManager() {
        const speed = 200;  // Velocità di movimento del giocatore
        let moving = false;  // Flag per determinare se il giocatore si sta muovendo

        // Movimento verso sinistra
        if (this.cursorKeys.left.isDown || this.keyA.isDown) {
            this.setVelocityX(-speed);
            this.setFlipX(true);
            this.direction = "l";  // Direzione sinistra
            this.anims.play("player_animRight", true);  // Animazione sinistra
            moving = true;
        } 
        // Movimento verso destra
        else if (this.cursorKeys.right.isDown || this.keyD.isDown) {
            this.setVelocityX(speed);
            this.setFlipX(false);
            this.direction = "r";  // Direzione destra
            this.anims.play("player_animRight", true);  // Animazione destra
            moving = true;
        } else {
            this.setVelocityX(0);  // Ferma il movimento orizzontale
        }

        // Movimento verso l'alto
        if (this.cursorKeys.up.isDown || this.keyW.isDown) {
            this.setVelocityY(-speed);
            this.direction = "u";  // Direzione su
            this.anims.play("playerUp", true);  // Animazione su
            moving = true;
        } 
        // Movimento verso il basso
        else if (this.cursorKeys.down.isDown || this.keyS.isDown) {
            this.setVelocityY(speed);
            this.direction = "d";  // Direzione giù
            this.anims.play("playerDOWN", true);  // Animazione giù
            moving = true;
        } else {
            this.setVelocityY(0);  // Ferma il movimento verticale
        }

        // Se il giocatore non si muove, riproduce l'animazione di fermo
        if (!moving) {
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
            this.interactionActive = true;  // Abilita l'interazione quando il giocatore è fermo
        } else {
            this.interactionActive = false;  // Disabilita l'interazione durante il movimento
            this.scene.camera.startFollow(this);  // Segui il giocatore con la telecamera
        }
    }

    // Funzione per gestire i danni subiti dal giocatore
    gotHitted(scene, damage) {
        this.hp -= damage;  // Riduci gli HP del giocatore

        if(this.hp <= 0){
            // Qui puoi aggiungere logica per il Game Over
            // scene.scene.start("GameOver");
            console.log("The player has " + this.heartLast + " lifes left.");
            if(this.heartLast < 0){
                scene.scene.start("GameOver");
            }else{
                this.heartLast -= 1;
            }
            this.lifeChecked = false;
            this.hp = 100;
        }
    }

    // Mostra la barra della salute
    showBarHp(){
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

    // Funzione di interazione con oggetti come porte, minerali, ecc.
    crossing(target, delta) {
        if (this.interactionActive) {
            this.holdTime += delta / 1000;  // Aumenta il tempo di interazione

            let progress = Phaser.Math.Clamp(this.holdTime / this.requiredHoldTime, 0, 1);  // Calcola la percentuale di interazione
            let x = this.x, y = this.y;  // Posizione per la barra di progresso

            this.progressBar.clear();  // Pulisce la barra precedente
            this.progressBar.fillStyle(0x00ff00, 1);  // Colore verde
            this.progressBar.lineStyle(2, 0x000000);  // Bordo nero
            this.progressBar.fillRect(x, y, barProgressWidth * progress, barProgressHeight);
            this.progressBar.strokeRect(x, y, barProgressWidth, barProgressHeight);

            // Se il tempo di interazione è sufficiente, esegui l'azione e distruggi l'oggetto
            if (this.holdTime >= this.requiredHoldTime) {
                this.progressBar.clear();
                this.holdTime = 0;
                this.delta = 0;
                if (target.onComplete) target.onComplete();  // Esegui l'azione di completamento
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

        let heartX = 10;
        for(let i=0; i<this.heartLast; i++){
            let hL = scene.add.image(heartX, 10,"heart_life").setOrigin(0,0);
            this.heartImages.push(hL);
            hL.setDisplaySize(48, 48);
            heartX += 10 + 48;
            hL.setScrollFactor(0);
        }
        if(this.heartLast < 3){
            for(let i=0; i< 3-this.heartLast; i++){
                let hL = scene.add.image(heartX, 10,"heart_dead").setOrigin(0,0);
                hL.setDisplaySize(48, 48);
                this.heartImages.push(hL);
                heartX += 10 + 48;
                hL.setScrollFactor(0);
            }
        }
    }

    // Metodo di aggiornamento chiamato ad ogni frame
    update(scene){
        if(this.lifeChecked == false){
            this.initHearts(scene);
            this.lifeChecked = true;
        }

        this.movePlayerManager();

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
            const interactable = this.getNearbyInteractable();  // Trova un oggetto interagibile
            if (interactable) {
                this.crossing(interactable, this.delta);  // Esegui l'interazione
                return;
            }
        }

        // Se non c'è interazione, resetta la barra di progresso
        this.holdTime = 0;
        this.delta = 0;
        this.progressBar.clear();
        this.progressBar.clear();
    }
}
