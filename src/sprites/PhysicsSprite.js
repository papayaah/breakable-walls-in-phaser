
class PhysicsSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spritesheet) {
    super(scene, x, y, spritesheet.spritesheetKey)
    this.spritesheet = spritesheet
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setOrigin(0.4, 0.5)
    this.setSize(16, 16)
    this.setOffset(16, 32)
    this.body.pushable = false

    if (DEBUG) {
      this.debugText = scene.add.text(this.x, this.y, '', {
        fontSize: '4px',
        fill: '#ffffff'
      }).setOrigin(0.5, 0.5)
      this.debugText.setResolution(10)
    }
  }

  playAnimation(name, frameIndex, frameCallback, frameRate = undefined) {
    this.on('animationupdate', (animation, frame) => {
      if (frameCallback && frame.index === frameIndex) {
        frameCallback(this); // Execute the callback, passing the sprite instance
        // Optional: Remove the listener if it only needs to be triggered once
        this.removeListener('animationupdate')
      }
    })

    this.play({
      key: this.spritesheet.getAnimationKey(name),
      frameRate,
    }, true)
    this.chain([this.spritesheet.getAnimationKey(`idle${this.faceDirection}`)])
  }

  adjustAnimationFrameRate(factor) {
    this.anims.currentAnim.frameRate *= factor
  }

  update(delta) {
    if (this.debugText) {
      this.debugText.setText(this.state).setPosition(this.x, this.y - 10)
    }
  }

  alive() {
    return this.state !== 'dead'
  }

  dead() {
    return this.state === 'dead'
  }
}

export default PhysicsSprite