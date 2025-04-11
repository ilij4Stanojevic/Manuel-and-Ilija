class Monster extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, size,texture){
        super(scene, x, y, texture);


        scene.add.existing(this);
        scene.physics.add.existing(this);

        // NON VA 
    }
}