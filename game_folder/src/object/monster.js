class Monster extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, size, numeroMostro, tipoAttacco, damage, texture_proiettile){
        super(scene, x, y, `monster${numeroMostro}_idle`);
        this.setDisplaySize(size,size);

        scene.physics.add.existing(this);

        this.vitaMax = 50; // per gestire attivazione del mostro
        this.hp = 50;   
        this.spawnPointX = x;
        this.spawnPointY = y;

        scene.add.existing(this);
        this.scene = scene
        this.attack = tipoAttacco
        this.projectiles = this.scene.add.group();
        this.projectiles.danni = damage;
        this.numeroMostro = numeroMostro;
        this.texture_proiettile = texture_proiettile;
        this.size = size;
        var time;
        if(this.attack === 1){
            time = 1000;
        }else{
            time = 1500;
        }
        this.shootTimer = this.scene.time.addEvent({
            delay: 1500, // Ogni 0.5 secondi
            callback:   () => this.attackPlayer(tipoAttacco, this.size),
            callbackScope: this,
            loop: true,
            paused: true  // Il timer parte in pausa
        });
        this.attacking = false;
        this.damage = damage;
    }
    getAnimations(){
        if(!this.attacking){
            if(this.body.velocity.x === 0 && this.body.velocity.y === 0){
                if(this.anims.currentAnim?.key !== `monster${this.numeroMostro}_idleAnim`){
                    this.anims.play(`monster${this.numeroMostro}_idleAnim`, true);
                }
            } else if(this.body.velocity.x > 70 && this.body.velocity.y !== 0){
                if(this.anims.currentAnim?.key !== `monster${this.numeroMostro}_walkRightAnim`){
                    this.lastAnim = `monster${this.numeroMostro}_walkRightAnim`;
                    this.anims.play(`monster${this.numeroMostro}_walkRightAnim`, true);
                }
            } else if(this.body.velocity.x < -70 && this.body.velocity.y !== 0){
                if(this.anims.currentAnim?.key !== `monster${this.numeroMostro}_walkLeftAnim`){
                    this.lastAnim = `monster${this.numeroMostro}_walkLeftAnim`;
                    this.anims.play(`monster${this.numeroMostro}_walkLeftAnim`, true);
                }
            } else if(this.body.velocity.y > 70){
                if(this.body.velocity.x > 10){
                    if(this.anims.currentAnim?.key !== `monster${this.numeroMostro}_walkRightAnim`){
                        this.lastAnim = `monster${this.numeroMostro}_walkRightAnim`;
                        this.anims.play(`monster${this.numeroMostro}_walkRightAnim`, true);
                    }
                } else if(this.body.velocity.x < -10){
                    if(this.anims.currentAnim?.key !== `monster${this.numeroMostro}_walkLeftAnim`){
                        this.lastAnim = `monster${this.numeroMostro}_walkLeftAnim`;
                        this.anims.play(`monster${this.numeroMostro}_walkLeftAnim`, true);
                    }
                } else{
                    if(this.anims.currentAnim?.key !== `monster${this.numeroMostro}_walkDownAnim`){
                        this.lastAnim = `monster${this.numeroMostro}_walkDownAnim`;
                        this.anims.play(`monster${this.numeroMostro}_walkDownAnim`, true);
                    }
                }
            } else if(this.body.velocity.y < -70){
                if(this.body.velocity.x > 10){
                    if(this.anims.currentAnim?.key !== `monster${this.numeroMostro}_walkRightAnim`){
                        this.lastAnim = `monster${this.numeroMostro}_walkRightAnim`;
                        this.anims.play(`monster${this.numeroMostro}_walkRightAnim`, true);
                    }
                } else if(this.body.velocity.x < -10){
                    if(this.anims.currentAnim?.key !== `monster${this.numeroMostro}_walkLeftAnim`){
                        this.lastAnim = `monster${this.numeroMostro}_walkLeftAnim`;
                        this.anims.play(`monster${this.numeroMostro}_walkLeftAnim`, true);
                    }
                } else{
                    if(this.anims.currentAnim?.key !== `monster${this.numeroMostro}_walkUpAnim`){
                        this.lastAnim = `monster${this.numeroMostro}_walkUpAnim`;
                        this.anims.play(`monster${this.numeroMostro}_walkUpAnim`, true);
                    }
                }
            }
        }
    }

    gotHit(damage){
        this.hp -= damage;
    
        if(this.hp <= 0){
            if(this.shootTimer) {
                this.shootTimer.remove();
            }
            this.destroy();
        }
    }
    

    activate(distanzaDaPlayer){
        const distanzaAttivazione = 160;
        if(distanzaDaPlayer < distanzaAttivazione){
            return true;
        } else {
            return this.hp === this.vitaMax ? false : true;
        }
    }
    attackPlayer(tipoAttacco, size){
        this.attacking = true;
        this.alreadyHitted = false;
        var dirX = this.x - this.scene.player.x;
        var dirY = this.y - this.scene.player.y;

        // Fallback: se lastAnim è undefined, imposta una animazione di default
        if (!this.lastAnim) {
            this.lastAnim = `monster${this.numeroMostro}_walkDownAnim`;
        }
    
        switch(tipoAttacco){
            case 1:
                if(Math.abs(dirX) > Math.abs(dirY)){
                    if(dirX > 0){
                        this.anims.play(`monster${this.numeroMostro}_attackLeftAnim`);
                    } else if(dirX < 0){
                        this.anims.play(`monster${this.numeroMostro}_attackRightAnim`);
                    }else{
                        this.anims.play(`monster${this.numeroMostro}_attackRightAnim`);
                    }
                } else if(Math.abs(dirX) < Math.abs(dirY)){
                    if(dirY > 0){
                        this.anims.play(`monster${this.numeroMostro}_attackUpAnim`);
                    } else if(dirY < 0){
                        this.anims.play(`monster${this.numeroMostro}_attackDownAnim`);
                    }else{
                        this.anims.play(`monster${this.numeroMostro}_attackRightAnim`);
                    }
                } else{
                    this.anims.play(`monster${this.numeroMostro}_attackDownAnim`);
                }
    
                const hitHandler = (anim, frame) => {
                    if (frame.index === 6 && !this.alreadyHitted) {
                        if (this.scene && this.scene.player) {
                            this.scene.player.gotHitted(this.scene, this.damage);
                        }
                        this.alreadyHitted = true;
                    }
                };
    
                this.on('animationupdate', hitHandler);
                this.once('animationcomplete', () => {
                    this.off('animationupdate', hitHandler);
                    this.attacking = false;
                });
                break;
    
            case 2:
                let proiettile = new Proiettile(this.scene, this, this.scene.player, this.texture_proiettile, 1*64);
                this.projectiles.add(proiettile);
                break;
        }
    }
    
    moveToPlayer(distanzaDaPlayer){
        const speed = 75;  // Velocità di movimento
        const distanzaAttacco = 60;
        if(distanzaDaPlayer < distanzaAttacco){
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

    update(active){
        var distanzaDaPlayer;
        if(this.scene?.player){
            distanzaDaPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
            

            if(active){
                switch(this.attack){
                    case 1:
                        if(distanzaDaPlayer < 60){
                            this.shootTimer.paused = false;
                        } else{
                            this.shootTimer.paused = true;
                        }
                        break;
                    case 2:
                        this.shootTimer.paused = false;
                        break;
                }

                this.moveToPlayer(distanzaDaPlayer);

            }else{

                this.shootTimer.paused = true;
                this.backToSpawn();
            }
            this.getAnimations();
        }
    }
}