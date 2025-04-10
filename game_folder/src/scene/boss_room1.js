class Boss_room1 extends Phaser.Scene {
    constructor() {
        super("Boss_room1");
    }

    create() {
        this.playerCanMove = true
        this.canUpdate = true;
        // Aggiunge lo sfondo
        this.background = this.add.image(0, 0, 'bg_boss1').setOrigin(0, 0);

        var numberMap = 2;

        // Crea il gruppo per i muri
        this.walls = this.physics.add.staticGroup();
        this.map = new Map(this, this.walls, numberMap);

        let playerHP = this.registry.get("playerHP");

        // Crea il player
        this.player = new Player(this, 11.5 * 64, 0, "player", this.walls, undefined, playerHP, undefined, numberMap);
        this.physics.world.setBounds(0, 0, widthMap, heightMap);

        this.projectileCollisionManager = new ProjectileCollisionManager(this, this.walls);

        // Configura la telecamera
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, widthMap, heightMap);
        this.camera.centerOn(this.player.x, this.player.y);

        // Crea il boss utilizzando la classe Boss
        this.boss = new Boss(this, 11.5 * 64, 8.5 * 64, "boss1_anim", "proiettile_b1", Proiettile, 20);

        // Collisioni tra il player e il boss
        this.physics.add.collider(this.player, this.boss.boss, () => {
            this.player.setVelocity(0, 0);  // Blocca il movimento del player al contatto
        });

        this.projectileCollisionManager.addProjectileCollisionBoss(this.player.projectiles, this.boss.boss);
        this.projectileCollisionManager.addProjectileCollisionPlayer(this.boss.projectiles, this.player, this.boss.danni);
        this.projectileCollisionManager.addProjectileCollisionProjectiles(this.boss.projectiles, this.walls);
        this.projectileCollisionManager.addProjectileCollisionProjectiles(this.player.projectiles, this.walls);
        
        // this.physics.world.createDebugGraphic();

        this.heartX = 10;
    }

    update(time, delta) {
        // Aggiorna tutti i proiettili attivi
        this.boss.projectiles.getChildren().forEach(proiettile_b => proiettile_b.update());

        // Controlla se il boss è visibile nella telecamera
        if (this.cameras.main.worldView.contains(this.boss.boss.x, this.boss.boss.y)) {
            if(this.boss.isDead == false){
                if(!this.boss.bossAttivo){
                    this.boss.activate();  // Attiva il boss
                } 
                this.boss.showBarHp();
            }                     
        } else {
            if (this.boss.bossAttivo) {
                this.boss.deactivate();  // Disattiva il boss
            }
        }

        // Se il boss è attivo, inizia a muoversi verso il player
        if (this.boss.bossAttivo) {
            this.boss.update(this.player);  // Muove il boss
        }

        this.player.showBarHp(time, delta, this);
        
        if(this.canUpdate){
            this.player.update(time, delta, this);
        }
        // barra della stamina
        this.player.showBarStamina(this);
    }
}