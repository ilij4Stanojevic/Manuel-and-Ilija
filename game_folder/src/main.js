window.onload = function(){
    gameSettings = {
        speedPlayer: 100
    }
    config = {
        width: 768,
        height: 384,
        parent: "idContainerGame",
        backgroundColor: '#028af8',

        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { y: 0 }
            }
        },

        /*scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },*/

        scene: [
            PreLoader,
            Tutorial,
            Menu,
            PlanetMenu,
            Moon,
            Azeroth,
            Boss_room1,
            SpaceShip,
            GameOver
        ]
    };

    var game = new Phaser.Game(config);
}
