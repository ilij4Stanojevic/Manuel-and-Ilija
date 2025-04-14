class Monster extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, size, texture){
        super(scene, x, y, texture);

        this.setDisplaySize(size,size);

        scene.physics.add.existing(this);

        this.hp = 50;

        this.speed = 100;

        scene.add.existing(this);
    }
    gotHit(damage){
        this.hp -= damage;

        if(this.hp < 0){
            this.destroy();
        }
    }

    moveTowards(target, monster) {
        const direction = Phaser.Math.Between(
          target.x - monster.x,
          target.y - monster.y
        ).normalize();
    
        this.setVelocity(direction.x * monster.speed, direction.y * monster.speed);
    }

    getNearestMonsterToPlayer(monsterGroup, player) {
        let closestMonster = null;
        let closestDistance = Infinity;

        monsterGroup.children.iterate((monster) => {
            const distance = Phaser.Math.Distance.Between(
                monster.x, monster.y,
                player.x, player.y
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestMonster = monster;            
            }
        });

        return closestMonster;
    }
    

    update(scene, monster){
        let player = scene.player;
        let monsterGroup = scene.monsters;

        const nearest = this.getNearestMonsterToPlayer(monsterGroup, player);

        if (nearest == monster) {
            console.log("I am here");
            this.moveTowards(player, monster);
        }
    }
}