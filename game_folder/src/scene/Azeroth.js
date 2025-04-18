class Azeroth extends Phaser.Scene {
    constructor() {
        super("Azeroth");
    }

    create(){
        let bg = this.add.image(0,0,"background_azeroth").setOrigin(0,0); // Punto in alto a sinistra
        this.playerCanMove = true
        let doors = [
            {
                tileX: 6.5, tileY: 10, onComplete: () => {
                    // Salva la salute del giocatore nel registro quando entra nella porta
                    this.registry.set("playerHP", this.player.hp);
                    this.scene.start("SpaceShip");
                }
            },
            {
                tileX: 6.5, tileY: 9, onComplete: () => {
                    // Salva la salute del giocatore nel registro quando entra nella porta
                    this.registry.set("playerHP", this.player.hp);
                    this.scene.start("SpaceShip");
                }
            },
            {
                tileX: 7.5, tileY: 10, onComplete: () => {
                    // Salva la salute del giocatore nel registro quando entra nella porta
                    this.registry.set("playerHP", this.player.hp);
                    this.scene.start("SpaceShip");
                }
            },
            {
                tileX: 7.5, tileY: 9, onComplete: () => {
                    // Salva la salute del giocatore nel registro quando entra nella porta
                    this.registry.set("playerHP", this.player.hp);
                    this.scene.start("SpaceShip");
                }
            },
        ];
        // Crea gruppi statici per i muri e i minerali, usati come collisioni statiche
        this.walls = this.physics.add.staticGroup();  // Gruppo per i muri
        this.minerals = this.physics.add.staticGroup();  // Gruppo per i minerali

        let spaceship = this.add.image(1534/4, 768-128-60,"spaceship").setOrigin(0,0); // Punto in alto a sinistra
        spaceship.setDisplaySize(128, 128);
        this.walls.add(spaceship);
        spaceship.body.setSize(80, 100);
        spaceship.setDepth(1);

        // Variabile per tenere traccia del numero della mappa (in questo caso 1)
        var numberMap = 4;

        // Crea la mappa tramite la classe 'Map' passando i muri e minerali
        this.map = new Map(this, this.walls, numberMap, this.minerals);

        // Ottiene i punti vita del giocatore dal registro (o imposta a 100 se non esistono)
        let playerHP = this.registry.get("playerHP") || 100;

        // Crea il giocatore e lo posiziona sulla mappa, passando parametri come posizione, muri, minerali, e porte
        this.player = new Player(this, 1534/4+30+20, 768-128-60+30+30, "player", this.walls, this.minerals, undefined, playerHP, doors, numberMap);
        this.tweens.add({
            targets: this.player,
            x: 768-128-60+30-100,
            duration: 1000,
            ease: 'Linear',
            onUpdate: () => {
                this.canUpdate = false;
                this.player.anims.play("player_animRight", true);
            },
            onComplete: () => {
                this.playerCanMove = true;
                this.canUpdate = true;
            }
        });
        
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
        this.projectileCollisionManager.addProjectileCollisionProjectiles(this.player.projectiles, this.minerals);
        this.physics.world.createDebugGraphic();
        }

    update(time, delta) {
        // Aggiorna la logica del giocatore (movimento, interazioni, ecc.)
        if(this.canUpdate){
            this.player.update(time, delta, this);
        }
    }
}
