import BaseScene from './BaseScene';

class GameOverScene extends BaseScene {
        //Adds properties to the Game Over scene
    constructor(config) {
        super('GameOverScene', config);
        this.menu = [
            {scene: 'PlayScene', text: 'Play Again'},
            {scene: 'MenuScene', text: 'Exit'}
        ]
    }

    //Creates menu items
    create() {
        super.create();
        this.createMenu(this.menu, (menuItem) => this.setupMenuEvents(menuItem));
    }


    setupMenuEvents(menuItem) {
        this.createText();
        const textGO = menuItem.textGO;
        textGO.setInteractive();

        //Changes text colour when buttons are hovered over
        textGO.on('pointerover', () => {
            textGO.setStyle({fill: '#ff0'});
        })
        textGO.on('pointerout', () => {
            textGO.setStyle({fill: '#fff'});
        })

        //Changes scene when buttons are clicked
        textGO.on('pointerup', ()=> {
            if (menuItem.scene && menuItem.text === 'Play Again') {
                this.scene.stop();
                this.scene.start(menuItem.scene);
            }
            else {
                this.scene.stop('PlayScene');
                this.scene.start(menuItem.scene);
            }
        })
    }

    createText(){
        //Creates the text for the Game Overscene
        const currentScore = localStorage.getItem('currentScore');
        const bestScore = localStorage.getItem('bestScore');

        this.gameOverText = this.add.text(this.config.width /4, 50, 'Game Over!', {fontSize: '42px', fill: '#000'} );
        this.bestScoreText = this.add.text(this.config.width /4, 96, `High Score: ${bestScore || 0}`, {fontSize: '42px', fill: '#09f'} );
        this.add.text(this.config.width /4, 142, `Score: ${currentScore}`, {fontSize: '42px', fill: '#09f'});
      }
}

export default GameOverScene;
