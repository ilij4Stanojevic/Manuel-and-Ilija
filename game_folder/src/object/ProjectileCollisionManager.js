class ProjectileCollisionManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
    }

    // Metodo per gestire la collisione tra il proiettile e il giocatore
    static dealDamageToPlayer(player, projectile, damage) {
        player.gotHitted(projectile.scene, damage);  // Danno inflitto al giocatore
        projectile.destroy();  // Distrugge il proiettile
    }

    // Aggiungi la gestione delle collisioni tra il giocatore e i proiettili
    addProjectileCollision(projectilesGroup, damage) {
        this.scene.physics.add.overlap(this.player, projectilesGroup, (player, projectile) => {
            ProjectileCollisionManager.dealDamageToPlayer(player, projectile, damage);
        });
    }
}
