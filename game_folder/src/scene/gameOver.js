class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        // Recuperiamo la larghezza e l'altezza del canvas
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const altezza = 50;

        // Impostiamo lo sfondo
        this.background = this.add.image(0, 0, 'background_menu');
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(768, 768/2);  // Sfondiamo solo la metà superiore

        // Aggiungiamo il testo centrato
        this.add.text(width / 2, (height / 20) + altezza, "Game Over", {
        font: "67px Courier New",
            fill: "purple"
        }).setOrigin(0.5, 0.5); // La proprietà setOrigin(0.5, 0) centra orizzontalmente e sposta il testo in alto

        // Crea il tasto per ricominciare il gioco centrato
        this.backToMenu = this.add.image(width / 2, (height / (20/5)) + altezza, "backToGame_button");
        this.backToMenu.setOrigin(0.5, 0.5);
        this.backToMenu.setDisplaySize(100, 100 / 3);

        // Impostiamo i bottoni interattivi
        this.backToMenu.setInteractive();

        // Azione per tornare al menu
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject === this.backToMenu) {
                this.scene.start("PreLoader");  // Torni al preloader
            }
        });
    }
}
