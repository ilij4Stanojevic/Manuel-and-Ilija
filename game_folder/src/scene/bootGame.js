class BootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }

    create(){
        this.add.image(0,0,"background").setOrigin(0,0); // Punto in alto a sinistra
        let doors = [
            { tileX: 13, tileY: 0, onComplete: () => {
                this.registry.set("playerHP", this.player.hp);
                this.scene.start("Boss_room1");
            }} //,
            // { tileX: 5, tileY: 10, onComplete: () => {
            //     this.registry.set("playerHP", this.player.hp);
            //     this.scene.start("SecretRoom");
            // }}
        ];

        var numberMap = 1; // Numero di mappa in cui si trova il giocatore

        this.walls = this.physics.add.staticGroup(); // Aggiunge l'oggetto walls per i bordi
        this.minerals = this.physics.add.staticGroup(); //aggiunge l'ogetto minerals per i minerali

        this.map = new Map(this, this.walls, numberMap, this.minerals); // Chiama la classe Map per creare la mappa
        
        this.player = new Player(this, 13.5 * 64, 100, "player", this.walls, this.minerals, 100, doors); // Chiama la classe Player per crearlo

        this.physics.world.setBounds(0, 0, widthMap, heightMap); // Mette i bordi esterni (es. quando il giocatore attraversava la porta, usciva dalla mappa)

        // this.cursorKeys = this.input.keyboard.createCursorKeys(); // Prende in input i tasti cliccati dall'utente

        this.camera = this.cameras.main; // Crea la camera che prende il giocatore
        this.camera.setBounds(0, 0, widthMap, heightMap); // Mette i "bordi massimi" della camera, oltre a quelli non registra
        this.camera.startFollow(this.player)

        this.hpBar = this.add.graphics();

        this.projectiles = this.physics.add.group();
        this.physics.world.createDebugGraphic();
    }

    update(){
        this.player.movePlayerManager(this, this.cursorKeys); // Funzione che fa muovere il giocatore
        this.player.update(this);
        this.player.showBarHp(this, this.hpBar);
        this.player.hp = 70;    
    }
}

