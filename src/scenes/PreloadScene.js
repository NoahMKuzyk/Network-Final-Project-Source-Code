import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
    //Loads the config, and sets the name of the scene
    constructor(config) {
        super('PreloadScene');
    }

    //Preloads the assets for use across all scenes.
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('pause', 'assets/pause.png');
        this.load.image('back', 'assets/back.png');
        this.load.image('platform', 'assets/platform.png');

        this.load.spritesheet('ninja', 'assets/ninjaPlayer.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('sawblades', 'assets/sawblades.png', {
            frameWidth: 600, frameHeight: 32
        });
    }

    //Starts the Menu scene
    create() {
       this.scene.start('MenuScene');
    }
}

export default PreloadScene;
