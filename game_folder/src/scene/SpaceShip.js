class SpaceShip extends Phaser.Scene {
    constructor() {
        super("SpaceShip");
    }

    init(data) {
        this.previousScene = data.fromScene
        if(this.previousScene === "Tutorial"){
            this.playerY = 768 - (5*64) + 32;
            this.playerX = 16;
        } else{
            this.playerY = 0;
            this.playerX = 12 * 64 + 32;
        }
    }

    create(){
        let bg = this.add.image(0,0,"background_spaceship").setOrigin(0,0); // Punto in alto a sinistra
        bg.setDisplaySize(768*2, 768);
        this.playerCanMove = false;
        let doors = [
            {
                tileX: 21, tileY: 4, onComplete: () => {
                    // Salva la salute del giocatore nel registro quando entra nella porta
                    this.registry.set("playerHP", this.player.hp);
                    // Passa alla scena "Boss_room1" quando il giocatore interagisce con la porta
                    this.scene.start("PlanetMenu");
                }
            },
            {
                tileX: 21, tileY: 5, onComplete: () => {
                    // Salva la salute del giocatore nel registro quando entra nella porta
                    this.registry.set("playerHP", this.player.hp);
                    // Passa alla scena "Boss_room1" quando il giocatore interagisce con la porta
                    this.scene.start("PlanetMenu");
                }
            },
            {
                tileX: 21, tileY: 6, onComplete: () => {
                    // Salva la salute del giocatore nel registro quando entra nella porta
                    this.registry.set("playerHP", this.player.hp);
                    // Passa alla scena "Boss_room1" quando il giocatore interagisce con la porta
                    this.scene.start("PlanetMenu");
                }
            },
            {
                tileX: 21, tileY: 7, onComplete: () => {
                    // Salva la salute del giocatore nel registro quando entra nella porta
                    this.registry.set("playerHP", this.player.hp);
                    // Passa alla scena "Boss_room1" quando il giocatore interagisce con la porta
                    this.scene.start("PlanetMenu");
                }
            },
            {
                tileX: 17, tileY: 3, onComplete: () => {
                    Inventory.showLocker(this);
                }
            },
            {
                tileX: 18, tileY: 3, onComplete: () => {
                    Inventory.showLocker(this);
                }
            },
            {
                tileX: 19, tileY: 3, onComplete: () => {
                    Inventory.showLocker(this);
                }
            }
        ];
        // Crea gruppi statici per i muri e i minerali, usati come collisioni statiche
        this.walls = this.physics.add.staticGroup();  // Gruppo per i muri

        // Variabile per tenere traccia del numero della mappa (in questo caso 1)
        var numberMap = 5;

        // Crea la mappa tramite la classe 'Map' passando i muri e minerali
        this.map = new Map(this, this.walls, numberMap, this.minerals);

        // Ottiene i punti vita del giocatore dal registro (o imposta a 100 se non esistono)
        let playerHP = this.registry.get("playerHP") || 100;
        // Crea il giocatore e lo posiziona sulla mappa, passando parametri come posizione, muri, minerali, e porte
        this.player = new Player(this, this.playerX, this.playerY, "player", this.walls, undefined, undefined, playerHP, doors, numberMap);
        this.player.setDisplaySize(64, 64);
        this.player.setDepth(2);
        if(this.previousScene === "Tutorial"){
            let  openDoor_tutorial = this.add.image(0, 768 - (6*64), "open_bigDoor_tutorial").setOrigin(0,0); // Punto in alto a sinistra
            this.tweens.add({
                targets: this.player,
                x: 96,
                duration: 1000,
                ease: 'Linear',
                onUpdate: () => {
                    this.canUpdate = false;
                    this.player.anims.play("player_animRight", true);
                },
                onComplete: () => {
                    this.canUpdate = true;
                    this.playerCanMove = true;
                    this.player.anims.play("player_animStoppedRight", true)
                    openDoor_tutorial.destroy();
                    this.player.setDepth(0);
                }
            });
        } else {
            let open_bigDoor_spaceShip = this.add.image(12*64, 0, "open_door_spaceShip").setOrigin(0, 0);
            open_bigDoor_spaceShip.setDisplaySize(128, 128);
            this.tweens.add({
                targets: this.player,
                y: 2 * 64 + 32,
                duration: 2000,
                ease: 'Linear',
                onUpdate: () => {
                    this.canUpdate = false;
                    this.playerCanMove = true;
                    this.player.anims.play("playerDOWN", true);
                },
                onComplete: () => {
                    this.canUpdate = true;
                    this.playerCanMove = true;
                    this.player.anims.play("player_animStoppedDown", true)
                    open_bigDoor_spaceShip.destroy();
                    this.player.setDepth(0);
                }
            });
        }
        // Imposta i confini della fisica del mondo di gioco (per evitare che il giocatore esca dai limiti della mappa)
        this.physics.world.setBounds(0, 0, widthMap, heightMap);

        // Crea la telecamera principale che seguirà il giocatore
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, widthMap, heightMap);  // Imposta i bordi massimi della telecamera
        this.camera.startFollow(this.player);  // Inizia a seguire il giocatore con la telecamera

        // Crea un gruppo di proiettili che il giocatore può sparare
        this.projectiles = this.physics.add.group();

        this.projectileCollisionManager = new ProjectileCollisionManager(this, this.walls);
        this.projectileCollisionManager.addProjectileCollisionProjectiles(this.player.projectiles, this.walls);
        }

    update(time, delta) {
        // Aggiorna la logica del giocatore (movimento, interazioni, ecc.)
        if(this.canUpdate){
            this.player.update(time, delta, this);
        }
    }
}
