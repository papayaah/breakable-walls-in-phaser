import AttackBehavior from "../behaviors/AttackBehavior";
import SeekBehavior from "../behaviors/SeekBehavior";
import DebugObject from "../utils/DebugObject";
import PhysicsSprite from "./PhysicsSprite";

class Enemy extends PhysicsSprite {
  constructor(scene, x, y, spritesheet) {
    super(scene, x, y, spritesheet);
    this.scene = scene;
    this.walls = scene.walls
    this.target = null
    this.state = 'idle'
    this.maxHealth = 10
    this.health = this.maxHealth
    this.targeted = false
    this.attackRange = 16
    this.speed = 20
    this.castle = scene.castle
  }

  create() {
    this.attackBehavior = new AttackBehavior(this, this.attackRange, 1)
    this.seekBehavior = new SeekBehavior(this, this.speed)

    this.appear()
    // this.chooseTargetWall()

    if (DEBUG) {
      this.debugObject = new DebugObject(this)
    }
  }

  appear() {
    this.alpha = 0;
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 0, to: 0.5 },
      duration: 250, // Half duration for quicker pulsation
      yoyo: true, // Make it fade in and out once
      hold: 50, // Hold the alpha at 1 for a brief moment
      repeat: 3, // Repeat the yoyo effect once
      ease: 'Power2',
      onComplete: () => {
        this.alpha = 1;
        this.chooseTargetWall()
      }
    });
  }

  update(delta) {
    super.update(delta)
    if (this.debugObject) {
      this.debugObject.update()
    }

    switch (this.state) {
      case 'seeking':
        this.handleSeekingState(delta)
        break;
      case 'attacking':
        this.handleAttackingState(delta)
        break;
    }
  }

  handleSeekingState(delta) {
    this.seekBehavior.update(delta);

    if (this.attackBehavior.inAttackRange()) {
      this.seekBehavior.stop()
      this.state = 'attacking'
    }
  }

  handleAttackingState(delta) {
    this.attackBehavior.update(delta);
    if (this.target.dead()) {
      // do some stuff
    }
  }

  chooseTargetWall() {
    // Filter out destroyed walls
    const intactWalls = this.castle.availableWalls()
    if (intactWalls.length > 0) {
      // Sort the walls by their y-coordinate in ascending order (from top to bottom)
      intactWalls.sort((a, b) => a.y - b.y);

      // Find the wall that is nearest along the path below the sprite
      let closestWall = intactWalls[0];
      let closestDistance = Phaser.Math.Distance.Between(this.x, this.y, closestWall.x, closestWall.y);

      for (let i = 1; i < intactWalls.length; i++) {
        const wall = intactWalls[i];
        const distance = Phaser.Math.Distance.Between(this.x, this.y, wall.x, wall.y);

        if (distance < closestDistance) {
          closestWall = wall;
          closestDistance = distance;
        }
      }

      closestWall.targeted = true
      this.target = closestWall

      this.seekBehavior.setTarget(this.target)
      this.attackBehavior.setTarget(this.target)
      this.state = 'seeking'
    } else {
      this.target = null; // No intact walls left
    }
  }

  calcVelocity(targetX, targetY) {
    const directionToTarget = new Phaser.Math.Vector2(targetX - this.x, targetY - this.y).normalize()
    return directionToTarget.scale(this.speed)
  }

  facing(targetX, targetY) {
    // Calculate the direction vector from the sprite to the current target
    const direction = new Phaser.Math.Vector2(targetX - this.x, targetY - this.y);

    // Calculate the angle in radians and convert it to degrees
    const angleDeg = Phaser.Math.RadToDeg(direction.angle());

    // Determine the direction based on the angle
    let facing = 'Left'
    if (angleDeg >= -65 && angleDeg < 65) {
      facing = 'Right';
    } else if (angleDeg >= 45 && angleDeg < 110) {
      facing = 'Down';
    } else if (angleDeg >= -135 && angleDeg < -45) {
      facing = 'Up';
    }

    if (this.debugObject) {
      this.debugObject.appendText(facing)
    }

    // store last facing
    this.faceDirection = facing
    return facing
  }
}

export default Enemy