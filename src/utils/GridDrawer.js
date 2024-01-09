class GridDrawer extends Phaser.GameObjects.Graphics {
  constructor(scene, width, height, cellSize) {
    super(scene);

    this.scene = scene;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;

    this.draw();

    // Add this grid to the scene
    scene.add.existing(this);
  }

  draw() {
    this.clear();

    // Draw checkerboard pattern
    for (let x = 0; x < this.width; x += this.cellSize) {
      for (let y = 0; y < this.height; y += this.cellSize) {
        // Alternate colors
        const color = (x / this.cellSize + y / this.cellSize) % 2 === 0 ? 0x4E3B3D : 0x5c4446;

        this.fillStyle(color, 1);
        this.fillRect(x, y, this.cellSize, this.cellSize);
      }
    }

    // Set line style for grid lines
    this.lineStyle(0.5, 0x000000, 1);

    // Draw vertical lines
    for (let x = 0; x <= this.width; x += this.cellSize) {
      this.beginPath();
      this.moveTo(x, 0);
      this.lineTo(x, this.height);
      this.strokePath();
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.height; y += this.cellSize) {
      this.beginPath();
      this.moveTo(0, y);
      this.lineTo(this.width, y);
      this.strokePath();
    }
  }
}

export default GridDrawer;
