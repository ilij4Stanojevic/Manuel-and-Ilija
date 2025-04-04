class Beam extends Phaser.GameObjects.Sprite{
    constructor(scene){
        var startX = scene.player.x;
        var startY = scene.player.y;
        super(scene, startX, startY, "beam");

        scene.add.existing(this);
        
        scene.physics.world.enableBody(this);

        scene.projectiles.add(this);

        this.maxDistance = 4 * 64;
        let speed = 250;
        let flipped = true;

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
        
    }

    destroyBeam(){
        let distanzaPercorsa = Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y);

        if (distanzaPercorsa >= this.maxDistance) {
            this.destroy(); // Destroy projectile after 320px
        }
    }
}