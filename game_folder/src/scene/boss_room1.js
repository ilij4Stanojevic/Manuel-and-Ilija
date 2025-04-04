class Boss_room1 extends Phaser.Scene {
    constructor() {
        super("Boss_room1");
    }

    create() {
        // Aggiunge lo sfondo
        this.background = this.add.image(0, 0, 'bg_boss1').setOrigin(0, 0);

        // Crea il gruppo per i muri
        this.walls = this.physics.add.staticGroup();
        this.map = new Map(this, this.walls, 2);

        // Crea il player
        this.player = new Player(this, 11.5 * 64, 0, "player", this.walls);
        this.physics.world.setBounds(0, 0, widthMap, heightMap);

        // Imposta i controlli del giocatore
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        // Configura la telecamera
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, widthMap, heightMap);
        this.camera.centerOn(this.player.x, this.player.y);

        // Crea il boss utilizzando la classe Boss
        this.boss = new Boss(this, 11.5 * 64, 8.5 * 64, "boss1", Proiettile, 20);

        // Collisioni tra il player e il boss
        this.physics.add.collider(this.player, this.boss.boss, () => {
            this.player.setVelocity(0, 0);  // Blocca il movimento del player al contatto
        });
    }

    update() {
        // Muove il player
        this.player.movePlayerManager(this, this.cursorKeys);

        // Aggiorna tutti i proiettili attivi
        this.boss.projectiles.getChildren().forEach(proiettile_b => proiettile_b.update());

        // Controlla se il boss è visibile nella telecamera
        if (this.cameras.main.worldView.contains(this.boss.boss.x, this.boss.boss.y)) {
            if (!this.boss.bossAttivo) {
                this.boss.activate();  // Attiva il boss
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
    }
}
