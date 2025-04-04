class Menu extends Phaser.Scene{
    constructor(){
        super("Menu");
    }
    create() {
        this.background = this.add.image(0, 0, 'background_menu');
        this.background.setOrigin(0,0);
        this.background.setDisplaySize(768, 768/2);
        
        this.add.text(304, 768/20, "Menu", {font: "67px Courier New", fill: "purple"});
        
        this.menu_button = this.add.image(334, 768/5, 'menu_button');
        this.menu_button.setOrigin(0,0);
        this.menu_button.setDisplaySize(100, 100/3);

        this.menu_button.setInteractive();
        this.input.on('gameobjectdown', () => this.scene.start('BootGame'));
    }
}