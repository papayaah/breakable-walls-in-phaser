class DebugScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DebugScene', active: true });
    this.maxLines = 15;
  }

  create() {
    this.debugText = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' }).setScrollFactor(0);
    this.additionalTextLines = [];
  }

  update() {
    // Combine the default debug lines with the additional text lines
    this.debugText.setText(this.additionalTextLines);
    this.debugText.setText(this.debugLines);
    this.debugLines = []; // Clear the array after rendering
  }

  addAdditionalText(input) {
    if (typeof input === 'string') {
      this.debugLines.push(input);
    } else if (Array.isArray(input)) {
      this.debugLines.push(...input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        this.debugLines.push(`${key}: ${value}`);
      }
    }
  }

  addToDebugLines(textLine) {
    this.additionalTextLines.push(textLine);
    // Remove oldest line if exceeding maxLines
    if (this.additionalTextLines.length > this.maxLines) {
      this.additionalTextLines.shift();
    }
  }

}

export default DebugScene