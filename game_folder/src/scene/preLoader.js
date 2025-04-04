const tileSize = 64;
const widthMap = document.getElementById("idContainerGame").clientWidth;
const heightMap = document.getElementById("idContainerGame").clientHeight;
const barProgressWidth = 50;
const barProgressHeight = 10;
const barHpWidth = 200;
const barHpHeight = 20;

class PreLoader extends Phaser.Scene{
    constructor(){
        super("PreLoader");
    }

    preload(){
        this.load.image("background", "assets/images/map.png");
        this.load.image("background_menu", "assets/images/background_menu.jpg");
        this.load.image("menu_button", "assets/images/menu_button.png");
        this.load.image("bg_boss1", "assets/images/bg_boss1.png");
        
        this.load.spritesheet("player", "assets/spritesheets/Astronaut.png",{
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet("playerSkinDown", "assets/spritesheets/playerSkinDown.png",{
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet("playerSkinUp", "assets/spritesheets/playerSkinUp.png",{
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet("playerSkinSxDx", "assets/spritesheets/playerSkinSxDx.png",{
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet("boss1", "assets/spritesheets/boss1.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("proiettile", "assets/spritesheets/proiettile_boss.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("beamLr", "assets/spritesheets/beam lr.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("beamUd", "assets/spritesheets/beam ud.png",{
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create(){
        this.anims.create({
            key: "playerUp",
            frames: this.anims.generateFrameNumbers("playerSkinUp",{
                start: 1,
                end: 3
            }),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: "player_animStoppedUp",
            frames: this.anims.generateFrameNumbers("playerSkinUp",{
                start: 0,
                end: 0
            }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "playerDOWN",
            frames: this.anims.generateFrameNumbers("playerSkinDown",{
                start: 1,
                end: 3
            }),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: "player_animStoppedDown",
            frames: this.anims.generateFrameNumbers("playerSkinDown",{
                start: 0,
                end: 0
            }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "player_animRight",
            frames: this.anims.generateFrameNumbers("playerSkinSxDx",{
                start: 1,
                end: 3
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "player_animStoppedRight",
            frames: this.anims.generateFrameNumbers("playerSkinSxDx",{
                start: 0,
                end: 0
            }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "proiettile_b1",
            frames: this.anims.generateFrameNumbers("proiettile", {
              start: 12,
              end: 15
            }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "beamUd_anim",
            frames: this.anims.generateFrameNumbers("beamUd", {
              start: 0,
              end: 1
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "beamLr_anim",
            frames: this.anims.generateFrameNumbers("beamLr", {
              start: 0,
              end: 1
            }),
            frameRate: 4,
            repeat: -1
        });
        
        this.anims.create({
            key: "boss1_anim",
            frames: this.anims.generateFrameNumbers("boss1", {
              start: 0,
              end: 3
            }),
            frameRate: 4,
            repeat: -1
        });

        this.scene.start("Menu");
        // this.scene.start("BootGame");
    }
}