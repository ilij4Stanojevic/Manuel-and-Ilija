class Beam extends Phaser.GameObjects.Sprite{        
    constructor(scene, danneggiatore, danneggiato, texture_proiettile, direction) {
        // Posizione iniziale del proiettile (boss)
        var x = danneggiatore.x;
        var y = danneggiatore.y;

        // velocità del proiettile
        const speed = 350; 

        super(scene, x, y,);
        scene.add.existing(this);
        // this.setBlendMode(Phaser.BlendModes.NORMAL);
        
        scene.physics.world.enableBody(this);

        // Distanza massima percorsa (5 tile * 64 pixel)
        this.distanzaMax = 3 * 64;

        // Salva la posizione iniziale per il controllo della distanza
        this.startX = x;
        this.startY = y;

        // Calcola la direzione normalizzata verso il giocatore
        switch(direction){
            case "u":
                this.setFlipY(false);
                this.body.velocity.y = -speed;
                this.play("beamUd_anim");
                break;
            case "d":
                this.setFlipY(true);
                this.body.velocity.y = speed;
                this.play("beamUd_anim");
                break;
            case "r":
                this.setFlipX(false);
                this.body.velocity.x = speed;
                this.play("beamLr_anim");
                break;
            case "l":
                this.setFlipX(true);
                this.body.velocity.x = -speed;
                this.play("beamLr_anim");
                break;
            case undefined:
                this.body.velocity.x = speed;
                this.play("beamLr_anim");
                break;
        }
        this.setDisplaySize(30, 30);
        this.body.setSize(5, 5);
    }

    update(scene) {
        let distanzaPercorsa = Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y);
        if (distanzaPercorsa >= this.distanzaMax) {
            this.destroy();
        }
    }      
}
