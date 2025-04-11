class PlanetMenu extends Phaser.Scene {
    constructor() {
        super("PlanetMenu");
    }

    create() {
        // Sfondo posizionato con origine in alto a sinistra, come nel Menu
        this.background = this.add.image(0, 0, "background_planetMenu");
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(768, 384); // Usa stessa altezza del canvas

        // Lista dei pianeti con nome, chiave dello spritesheet e scena da caricare
        this.planets = [
            { name: "Moon", key: "planet1", scene: "Moon" },
            { name: "Azeroth", key: "planet2", scene: "MarteScene" },
            { name: "Giove", key: "planet3", scene: "GioveScene" }
        ];

        // Indice del pianeta selezionato inizialmente
        this.currentIndex = 0;

        // Crea gli sprite animati dei pianeti, posizionati orizzontalmente
        this.planetSprites = this.planets.map((planet, i) => {
            // Calcolo della posizione X in base all'indice attuale
            const x = 768 / 2 + (i - this.currentIndex) * 300;
            const y = 384 / 2;
            const sprite = this.add.sprite(x, y, planet.key);
            sprite.setScale(1.2);
            sprite.play(`${planet.key}_anim`);
            return sprite;
        });

        // Testo con il nome del pianeta selezionato
        this.planetNameText = this.add.text(768 / 2, 50, this.planets[this.currentIndex].name, {
            fontFamily: 'font_tutorial',
            fontSize: '48px',
            color: '#cfcfcf'
        }).setOrigin(0.5);

        // Pulsante di selezione del pianeta
        this.selectButton = this.add.image(768 / 2, 384 - 40, "select_button");
        this.selectButton.setInteractive();
        this.selectButton.setDisplaySize(150, 50);
        this.selectButton.setOrigin(0.5);

        // Avvia la scena associata al pianeta selezionato quando si clicca
        this.selectButton.on("pointerdown", () => {
            const selectedPlanet = this.planets[this.currentIndex];
            this.scene.start(selectedPlanet.scene);
        });

        // Freccia per andare a sinistra
        this.leftArrow = this.add.image(30, 384 / 2, "arrowLeft");
        this.leftArrow.setInteractive();
        this.leftArrow.setDisplaySize(48, 48);

        // Freccia per andare a destra
        this.rightArrow = this.add.image(768 - 30, 384 / 2, "arrowRight");
        this.rightArrow.setInteractive();
        this.rightArrow.setDisplaySize(48, 48);

        // Gestione click frecce
        this.leftArrow.on("pointerdown", () => this.scrollPlanets(-1));
        this.rightArrow.on("pointerdown", () => this.scrollPlanets(1));

        // Aggiorna visibilità e trasparenza dei pianeti inizialmente
        this.updatePlanetVisibility();
    }

    // Sposta i pianeti in base alla direzione: -1 sinistra, +1 destra
    scrollPlanets(direction) {
        this.currentIndex += direction;

        // Limiti all’indice per non uscire fuori range
        if (this.currentIndex < 0) this.currentIndex = 0;
        if (this.currentIndex >= this.planets.length) this.currentIndex = this.planets.length - 1;

        // Aggiorna posizione degli sprite con animazione tween
        this.planetSprites.forEach((sprite, i) => {
            this.tweens.add({
                targets: sprite,
                x: 768 / 2 + (i - this.currentIndex) * 300,
                duration: 300,
                ease: 'Cubic'
            });
        });

        // Aggiorna il nome del pianeta
        this.planetNameText.setText(this.planets[this.currentIndex].name);

        // Aggiorna l’aspetto dei pianeti
        this.updatePlanetVisibility();
    }

    // Imposta l'opacità e la scala per evidenziare il pianeta selezionato
    updatePlanetVisibility() {
        this.planetSprites.forEach((sprite, i) => {
            if (i === this.currentIndex) {
                sprite.setAlpha(1);
                sprite.setScale(1.2);
            } else {
                sprite.setAlpha(0.4);
                sprite.setScale(1.0);
            }
        });
    }
}
