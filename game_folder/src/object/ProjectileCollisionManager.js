class ProjectileCollisionManager {
    constructor(scene, walls) {
        this.scene = scene;
        this.walls = walls;
    }

    dealDamagePlayer(player, projectile, damage) {
        player.gotHitted(projectile.scene, damage);  // Danno inflitto al giocatore
        projectile.destroy();  // Distrugge il proiettile
    }

    dealDamageBoss(boss, projectile, damage){
        boss.gotHitted(damage);  // Danno inflitto al giocatore
        projectile.destroy();  // Distrugge il proiettile
    }

    projectileDestroy(projectile){
            projectile.destroy();  // Distrugge il proiettile
    }
    // Aggiungi la gestione delle collisioni tra il giocatore e i proiettili
    addProjectileCollisionPlayer(projectilesGroup, player, damage) {
        this.scene.physics.add.overlap(player, projectilesGroup, (player, projectile) => {
            this.dealDamagePlayer(player, projectile, damage);
        });
    }

    addProjectileCollisionBoss(projectilesGroup, boss, damage) {
        this.scene.physics.add.overlap(boss, projectilesGroup, (boss, projectile) => {
            this.dealDamageBoss(this.scene.boss, projectile, damage);
        });
    }
    addProjectileCollisionProjectiles(projectilesGroup, walls) {
        this.scene.physics.add.overlap(projectilesGroup, walls, (projectile, wall) => {
            this.projectileDestroy(projectile);
        });
    }
    
}
