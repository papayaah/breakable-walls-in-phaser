class Spritesheet {
  constructor(scene, frameWidth, frameHeight, animations) {
    this.scene = scene;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.animations = animations;
    this.animationKeys = {};
  }

  preload(key, path) {
    this.scene.load.spritesheet(key, path, {
      frameWidth: this.frameWidth,
      frameHeight: this.frameHeight
    });
    this.spritesheetKey = key;
  }

  create() {
    for (const [name, animation] of Object.entries(this.animations)) {
      const uniqueKey = `${this.spritesheetKey}_${name}_${Math.random().toString(16).slice(2)}`;
      this.animationKeys[name] = uniqueKey;

      this.scene.anims.create({
        key: uniqueKey,
        frames: this.scene.anims.generateFrameNumbers(this.spritesheetKey, { frames: animation.frames }),
        frameRate: animation.frameRate,
        repeat: animation.repeat ? -1 : 0
      });
    }
  }

  getAnimationKey(name) {
    return this.animationKeys[name];
  }
}

export default Spritesheet