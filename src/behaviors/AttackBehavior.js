import { Timer } from "../utils/Timer"
import Behavior from "./Behavior"

class AttackBehavior extends Behavior {
  constructor(sprite, attackRange, attackDamage) {
    super(sprite)
    this.attackRange = attackRange;
    this.attackDamage = attackDamage;
    this.target = null
    this.attackTimer = new Timer(2500)
  }

  update(delta) {
    if (!this.target || this.target.dead()) return

    if (!this.inAttackRange()) return

    this.attack(delta)
  }

  attack(delta) {
    if (this.attackTimer.ready()) {

      const facing = this.sprite.facing(this.target.x, this.target.y)
      let animation = `attack${facing}`

      this.sprite.playAnimation(animation, 6, () => {
        // momentarily stop the animation in the middle
        // this shows sword effect frame
        if (this.target.deadOnHit(this.attackDamage)) {
          this.sprite.anims.pause()
          this.sprite.scene.time.delayedCall(600, () => this.sprite.anims.resume());
        }
        const attackAngle = Phaser.Math.Angle.Between(
          this.sprite.x, this.sprite.y,
          this.target.x, this.target.y
        )

        this.target.hit(this.attackDamage, this.sprite.x, this.sprite.y, attackAngle)
      });

      this.attackTimer.reset();
    } else {
      this.attackTimer.update(delta)
    }
  }

  setTarget(target) {
    this.target = target;
  }

  inAttackRange() {
    if (!this.target) return false;

    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      this.target.x,
      this.target.y
    );

    return distance <= this.attackRange;
  }
}

export default AttackBehavior