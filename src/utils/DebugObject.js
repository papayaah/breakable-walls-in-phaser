class DebugObject {
  constructor(gameObject) {
    this.scene = gameObject.scene
    this.gameObject = gameObject
    this.graphics = this.scene.add.graphics()
    this.graphics.setDepth(1000)
    this.debugText = this.scene.add.text(0, 0, '', {
      font: '4px Arial',
      fill: '#ffffff'
    }).setOrigin(0)
    .setResolution(10)
    .setLineSpacing(-2)
    .setDepth(1000)
    this.drawDebug()
  }

  getWorldPosition() {
    // Check if the gameObject is inside a container and the container is not null
    if (this.gameObject.parentContainer) {
      // Calculate the world position by adding the container's position
      const container = this.gameObject.parentContainer
      return {
        x: this.gameObject.x + container.x,
        y: this.gameObject.y + container.y
      };
    } else {
      // If the gameObject is not inside a container, return its position directly
      return {
        x: this.gameObject.x,
        y: this.gameObject.y
      };
    }
  }

  drawDebug() {
    const worldPos = this.getWorldPosition();

    // Draw a dot at the gameObject's world position
    this.graphics.fillStyle(0xff0000, 1) // Red color for the dot
    this.graphics.fillCircle(worldPos.x, worldPos.y, 1)

    // Draw a rectangle around the expected physics body with offset
    if (this.gameObject.body) {
      this.graphics.lineStyle(1, 0x00ff00, 1); // Green line for the rectangle
      this.graphics.strokeRect(
        worldPos.x - this.gameObject.body.width / 2 + this.gameObject.body.offset.x,
        worldPos.y - this.gameObject.body.height / 2 + this.gameObject.body.offset.y,
        this.gameObject.body.width,
        this.gameObject.body.height
      );
    }
  }

  addAngleToTarget() {
    if (!this.gameObject.target) return;

    const target = this.gameObject.target
    const targetX = target.x
    const targetY = target.y
    const worldPos = this.getWorldPosition()
    const direction = new Phaser.Math.Vector2(targetX - worldPos.x, targetY - worldPos.y)
    const angleDeg = Phaser.Math.RadToDeg(direction.angle())
    this.appendText(`${angleDeg.toFixed(1)}°\n`)

    // Draw a line from the gameObject to the target
    this.graphics.lineStyle(0.5, 0xff0000, 1)
    this.graphics.lineBetween(this.gameObject.x, this.gameObject.y, targetX, targetY)
  }

  // Append additional text to the debug text
  appendText(text) {
    this.debugText.text += `${text}\n`; // Append new text
  }

  update() {
    // Position for the debug text, to the upper right of the gameObject
    const worldPos = this.getWorldPosition()
    const textX = worldPos.x + 5
    const textY = worldPos.y - 10

    this.graphics.clear()
    this.debugText.setText('')
      .setPosition(textX, textY)

      this.drawDebug()
    this.addAngleToTarget()
  }
}

export default DebugObject