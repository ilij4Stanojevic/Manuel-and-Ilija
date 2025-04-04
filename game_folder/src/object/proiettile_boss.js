class Proiettile_boss extends Phaser.GameObjects.Sprite {
    constructor(scene, boss, player) {
        // Posizione iniziale del proiettile (boss)
        var x = boss.x;
        var y = boss.y;
        
        super(scene, x, y, "proiettile_boss");
        scene.add.existing(this);
        this.setBlendMode(Phaser.BlendModes.NORMAL);
        
        scene.physics.world.enableBody(this);

        // Costante per la velocità del proiettile
        const VELOCITA = 500; // Modifica questo valore se necessario

        // Distanza massima percorsa (8 tile * 64 pixel)
        this.distanzaMax = 5 * 64;

        // Salva la posizione iniziale per il controllo della distanza
        this.startX = x;
        this.startY = y;

        // Calcola la direzione normalizzata verso il giocatore
        let direzione = new Phaser.Math.Vector2(player.x - x, player.y - y).normalize();

        // Imposta la velocità in base alla direzione
        this.body.setVelocity(direzione.x * VELOCITA, direzione.y * VELOCITA);
    }

    update() {
        let distanzaPercorsa = Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y);

        if (distanzaPercorsa >= this.distanzaMax) {
            this.destroy();
        }
    }
}
