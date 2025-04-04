class BootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }

    create(){
        this.add.image(0,0,"background").setOrigin(0,0); // Punto in alto a sinistra

        var numberMap = 1; // Numero di mappa in cui si trova il giocatore

        this.walls = this.physics.add.staticGroup(); // Aggiunge l'oggetto walls per i bordi

        this.map = new Map(this, this.walls, numberMap); // Chiama la classe Map per creare la mappa
        
        this.player = new Player(this, 100, 100, "player", this.walls, 100); // Chiama la classe Player per crealo

        this.physics.world.setBounds(0, 0, widthMap, heightMap); // Mette i bordi esterni (es. quando il giocatore attraversava la porta, usciva dalla mappa)

        this.cursorKeys = this.input.keyboard.createCursorKeys(); // Prende in input i tasti cliccati dall'utente

        this.camera = this.cameras.main; // Crea la camera che prende il giocatore
        this.camera.setBounds(0, 0, widthMap, heightMap); // Mette i "bordi massimi" della camera, oltre a quelli non registra
        this.camera.startFollow(this.player)

        this.progressBar = this.add.graphics();
        this.hpBar = this.add.graphics();

        this.holdTime = 0;  // Track how long the player holds the "E" key
        this.requiredHoldTime = 50;  // Time required to fill the bar (in seconds)
        this.delta = 0;

        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Prendo in una variabile il tasto E
        this.keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    }

    update(){
        this.player.movePlayerManager(this, this.cursorKeys); // Funzione che fa muovere il giocatore

        this.player.showBarHp(this, this.camera, this.hpBar);

        if (this.keyE.isDown) { // Controllo quando viene cliccato una volta sola
            if(this.player.checkPositionToDoor(this, 13, 0, tileSize)){ // Funzione che controlla la posizione del giocatore con la posizione della porta  
                this.holdTime = this.player.crossing(this, this.holdTime, this.requiredHoldTime, this.delta,this.progressBar, this.camera);

                if(this.holdTime >= this.requiredHoldTime){
                    this.progressBar.clear();

                    this.registry.set("playerHP", this.player.hp);

                    // console.log(this.player.hp);

                    this.scene.start("Boss_room1");
                }

                this.delta += 16;
            }
        }else{
            this.holdTime = 0;
            this.delta = 0;
            this.progressBar.clear();
        }

        if(Phaser.Input.Keyboard.JustDown(this.keyB)){
            this.player.gotHitted(this, 10); // Da inserire i danni del boss
        }
        
    }
}

