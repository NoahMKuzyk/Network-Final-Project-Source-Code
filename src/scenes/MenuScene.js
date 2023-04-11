
import BaseScene from './BaseScene';

class MenuScene extends BaseScene {
    //Adds properties to the Menu scene
    constructor(config) {
        super('MenuScene', config);
        this.menu = [
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'ScoreScene', text: 'Score'},
            {scene: null, text: 'Exit'}
        ]
        this.creditText = '';
    }

    //Adds the needed menu items
    create() {
        super.create();

        this.createMenu(this.menu, (menuItem) => this.setupMenuEvents(menuItem));
        this.creditText = this.add.text(this.config.width / 10, this.config.height - 36, 'Made by Noah Kuzyk', {fontSize: '32px', fill: '#800'} );
        this.titleText = this.add.text(this.config.width / 10, 36, 'Ninja Jumping Up', {fontSize: '64px', fill: '#8fe'} );
    }


    setupMenuEvents(menuItem) {
        const textGO = menuItem.textGO;
        textGO.setInteractive();

        //Changes the text colour when hovered over
        textGO.on('pointerover', () => {
            textGO.setStyle({fill: '#ff0'});
        })
        textGO.on('pointerout', () => {
            textGO.setStyle({fill: '#fff'});
        })
        //Destroys scene when exit button is pushed.
        textGO.on('pointerup', ()=> {
            menuItem.scene && this.scene.start(menuItem.scene);
            if (menuItem.text === 'Exit') {
                this.game.destroy(true);
            }
        })
    }
}

export default MenuScene;
