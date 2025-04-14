class Monster extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, size, texture){        
        super(scene, x, y, texture);

        this.setDisplaySize(size,size);

        scene.add.existing(this);
        scene.physics.add.existing(this); // 👉 statico = true
    }
}