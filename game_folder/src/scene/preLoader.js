const tileSize = 64;
const widthMap = document.getElementById("idContainerGame").clientWidth;
const heightMap = document.getElementById("idContainerGame").clientHeight;
const barProgressWidth = 30;
const barProgressHeight = 5;
const barPlayerHpWidth = (48 * 3) + 20;
const barPlayerHpHeight = 20;
const barBossHpWidth = 200;
const barBossHpHeight = 20;
const barPlayerStaminaWidth = (48 * 3);
const barPlayerStaminaHeight = 10;

class PreLoader extends Phaser.Scene{
    constructor(){
        super("PreLoader");
    }
    preload(){
        this.load.image("background", "assets/images/map.png");
        this.load.image("background_menu", "assets/images/background_menu.jpg");
        this.load.image("background_planetMenu", "assets/images/background_planetMenu.png");
        this.load.image("newGame_button", "assets/images/menu_button.png");
        this.load.image("tutorial_button", "assets/images/tutorial_button2.png");
        this.load.image("bg_boss1", "assets/images/bg_boss1.png");
        this.load.image("backToGame_button", "assets/images/BackToGame_button.png");
        this.load.image("exit_button", "assets/images/Exit_button.png");
        this.load.image("heart_life", "assets/images/heart_life.png");
        this.load.image("heart_dead", "assets/images/heart_dead.png");
        this.load.image("mineral1", "assets/images/mineral1.png");
        this.load.image("mineral2", "assets/images/mineral2.png");
        this.load.image("spaceship", "assets/images/rover.png");
        this.load.image("background_tutorial", "assets/images/tutorial_map.png");
        this.load.image("muro", "assets/images/muro.png");
        this.load.image("pavimento", "assets/images/pavimento.png");
        this.load.image("open_door_tutorial", "assets/images/open_door_tutorial.png");
        this.load.image("pavimento_door_tutorial", "assets/images/pavimento_porta_tutorial.png");
        this.load.image("keyW", "assets/images/W.png");
        this.load.image("keyA", "assets/images/A.png");
        this.load.image("keyS", "assets/images/S.png");
        this.load.image("keyD", "assets/images/D.png");
        this.load.image("keyE", "assets/images/E.png");
        this.load.image("keyQ", "assets/images/Q.png");
        this.load.image("spacebar", "assets/images/SPACE.png");
        this.load.image("shift", "assets/images/SHIFT.png");
        this.load.image("piece_of_paper", "assets/images/piece_of_paper.png");
        this.load.image("control_panel", "assets/images/Lab_Control_Panel.png");
        this.load.image("open_bigDoor_tutorial", "assets/images/open_bigDoor_tutorial.png");
        this.load.image("arrowLeft", "assets/images/arrowLeft.png");
        this.load.image("arrowRight", "assets/images/arrowRight.png");
        this.load.image("select_button", "assets/images/select_button.png");
        
        document.fonts.load('32px font_tutorial');

        
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
        this.load.spritesheet("rock1", "assets/spritesheets/rock 1.png",{
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("rock2", "assets/spritesheets/rock 2.png",{
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("planet1", "assets/spritesheets/planet1.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("planet2", "assets/spritesheets/planet2.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("planet3", "assets/spritesheets/planet3.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        
    }

    create(){
        this.anims.remove("playerUp");
        this.anims.remove("player_animStoppedUp");
        this.anims.remove("playerDOWN");
        this.anims.remove("player_animStoppedDown");
        this.anims.remove("player_animRight");
        this.anims.remove("player_animStoppedRight");
        this.anims.remove("proiettile_b1");
        this.anims.remove("beamUd_anim");
        this.anims.remove("beamLr_anim");
        this.anims.remove("boss1_anim");
        this.anims.remove("rock1_anim");
        this.anims.remove("rock2_anim");

        this.anims.create({
            key: "playerUp",
            frames: this.anims.generateFrameNumbers("playerSkinUp",{
                start: 1,
                end: 3
            }),
            frameRate: 4,
            repeat: -1
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
            repeat: -1
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
        this.anims.create({
            key: "rock1_anim",
            frames: this.anims.generateFrameNumbers("rock1",{
                start: 0,
                end: 4
            }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: "rock2_anim",
            frames: this.anims.generateFrameNumbers("rock2",{
                start: 0,
                end: 3
            }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "planet1_anim",
            frames: this.anims.generateFrameNumbers("planet1", { start: 0, end: 127 }),
            frameRate: 24,
            repeat: -1
        });
        this.anims.create({
            key: "planet2_anim",
            frames: this.anims.generateFrameNumbers("planet2", { start: 0, end: 127 }),
            frameRate: 24,
            repeat: -1
        });
        this.anims.create({
            key: "planet3_anim",
            frames: this.anims.generateFrameNumbers("planet3", { start: 0, end: 127 }),
            frameRate: 24,
            repeat: -1
        });
        

        this.scene.start("Menu");
        // this.scene.start("BootGame");
    }
}