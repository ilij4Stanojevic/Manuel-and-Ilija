class Beam extends Phaser.GameObjects.Sprite{
    constructor(scene, player, direction){
        var x = player.x;
        var y = player.y;
        super(scene, x, y, "beam");
        scene.add.existing(this);
        
        scene.physics.world.enableBody(this);

        let speed = 250;
        let flipped = false;

        switch(direction){
            case "u":
                this.body.velocity.y = -speed;
                break;
            case "d":
                flipped = true;
                this.body.velocity.y = speed;
                break;
            case "r":
                this.body.velocity.x = speed;
                break;
            case "l":
                this.body.velocity.x = -speed;
                break;
            case undefined:
                this.body.velocity.x = speed;
                break;
        }

        this.setFlipY(flipped);
        
        this.play("beam_anim");
    }
}