class Monster extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, size, texture, player){
        super(scene, x, y, texture);

        this.setDisplaySize(size,size);

        scene.physics.add.existing(this);

        this.vitaMax = 50; // per gestire attivazione del mostro
        this.hp = 50;   
        this.spawnPointX = x;
        this.spawnPointY = y;

        scene.add.existing(this);
        this.scene = scene
        this.active = false;

    }
    gotHit(damage){
        this.hp -= damage;

        if(this.hp < 0){
            this.destroy();
        }
    }
    activate(distanzaDaPlayer){
        const distanzaAttivazione = 160;
        if(distanzaDaPlayer < distanzaAttivazione){
            this.active = true;
        } else if(this.hp === this.vitaMax && distanzaDaPlayer > distanzaAttivazione){
            this.active = false;
        }
    }
    moveToPlayer(distanzaDaPlayer){
        const speed = 75;  // Velocità di movimento
        const distanzaAttacco = 60;
        if(distanzaDaPlayer < distanzaAttacco){
            console.log("attacco");
            this.setVelocityX(0);
            this.setVelocityY(0);
        }else{
            this.scene.physics.moveToObject(this, this.scene.player, speed);
        }

        // Limita il movimento ai bordi della mappa
        this.x = Phaser.Math.Clamp(this.x, 0, widthMap);
        this.y = Phaser.Math.Clamp(this.y, 0, heightMap);
    }
    backToSpawn(){
        const speed = 125;
        const distanzaTolleranza = 10;

        if(Phaser.Math.Distance.Between(this.x, this.y, this.spawnPointX, this.spawnPointY) < distanzaTolleranza){
            this.setVelocity(0);
        }else{
            this.scene.physics.moveTo(this, this.spawnPointX, this.spawnPointY, speed);
        }
    }
    update(){
        var distanzaDaPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
        console.log(distanzaDaPlayer);
        this.activate(distanzaDaPlayer);
        if(this.active){
            this.moveToPlayer(distanzaDaPlayer);
        }else{
            this.backToSpawn();
        }
    }
}