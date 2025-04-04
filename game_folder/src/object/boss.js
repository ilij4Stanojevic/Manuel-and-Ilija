class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, proiettile_anim, Proiettile, danni) {
        super(scene, x, y, texture);

        // Crea il boss e lo aggiunge alla scena
        this.scene = scene;
        this.boss = this.scene.physics.add.sprite(x, y, texture)
            .setDisplaySize(64, 64)
            .setMass(1000)
            .setImmovable(true); // Il boss non si sposterà a causa di altre forze

        this.boss.setBounce(false);  // Non rimbalza

        // Variabili di stato
        this.bossAttivo = false;  // Il boss non è attivo inizialmente
        this.canShoot = true;  // Controlla se può sparare

        // Gruppo per i proiettili
        this.projectiles = this.scene.add.group();
        this.projectiles.danni = this.danni;
        
        // Timer per sparare
        this.shootTimer = this.scene.time.addEvent({
            delay: 400, // Ogni 0.4 secondi
            callback: this.shoot,
            callbackScope: this,
            loop: true,
            paused: true  // Il timer parte in pausa
        });

        // Creiamo il gestore di collisione
        this.projectileCollisionManager = new ProjectileCollisionManager(this.scene, this.scene.player);
        this.projectileCollisionManager.addProjectileCollision(this.projectiles, danni);

        this.Hp = 100;
        this.danni = danni;
    }
    //funzione movimeto boss
    moveToPlayer(player) {
        let speed = 300;  // Velocità di movimento del boss

        let distanzaX = player.x - this.boss.x;
        let distanzaY = player.y - this.boss.y;

        const distanzaMassimaX = 5 * 64;
        const distanzaMassimaY = 2 * 64;

        // Movimento orizzontale
        if (Math.abs(distanzaX) > distanzaMassimaX) {
            this.boss.setVelocityX(distanzaX > 0 ? speed : -speed);
        } else {
            this.boss.setVelocityX(0);
        }

        // Movimento verticale
        if (Math.abs(distanzaY) > distanzaMassimaY) {
            this.boss.setVelocityY(distanzaY > 0 ? speed : -speed);
        } else {
            this.boss.setVelocityY(0);
        }

        // Limita il movimento del boss ai bordi della mappa
        this.boss.x = Phaser.Math.Clamp(this.boss.x, 0, widthMap);
        this.boss.y = Phaser.Math.Clamp(this.boss.y, 0, heightMap);
    }

    // Funzione per sparare i proiettili
    shoot() {
        if (this.bossAttivo) {  // Spara solo se il boss è attivo
            let proiettile = new Proiettile(this.scene, this.boss, this.scene.player, "proiettile_b1");
            this.projectiles.add(proiettile);
        }
    }

    // Funzione per attivare il boss
    activate() {
        this.bossAttivo = true;
        this.shootTimer.paused = false;
    }

    // Funzione per disattivare il boss
    deactivate() {
        this.bossAttivo = false;
        this.shootTimer.paused = true;
    }

    // Funzione per aggiornare il boss
    update(player) {
        if (this.bossAttivo) {
            this.moveToPlayer(player);  // Muove il boss verso il giocatore
        }
    }
}
