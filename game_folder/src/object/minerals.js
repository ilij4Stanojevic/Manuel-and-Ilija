class Minerals extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tipo) {
        let texture;

        // Decidi texture
        switch (tipo) {
            case 2:
                texture = "rock1";
                break;
            case 3:
                texture = "rock2";
                break;
            default:
                texture = "rock1";
        }

        // Costruttore padre
        super(scene, x, y, texture);

        // Aggiunge alla scena
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // 👉 statico = true

        // Animazione se presente
        if (tipo === 2) {
            this.play("rock1_anim");
        } else if (tipo === 3) {
            this.play("rock2_anim");
        }
    }
}