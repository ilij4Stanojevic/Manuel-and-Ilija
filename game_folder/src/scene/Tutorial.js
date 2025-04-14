class Tutorial extends Phaser.Scene {
    constructor() {
        super("Tutorial");
    }

    create() {
        this.playerCanMove = false;
        this.textActive = false;
        let numberMap = 3;
        this.updatable = true;
        this.codeTaken = false;
        this.tutorialEnd = false;
        let doors = [
            {
                tileX: 18, tileY: 8, onComplete: () => {
                    this.piece_of_paper.destroy();
                    this.add.text(15.5*64, 6*64, "interact with the control panel", {
                        fontFamily: 'font_tutorial',
                        fontSize: '16px',
                        color: '#c0cacd'
                    });
                    this.add.text(15.5*64, 6.5*64, "to open the door in front of you", {
                        fontFamily: 'font_tutorial',
                        fontSize: '16px',
                        color: '#c0cacd'
                    });
                    this.codeTaken = true;
                }
            },
            {
                tileX: 22.7, tileY: 8, onComplete: () => {  
                    if(this.codeTaken){
                        this.open_bigDoor_tutorial = this.add.image(23*64, 6*64, "open_bigDoor_tutorial").setOrigin(0, 0);
                        this.tutorialEnd = true;
                        this.tweens.add({
                            targets: this.player,
                            y: 7.5 * 64,
                            duration: 1000,
                            ease: 'Linear',
                            onUpdate: () => {
                                this.updatable = false;
                                this.playerCanMove = false;
                                this.player.anims.play("playerUp", true);
                            },
                            onComplete: () => {
                                this.player.anims.play("player_animStoppedRight", true);
                                this.updatable = true;
                                this.tweens.add({
                                    targets: this.player,
                                    x: 23.7 * 64,
                                    duration: 1000,
                                    ease: 'Linear',
                                    onUpdate: () => {
                                        this.updatable = false;
                                        this.player.anims.play("player_animRight", true);
                                    },
                                    onComplete: () => {
                                        this.scene.start('PlanetMenu');
                                    }
                                });
                            }
                        });
                    }else {
                        this.add.text(16.5*64, 7.5*64, "take the piece of paper!", {
                            fontFamily: 'font_tutorial',
                            fontSize: '16px',
                            color: '#c0cacd'
                        });
                    }
                }
            }
        ];

        this.background = this.add.image(0, 0, "background_tutorial").setOrigin(0, 0);
        this.background.setDisplaySize(768 * 2, 768);
        // Aggiungi il pannello di controllo come sprite
        this.control_panel = this.physics.add.sprite(23 * 64, 8 * 64, "control_panel")
        this.control_panel.setOrigin(1, 0);  // L'origine è in alto a destra
        this.control_panel.setSize(26, 61);
        this.control_panel.setOffset(38, 0);
        this.control_panel.setDepth(2);
        this.control_panel.setImmovable(true);

        this.piece_of_paper = this.add.image(18*64, 8*64, "piece_of_paper").setOrigin(0, 0);
        this.piece_of_paper.setDisplaySize(32, 32);

        // Setup player
        let playerHP = this.registry.get("playerHP") || 100;
        this.player = new Player(this, 343, 0, "player", this.walls, undefined, undefined, playerHP, doors, numberMap, 10);
        this.player.setDisplaySize(64, 64);
        this.physics.world.setBounds(0, 0, widthMap, heightMap);

        let tween = this.tweens.add({
            targets: this.player,
            y: 145,
            duration: 1500,
            ease: 'Linear',
            onUpdate: () => {
                if (this.player.y >= 70) {
                    this.player.setDepth(2);
                }
                this.player.anims.play("playerDOWN", true);
            },
            onComplete: () => {
                this.player.anims.play("player_animStoppedUp", true);
                this.time.delayedCall(600, () => {
                    this.open_door_tutorial.destroy();
                    this.pavimento_door_tutorial.destroy();
                });
                this.time.delayedCall(600, () => {
                    this.player.anims.play("player_animStoppedDown", true);
                });
                this.time.delayedCall(1000, () => {
                    this.playerCanMove = true;
                    this.textActive = true;
                });
            }
        });

        this.walls = this.physics.add.staticGroup();
        this.map = new Map(this, this.walls, numberMap);
        this.open_door_tutorial = this.add.image(320, 0, "open_door_tutorial").setOrigin(0, 0);
        this.open_door_tutorial.setDepth(1);
        this.open_door_tutorial.setDisplaySize(64, 128);

        this.pavimento_door_tutorial = this.add.image(320, 64, "pavimento_door_tutorial").setOrigin(0, 0);
        this.pavimento_door_tutorial.setDisplaySize(64, 64);

        this.projectileCollisionManager = new ProjectileCollisionManager(this, this.walls);

        // Configura la telecamera
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, widthMap, heightMap);
        this.camera.centerOn(this.player.x, this.player.y);

        // setUp guardia
        this.guardia = this.physics.add.sprite(7*64+32, 7*64+32, null);
        this.guardia.setSize(64, 64); // larghezza e altezza della hitbox
        this.guardia.setVisible(false); // invisibile
        this.guardia.body.setAllowGravity(false);
        this.guardia.setImmovable(true);
        this.guardia.hp = 50;

        this.physics.add.collider(this.player, this.control_panel);
        this.physics.add.collider(this.player, this.guardia);
        this.physics.add.collider(this.player, this.walls);
        this.projectileCollisionManager.addProjectileCollisionProjectilesTutorial(this.player.projectiles, this.guardia);
        this.heartX = 10;

        this.add.text(4.25*64, 8*64, "Use", {
            fontFamily: 'font_tutorial',
            fontSize: '16px',
            color: '#c0cacd'
        });
        this.spacebar = this.add.image(4*64, 8.4*64, "spacebar").setOrigin(0, 0);
        this.add.text(2.2*64, 9*64, "to shoot, kill the guard", {
            fontFamily: 'font_tutorial',
            fontSize: '16px',
            color: '#c0cacd'
        });
        this.add.text(2*64, 9.5*64, "to proceed with the mission", {
            fontFamily: 'font_tutorial',
            fontSize: '16px',
            color: '#c0cacd'
        });

        this.add.text(11*64, 9.4*64, "use", {
            fontFamily: 'font_tutorial',
            fontSize: '16px',
            color: '#c0cacd'
        });
        this.keyE = this.add.image(11.7*64, 9.4*64, "keyE").setOrigin(0, 0);
        this.add.text(12*64, 9.4*64, " to interact and grab the piece of paper and read the code", {
            fontFamily: 'font_tutorial',
            fontSize: '16px',
            color: '#c0cacd'
        });

        this.add.text(10*64, 7.4*64, "use", {
            fontFamily: 'font_tutorial',
            fontSize: '16px',
            color: '#c0cacd'
        });
        this.keyQ = this.add.image(10.7*64, 7.4*64, "keyQ").setOrigin(0, 0);
        this.add.text(11*64, 7.4*64, " to open the inventory", {
            fontFamily: 'font_tutorial',
            fontSize: '16px',
            color: '#c0cacd'
        });
    }

    update(time, delta) {
        this.player.showBarHp(time, delta, this);
        this.player.showBarStamina(this);
        if(this.updatable){
            this.player.update(time, delta, this);
        }

        // Gestione dei tutorial e delle animazioni in update
        if (this.textActive) {
            //wasd
            this.keyW = this.add.image(3.5*64+8, 3.3*64, "keyW").setOrigin(0, 0);
            this.keyA = this.add.image(3.5*64-8, 3.3*64+16, "keyA").setOrigin(0, 0);
            this.keyS = this.add.image(3.5*64+8, 3.3*64+16, "keyS").setOrigin(0, 0);
            this.keyD = this.add.image(3.5*64+24, 3.3*64+16, "keyD").setOrigin(0, 0);
            this.add.text(3.5*64, 3*64, "Use", {
                fontFamily: 'font_tutorial',
                fontSize: '16px',
                color: '#c0cacd'
            });
            this.add.text(2*64, 4*64, "to move the character", {
                fontFamily: 'font_tutorial',
                fontSize: '16px',
                color: '#c0cacd'
            });

            //shift
            this.add.text(4.25*64, 5.5*64, "Use", {
                fontFamily: 'font_tutorial',
                fontSize: '16px',
                color: '#c0cacd'
            });
            this.shift = this.add.image(4.2*64, 6*64, "shift").setOrigin(0, 0);
            this.add.text(4*64, 6.5*64, "to run", {
                fontFamily: 'font_tutorial',
                fontSize: '16px',
                color: '#c0cacd'
            });
        }

        // Check guardia morta
        if (this.guardiaMorta) {
            this.pavimento = this.add.image(7*64, 7*64, "pavimento").setOrigin(0, 0);
            this.pavimento.setDisplaySize(64, 64);
            this.muro = this.add.image(7*64, 6*64, "muro").setOrigin(0, 0);
            this.muro.setDisplaySize(64, 64);
        }
    }
}
