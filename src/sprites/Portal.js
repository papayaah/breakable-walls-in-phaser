class Portal extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);

    this.portalGraphics = new Phaser.GameObjects.Graphics(scene);
    this.add(this.portalGraphics); // Add the graphics object to the container

    this.radius = 15; // Define the radius of the rift
    this.fillAlpha = 0.5;

    this.ovalWidth = 15;  // Width of the oval portal
    this.ovalHeight = 20; // Height of the oval portal

    // Draw the portal
    this.drawPortal();

    // Add pulsating effect
    this.addPulsatingEffect();
  }

  drawPortal() {
    let graphics = this.portalGraphics;
    graphics.clear();

    // Customize the appearance of the portal to be oval
    graphics.lineStyle(0.5, 0xF2D3AC);
    graphics.strokeEllipse(0, 0, 15, 20);

    graphics.fillStyle(0xE7A76C, this.fillAlpha);
    graphics.fillEllipse(0, 0, this.ovalWidth * 0.8, this.ovalHeight * 0.8);
  }

  addPulsatingEffect() {
    this.scene.tweens.add({
      targets: this,
      ovalWidth: this.ovalWidth * 0.9,
      ovalHeight: this.ovalHeight * 0.9,
      //fillAlpha: this.fillAlpha * 0.25,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {

        this.drawPortal(); // Redraw the portal with the updated radius
      }
    });
  }

  appear() {
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      duration: 800,
      ease: 'Power2',
      onUpdate: () => {
      }
    });
  }

  disappear() {
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      duration: 800,
      ease: 'Power2',
      onUpdate: () => {
      }
    });
  }
}

export default Portal;
