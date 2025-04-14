class Monster extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, size, texture){
        super(scene, x, y, texture);

        this.setDisplaySize(size,size);

        scene.physics.add.existing(this);

        this.hp = 50;

        scene.add.existing(this);
    }
    gotHit(damage){
        this.hp -= damage;

        if(this.hp < 0){
            console.log("Monster is dead");
            this.destroy();
        }
    }
    exist(){
        console.log("I exist");
    }
}