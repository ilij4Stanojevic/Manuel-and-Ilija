window.onload = function(){
    gameSettings = {
        speed: 200
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
                //gravity: { y: 500 }
            }
        },

        /*scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },*/

        scene: [
            PreLoader,
            Menu,
            BootGame,
            Boss_room1
        ]
    };

    var game = new Phaser.Game(config);
}
