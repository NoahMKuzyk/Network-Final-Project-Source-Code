import BaseScene from './BaseScene';

class PauseScene extends BaseScene {
    //Sets the properties of the pause scene
    constructor(config) {
        super('PauseScene', config);
        this.menu = [
            {scene: 'PlayScene', text: 'Continue'},
            {scene: 'MenuScene', text: 'Exit'}
        ]
    }

    //Creates the menu items
    create() {
        super.create();
        this.createMenu(this.menu, (menuItem) => this.setupMenuEvents(menuItem));
    }

    //Controls the pointer properties 
    setupMenuEvents(menuItem) {
        const textGO = menuItem.textGO;
        textGO.setInteractive();

        //Changes the texts colour when hovered
        textGO.on('pointerover', () => {
            textGO.setStyle({fill: '#ff0'});
        })
        textGO.on('pointerout', () => {
            textGO.setStyle({fill: '#fff'});
        })

        //Adds functionality to change scenes
        textGO.on('pointerup', ()=> {
            if (menuItem.scene && menuItem.text === 'Continue') {
                this.scene.stop();
                this.scene.resume(menuItem.scene);
            }
            else {
                this.scene.stop('PlayScene');
                this.scene.start(menuItem.scene);
            }
        })
    }
}

export default PauseScene;
