class Menu extends Phaser.Scene{
    constructor(){
        super("Menu");
    }
    create() {
        // dimensione verticale: 384
        this.space = 40+48
        this.background = this.add.image(0, 0, 'background_planetMenu');
        this.background.setOrigin(0,0);
        this.background.setDisplaySize(768, 768/2);
        
        this.textMenu = this.add.text(768/2, 50, "Menu", {
            fontFamily: 'font_tutorial',
            fontSize: '48px',
            color: '#cfcfcf'
        });
        this.textMenu.setOrigin(0.5, 0.5);
        
        this.newGame = this.add.image(768/2, 25 + 24 + this.space, 'newGame_button');
        this.newGame.setOrigin(0.5, 0.5);
        this.newGame.setDisplaySize(150, 150/3);
        this.newGame.setInteractive();

        this.tutorial = this.add.image(768/2, 100 + 48 + this.space, 'tutorial_button');
        this.tutorial.setOrigin(0.5, 0.5);
        this.tutorial.setDisplaySize(150, 150/3);
        this.tutorial.setInteractive();

        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject === this.tutorial) {
                this.scene.start("Tutorial");
            }
        });
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject === this.newGame) {
                this.scene.start("PlanetMenu"); 
            }
        });
    }
}