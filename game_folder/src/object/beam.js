class Beam extends Phaser.GameObjects.Sprite{        
    constructor(scene, danneggiatore, danneggiato, texture_proiettile, direction) {
        // Posizione iniziale del proiettile (boss)
        var x = danneggiatore.x;
        var y = danneggiatore.y;
        
        super(scene, x, y,);
        scene.add.existing(this);
        // this.setBlendMode(Phaser.BlendModes.NORMAL);
        
        scene.physics.world.enableBody(this);

        // Costante per la velocità del proiettile
        const VELOCITA = 500; // Modifica questo valore se necessario

        // Distanza massima percorsa (5 tile * 64 pixel)
        this.distanzaMax = 5 * 64;

        // Salva la posizione iniziale per il controllo della distanza
        this.startX = x;
        this.startY = y;

        // Calcola la direzione normalizzata verso il giocatore
        switch(direction){
            case "u":
                flipped = false;
                this.body.velocity.y = -speed;
                this.play("beamUd_anim");
                break;
            case "d":
                this.setFlipY(flipped);
                this.body.velocity.y = speed;
                this.play("beamUd_anim");
                break;
            case "r":
                flipped = false;
                this.body.velocity.x = speed;
                this.play("beamLr_anim");
                break;
            case "l":
                this.setFlipX(flipped);
                this.body.velocity.x = -speed;
                this.play("beamLr_anim");
                break;
            case undefined:
                this.body.velocity.x = speed;
                this.play("beamLr_anim");
                break;
        }

        // Imposta la velocità in base alla direzione
        this.body.setVelocity(direzione.x * VELOCITA, direzione.y * VELOCITA);
        this.play(texture_proiettile);
        this.setDisplaySize(100, 100);
        this.body.setSize(5, 5);
    }

    update() {
        let distanzaPercorsa = Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y);

        if (distanzaPercorsa >= this.distanzaMax) {
            this.destroy();
        }
    }
    dealDamage(danneggiato, danneggiatore){
        danneggiato.Hp -= danneggiatore.danni;

        if(danneggiato.Hp <= 0){
            
        }
    }       
}
