import Enemy from "./Enemy";
import Spritesheet from "./Spritesheet";
import Portal from "./Portal";

class EnemyManager {
  constructor(scene, spawnInterval) {
    this.scene = scene;
    this.spawnInterval = spawnInterval
    this.spawnArea = null
    this.enemies = scene.physics.add.group()
  }

  preload() {
    this.tribeWarrior = new Spritesheet(this.scene, 62, 69, {
      walkUp: { frames: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91], repeat: true, frameRate: 16 },
      walkRight: { frames: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], repeat: true, frameRate: 16 },
      walkLeft: { frames: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], repeat: true, frameRate: 16 },
      walkDown: { frames: [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75], repeat: true, frameRate: 16 },
      idleRight: { frames: this.range(0, 5), frameRate: 6, repeat: true },
      idleLeft: { frames: this.range(0, 5), frameRate: 6, repeat: true },
      idleDown: { frames: this.range(16, 21), frameRate: 6, repeat: true },
      idleUp: { frames: this.range(32, 37), frameRate: 6, repeat: true },
      attackLeft: { frames: this.range(96, 106), frameRate: 10, repeat: false, },
      attackRight: { frames: this.range(96, 106), frameRate: 10, repeat: false, },
      attackDown: { frames: this.range(112, 122), frameRate: 10, repeat: false, },
      attackUp: { frames: this.range(128, 138), frameRate: 10, repeat: false, },
      dead: { frames: [20], frameRate: 1, repeat: false },
    })
    this.tribeWarrior.preload('scarab', 'assets/Tribe Warrior/Tribe Warrior 62x69.png')
  }

  create() {
    const scene = this.scene
    this.tribeWarrior.create()

    this.portal = new Portal(this.scene, 0, 0)
    this.portal.setScale(0)
    this.startSpawning()

    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO).on('down', () => this.spawnEnemy())

    this.spawnEnemy()
  }

  update(delta) {
    this.enemies.getChildren().forEach(enemy => {
      enemy.update(delta)
    })
  }

  range(start, end) {
    return Array.from({ length: end - start + 1 }, (v, k) => k + start);
  }

  setSpawnArea(spawnArea) {
    this.spawnArea = spawnArea
  }

  startSpawning() {
    this.timer = this.scene.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    })
  }

  spawnEnemy() {
    if (this.scene.castle.availableWalls().length == 0) return

    // Generate a random position within the spawn area
    const x = Phaser.Math.Between(this.spawnArea.x1, this.spawnArea.x2);
    const y = Phaser.Math.Between(this.spawnArea.y1, this.spawnArea.y2);

    this.portal.appear()
    this.portal.setPosition(x, y)
    this.scene.time.delayedCall(2000, () => {
      this.portal.disappear()
    })

    // Create the enemy at the random position
    this.scene.time.delayedCall(500, () => {
      const enemy = new Enemy(this.scene, x, y, this.tribeWarrior)
      enemy.create()
      enemy.playAnimation('idleDown')
      this.enemies.add(enemy)
    })
  }
}

export default EnemyManager