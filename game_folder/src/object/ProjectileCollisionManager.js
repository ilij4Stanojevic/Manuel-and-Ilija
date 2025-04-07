class ProjectileCollisionManager {
    constructor(scene) {
        this.scene = scene;
    }

    // Metodo per gestire la collisione tra il proiettile e il giocatore
    // static dealDamageToPlayer(player, projectile, damage) {
    //     player.gotHitted(projectile.scene, damage);  // Danno inflitto al giocatore
    //     projectile.destroy();  // Distrugge il proiettile
    // }

    // Aggiungi la gestione delle collisioni tra il giocatore e i proiettili
    addProjectileCollision(projectilesGroup, enemy, damage) {
        // console.log(enemy);

        this.scene.physics.add.overlap(enemy, projectilesGroup, (enemies, projectile) => {
            ProjectileCollisionManager.dealDamage(enemies, projectile, damage);
        });
    }

    static dealDamage(enemy, projectile, damage) {
        console.log(enemy);
        // enemy.gotHitted(projectile.scene, damage);  // Danno inflitto al giocatore
        // projectile.destroy();  // Distrugge il proiettile
    }
}
