let direction; // Usato per determinare la direzione quando il giocatore spara
// "u" = up (su)
// "d" = down (giù)
// "l" = left (sinistra)
// "r" = right (destra)

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, walls, hpStart){  
        super(scene, x, y, "player");

        // Aggiungi il giocatore alla scena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Impostazioni fisiche
        this.setCollideWorldBounds(true); // Il giocatore non può uscire dai confini
        this.setDisplaySize(50, 50); // Imposta la dimensione del giocatore

        // Aggiungi il collider per le pareti, se sono presenti
        if(walls){
            scene.physics.add.collider(this, walls);
        }
        
        // Proprietà del giocatore
        this.hp = hpStart; // Punti vita iniziali
        this.damage = 10; // Danno inflitto dal giocatore

        // Riferimento al giocatore nella scena
        scene.player = this;
        this.scene.player.body.setSize(26, 40); // Imposta la dimensione del corpo per il collision detection

        // Inizializza i tasti
        this.spacebar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Tasto spazio per sparare

        // Gruppo di proiettili
        this.projectiles = this.scene.add.group();
        this.projectiles.danni = this.danni; // Danno per i proiettili

        // Variabili per la barra di progresso
        this.holdTime = 0;  // Tempo che il giocatore tiene premuto il tasto "E"
        this.requiredHoldTime = 50;  // Tempo necessario per riempire la barra (in secondi)
        this.delta = 0; // Delta time per l'aggiornamento della barra di progresso

        // Barra di progresso (per interazione con la porta)
        this.progressBar = scene.add.graphics();

        // Definizione dei tasti per il movimento
        this.cursorKeys = scene.input.keyboard.createCursorKeys();
        this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Tasto di interazione "E"
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // Tasto su "W"
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // Tasto sinistra "A"
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); // Tasto giù "S"
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // Tasto destra "D"
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
    showBarHp(scene, hpBar){
        hpBar.clear(); // Pulisce la barra
        let x = 0; // Posizione X della barra
        let y = 0; // Posizione Y della barra

        // Calcola la percentuale della salute
        let progress = Phaser.Math.Clamp(this.hp / 100, 0, 1);

        // Imposta il colore e lo stile della barra
        hpBar.fillStyle(0x00ff00, 1); // Verde
        hpBar.lineStyle(2, 0x000000); // Linea nera

        // Disegna la barra di salute
        hpBar.fillRect(x, y, barHpWidth * progress, barHpHeight);
        hpBar.strokeRect(x, y, barHpWidth, barHpHeight);

        hpBar.setScrollFactor(0); // La barra non si sposterà con la telecamera
    }
    
    // Gestisce l'interazione con la porta e la barra di progresso
    crossing(scene, holdTime, requiredHoldTime, delta, progressBar, camera){
        holdTime += delta / 1000; // Incrementa il tempo in secondi

        // Calcola la percentuale di progresso
        let progress = Phaser.Math.Clamp(holdTime / requiredHoldTime, 0, 1);

        // Disegna la barra di progresso
        scene.progressBar.fillStyle(0x00ff00, 1); // Colore verde
        scene.progressBar.lineStyle(2, 0x000000); // Linea nera

        // Calcola la posizione della barra rispetto alla telecamera
        let centerX = this.scene.camera.scrollX + (768 / 2) - (barProgressWidth / 2); 
        let centerY = this.scene.camera.scrollY;

        // Disegna il riempimento della barra
        scene.progressBar.fillRect(centerX, centerY, barProgressWidth * progress, barProgressHeight);
        scene.progressBar.strokeRect(centerX, centerY, barProgressWidth, barProgressHeight);

        return holdTime; // Ritorna il tempo di attesa aggiornato
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
        if (this.keyE.isDown) {
            if(this.scene.player.checkPositionToDoor(this, 13, 0, tileSize)){ // Verifica la posizione sulla porta  
                // Aggiunge tempo alla barra di progresso
                this.holdTime = this.scene.player.crossing(this, this.holdTime, this.requiredHoldTime, this.delta, this.progressBar, this.camera);

                // Se il tempo di attesa è sufficiente, avvia la transizione
                if(this.holdTime >= this.requiredHoldTime){
                    this.progressBar.clear(); // Pulisce la barra

                    this.scene.registry.set("playerHP", this.scene.player.hp); // Salva i punti vita

                    // Avvia la scena successiva
                    this.scene.scene.start("Boss_room1");
                }

                // Aggiungi delta per aggiornare la barra
                this.delta += 16;
            }
        } else {
            // Se il tasto "E" non è premuto, resetta la barra
            this.holdTime = 0;
            this.delta = 0;
            this.progressBar.clear();
        }
    }
}