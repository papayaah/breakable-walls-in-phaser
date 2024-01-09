import Behavior from "./Behavior";

class SeekBehavior extends Behavior {
  constructor(sprite, speed) {
    super(sprite)
    // we just have one target for now
    this.targets = []
    this.currentTargetIndex = 0
    this.speed = speed
  }

  update() {
    if (this.targets.length === 0) {
      return // No targets to seek
    }

    const currentTarget = this.targets[this.currentTargetIndex]
    const facing = this.sprite.facing(currentTarget.x, currentTarget.y)
    this.sprite.playAnimation(`walk${facing}`, true)
    if (facing == 'Left') {
      this.sprite.flipX = true
    }

    // Calculate the velocity vector
    const velocity = this.sprite.calcVelocity(currentTarget.x, currentTarget.y)

    // Apply the velocity to the sprite
    this.sprite.setVelocity(velocity.x, velocity.y)

    // Check if the sprite has reached the current target
    const distanceToTarget = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      currentTarget.x,
      currentTarget.y
    );

    if (distanceToTarget < 10) {
      // If the sprite is close to the current target, switch to the next target
      this.currentTargetIndex = (this.currentTargetIndex + 1) % this.targets.length
    }
  }

  setTarget(target) {
    this.targets = [target]
    this.currentTargetIndex = 0
  }

  stop() {
    this.sprite.body.velocity.set(0, 0)
  }
}

export default SeekBehavior