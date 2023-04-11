
import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene'
import PauseScene from './scenes/PauseScene'
import GameOverScene from './scenes/GameOverScene'

//Sets the config for all screens
const WIDTH = 600;
const HEIGHT = 600;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
}

//Contains our scenes to enable transitions between different game states
const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene, GameOverScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map((createScene));

//Sets the config for this screen, which is then moved to the preload scene
const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      //debug: true,
    }
  },
  scene: initScenes()
}

new Phaser.Game(config);