import Phaser from 'phaser'
import GridDrawer from './utils/GridDrawer'
import Camera from './utils/Camera'
import DebugScene from './scenes/DebugScene'
import EnemyManager from './sprites/EnemyManager'
import Castle from './castle/Castle'
import SoundManager from './managers/SoundManager'

class BreakableWall extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.debugScene = this.scene.get('DebugScene')

    this.soundManager = new SoundManager(this, {
      'attack': {
        path: 'assets/sfx/hit01.mp3.flac',
        volume: 0.5,
      },
      'wallDestroyed': ['assets/sfx/Breaking Wall Sound Effect.mp3']
    })

    this.enemyManager = new EnemyManager(this, 5000)
    this.enemyManager.preload()
  }

  create() {
    new GridDrawer(this, 800, 640, 16)
    this.camera = new Camera(this)

    this.castle = new Castle(this, 'south')
    this.castle.create()

    const buffer = 40
    this.enemyManager.setSpawnArea(
      {
        x1: this.castle.x + buffer, y1: 250,
        x2: this.castle.x + this.castle.totalWallsWidth - buffer, y2: 250
      }
    )
    this.enemyManager.create()
  }

  update(time, delta) {
    this.enemyManager.update(delta)

    this.camera.update(time, delta)

    if (DEBUG) {
      this.debugScene.update()
    }
  }
}

window.DEBUG = false
const config = {
  backgroundColor: '#4E3B3D',
  height: 640,
  parent: 'phaser-example',
  physics: {
    default: 'arcade',
    arcade: {
      debug: DEBUG,
    }
  },
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  scene: [BreakableWall, DebugScene],
  type: Phaser.AUTO,
  width: 800,
};
window.config = config

const game = new Phaser.Game(config)

