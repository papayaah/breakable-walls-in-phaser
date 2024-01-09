
export class Timer {
  constructor(cooldown) {
    this.cooldown = cooldown;
    this.timer = 0;
  }

  update(delta) {
    if (this.timer > 0) {
      this.timer -= delta;
    }
  }

  ready() {
    return this.timer <= 0;
  }

  reset(newCooldown = this.cooldown) {
    this.timer = newCooldown;
  }
}

