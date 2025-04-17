class Moon extends Phaser.Scene {
    constructor() {
        super("Moon");  // Nome della scena (Moon)
    }

    create(){
        let bg = this.add.image(0,0,"background").setOrigin(0,0); // Punto in alto a sinistra
        this.playerCanMove = true;
        let doors = [
            {
                tileX: 13, tileY: 0, onComplete: () => {
                    // Salva la salute del giocatore nel registro quando entra nella porta
                    this.registry.set("playerHP", this.player.hp);
                    this.registry.set("playerDamage", this.player.damage);
                    // Passa alla scena "Boss_room1" quando il giocatore interagisce con la porta
                    this.scene.start("Boss_room1");
                }
            },
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
        this.walls.children.iterate(wall => {
            wall.body.immovable = true;
            wall.body.allowGravity = false;
        });
        this.minerals = this.physics.add.staticGroup();  // Gruppo per i minerali
        this.monsters = this.physics.add.group({
            immovable: false,
            allowGravity: false
        });
        
        let spaceship = this.add.image(1534/4, 768-128-60,"spaceship").setOrigin(0,0); // Punto in alto a sinistra
        spaceship.setDisplaySize(128, 128);
        this.walls.add(spaceship);
        spaceship.body.setSize(80, 100);
        spaceship.setDepth(1);
        // Variabile per tenere traccia del numero della mappa (in questo caso 1)
        var numberMap = 1;

        // Crea la mappa tramite la classe 'Map' passando i muri e minerali
        this.map = new Map(this, this.walls, numberMap);
        
        // Ottiene i punti vita del giocatore dal registro (o imposta a 100 se non esistono)
        let playerHP = this.registry.get("playerHP") || 100;

        // Crea il giocatore e lo posiziona sulla mappa, passando parametri come posizione, muri, minerali, e porte
        this.player = new Player(this, 1534/4+30+20, 768-128-60+30+30, "player", this.walls, this.minerals, this.monsters, playerHP, doors, numberMap, 10);
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
        this.projectileCollisionManager.addProjectileCollisionMonsters(this.player.projectiles, this.monsters);
        
        this.active = false;

        this.monsterSx = new Monster(this, 12.7*64, 64+20, 48, 1, 1, 10, undefined);
        this.monsters.add(this.monsterSx);

        this.monsterCen = new Monster(this, 13.5*64, 64+20, 48, 1, 1, 10, undefined);
        this.monsters.add(this.monsterCen);
        
        this.monsterDx = new Monster(this, 14.3*64, 64+20, 48, 1, 1, 10, undefined);
        this.monsters.add(this.monsterDx);
        
        this.physics.add.collider(this.monsters, this.walls);
        this.physics.add.collider(this.monsters, this.monsters);
    }

    update(time, delta) {
        // Aggiorna la logica this.del giocatore (movimento, interazioni, ecc.)
        if(this.canUpdate){
            this.player.update(time, delta, this);
        }

        this.monsterSx.update(this.active);
        var distanzaDaPlayer = Phaser.Math.Distance.Between(this.monsterSx.x, this.monsterSx.y, this.player.x, this.player.y);
        this.active = this.monsterSx.activate(distanzaDaPlayer);

        this.monsterCen.update(this.active);
        var distanzaDaPlayer = Phaser.Math.Distance.Between(this.monsterCen.x, this.monsterCen.y, this.player.x, this.player.y);
        this.active = this.monsterCen.activate(distanzaDaPlayer);

        this.monsterDx.update(this.active);
        var distanzaDaPlayer = Phaser.Math.Distance.Between(this.monsterDx.x, this.monsterDx.y, this.player.x, this.player.y);
        this.active = this.monsterDx.activate(distanzaDaPlayer);
        
    }
}
