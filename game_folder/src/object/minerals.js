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
            case 4:
                texture = "rock3";
                break;
            case 5:
                texture = "rock4";
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


    /*
    // Mostra la barra della salute
    showBarHp(scene, camera, hpBar){
        hpBar.clear(); // Pulisce la barra
        let x = 0; // Posizione X della barra
        let y = 0; // Posizione Y della barra

        // Calcola la percentuale della salute
        let progress = Phaser.Math.Clamp(this.hp / 100, 0, 1);

        // Imposta il colore e lo stile della barra
        scene.hpBar.fillStyle(0x00ff00, 1); // Verde
        scene.hpBar.lineStyle(2, 0x000000); // Linea nera

        // Disegna la barra di salute
        scene.hpBar.fillRect(x, y, barHpWidth * progress, barHpHeight);
        scene.hpBar.strokeRect(x, y, barHpWidth, barHpHeight);

        hpBar.setScrollFactor(0); // La barra non si sposterà con la telecamera
    }
    
    // Gestisce l'interazione con la porta e la barra di progresso
    crossing(scene, holdTime, requiredHoldTime, delta, progressBar, camera){
        holdTime += delta / 1000; // Incrementa il tempo in secondi

        // Calcola la percentuale di progresso
        let progress = Phaser.Math.Clamp(holdTime / requiredHoldTime, 0, 1);

        // Disegna la barra di progresso
        scene.progressBar.fillStyle(0x00ff00, 1); // Colore verde
        scene.progressBar.lineStyle(2, 0x000000); // Linea nera

        // Calcola la posizione della barra rispetto alla telecamera
        let centerX = this.scene.camera.scrollX + (768 / 2) - (barProgressWidth / 2); 
        let centerY = this.scene.camera.scrollY;

        // Disegna il riempimento della barra
        scene.progressBar.fillRect(centerX, centerY, barProgressWidth * progress, barProgressHeight);
        scene.progressBar.strokeRect(centerX, centerY, barProgressWidth, barProgressHeight);

        return holdTime; // Ritorna il tempo di attesa aggiornato
    }
    */

