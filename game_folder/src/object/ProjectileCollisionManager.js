class ProjectileCollisionManager {
    constructor(scene) {
        this.scene = scene;
    }

    // Metodo per gestire la collisione tra il proiettile e il giocatore
    static dealDamageToPlayer(player, projectile, damage) {
        player.gotHitted(projectile.scene, damage);  // Danno inflitto al giocatore
        projectile.destroy();  // Distrugge il proiettile
    }

    // Aggiungi la gestione delle collisioni tra il giocatore e i proiettili
    addProjectileCollision(projectilesGroup, enemy, damage) {
        // console.log(enemy);

        this.scene.physics.add.overlap(enemy, projectilesGroup, (enemy, projectile) => {
            ProjectileCollisionManager.dealDamage(enemy, projectile, damage);
        });
    }

    static dealDamage(enemy, projectile, damage) {
        enemy.gotHitted(projectile.scene, damage);  // Danno inflitto al giocatore
        projectile.destroy();  // Distrugge il proiettile
    }
}
