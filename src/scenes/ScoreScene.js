
import BaseScene from './BaseScene';


class ScoreScene extends BaseScene {
    //Sets the properties of the Score scene
    constructor(config) {
        super('ScoreScene', {...config, canGoBack: true});
    }

    //Adds the score text to the scene
    create() {
        super.create();

        const bestScore = localStorage.getItem('bestScore');
        this.add.text(...this.screenCenter, `Score: ${bestScore || 0}`, this.fontOptions).setOrigin(0.5);
    }
}

export default ScoreScene;
