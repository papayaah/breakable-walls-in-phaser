import DebugObject from "../utils/DebugObject";

class Brick extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, depth, faceColors) {
    //super(scene, x, y, width, height);
    super(scene, x, y)
    this.scene = scene
    this.width = width
    this.height = height
    this.depth = depth
    this.hit = false

    //this.graphics = this.scene.add.graphics()
    this.graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    this.add(this.graphics); // Add the graphics object to the container

    this.angleRad = Phaser.Math.DegToRad(270) // Initialize angle in radians

    this.faceColors = faceColors

    // this.faceColors = {
    //   front: 0x272223,   // Light blue
    //   back: 0x00008B,    // Dark blue
    //   top: 0x3D3637,     // Dark red
    //   bottom: 0x006400,  // Dark green
    //   left: 0xFF4500,    // Dark orange
    //   right: 0x4B0082    // Dark purple
    // };

    this.create();
    this.scene.add.existing(this);

    // Handle keyboard input for changing the angle
    scene.input.keyboard.on('keydown-J', () => this.rotateBrick(-5)); // Decrease angle
    scene.input.keyboard.on('keydown-K', () => this.rotateBrick(5));  // Increase angle
  }

  create() {
    const graphics = this.graphics
    const brickWidth = this.width
    const brickHeight = this.height
    const lineColor = 0x010101;


    // Calculate offsets based on the perspective angle
    const offsetX = this.depth * Math.cos(this.angleRad);
    const offsetY = this.depth * Math.sin(this.angleRad);


    // Adjust vertices based on perspective
    const vertices = [
      { x: -brickWidth / 2, y: -brickHeight / 2 },
      { x: brickWidth / 2, y: -brickHeight / 2 },
      { x: brickWidth / 2, y: brickHeight / 2 },
      { x: -brickWidth / 2, y: brickHeight / 2 },
      { x: -brickWidth / 2 - offsetX, y: -brickHeight / 2 + offsetY },
      { x: brickWidth / 2 - offsetX, y: -brickHeight / 2 + offsetY },
      { x: brickWidth / 2 - offsetX, y: brickHeight / 2 + offsetY },
      { x: -brickWidth / 2 - offsetX, y: brickHeight / 2 + offsetY }
    ];

    // Define the faces of the cube (indices of vertices)
    const faces = {
      back: [4, 5, 6, 7], // Back face
      bottom: [2, 3, 7, 6], // Bottom face
      left: [0, 3, 7, 4], // Left face
      right: [1, 2, 6, 5], // Right face
      top: [0, 1, 5, 4], // Top face
      front: [0, 1, 2, 3], // Front face
    };

    // Draw and color each face of the cube
    for (const [sideName, vertexIndices] of Object.entries(faces)) {
      const faceColor = this.faceColors[sideName]

      if (faceColor !== undefined) {
        // Set the fill style to a solid color
        graphics.fillStyle(faceColor, 1)

        const faceVertices = vertexIndices.map(index => vertices[index])

        graphics.beginPath();
        graphics.moveTo(faceVertices[0].x, faceVertices[0].y)

        for (let i = 1; i < faceVertices.length; i++) {
          graphics.lineTo(faceVertices[i].x, faceVertices[i].y)
        }

        graphics.closePath()
        graphics.fillPath()
      }
    }
    // Draw the edges of the cube
    graphics.lineStyle(0.35, lineColor)
    graphics.beginPath()

    const outlineFaces = ['front', 'top', /* 'left', 'right', 'bottom', 'back' */]

    for (const sideName of outlineFaces) {
      const vertexIndices = faces[sideName]
      for (let i = 0; i < vertexIndices.length; i++) {
        const startVertex = vertices[vertexIndices[i]]
        const endVertex = vertices[vertexIndices[(i + 1) % vertexIndices.length]]
        graphics.moveTo(startVertex.x, startVertex.y)
        graphics.lineTo(endVertex.x, endVertex.y)
      }
    }

    graphics.closePath()
    graphics.strokePath()

    return graphics
  }

  // setDepth(depth) {
  //   super.setDepth(depth)
  //   // After drawing the brick, add depth text
  //   const depthText = this.scene.add.text(0, 0, `${this.depth}`, {
  //     fontSize: '4px', // Larger font size
  //     fill: '#ffffff'
  //   }).setOrigin(0.5, 0.5)
  //   depthText.setResolution(10)

  //   // Position the text in the center of the brick
  //   depthText.x = 0;
  //   depthText.y = 0;

  //   this.add(depthText); // Add the text to the container
  // }

  rotateBrick(degrees) {
    // Update the angleRad property
    this.angleRad += Phaser.Math.DegToRad(degrees);

    // Remove the existing graphics object
    //this.destroy();
    this.graphics.clear()

    // Recreate the brick with the updated angle
    this.create(this.x, this.y, this.width, this.height);
  }

  flash() {
    const graphics = this.graphics;
    // Store the original face colors
    const originalFaceColors = { ...this.faceColors };

    // Apply a white fill color to all faces temporarily
    Object.keys(this.faceColors).forEach(side => {
      this.faceColors[side] = 0xffffff; // Set all faces to white
    });

    this.redraw(); // Redraw the brick with white color

    // Revert the colors back to original after a short delay
    this.scene.time.delayedCall(100, () => {
      this.faceColors = originalFaceColors; // Restore original colors
      this.redraw(); // Redraw the brick with original colors
    });

    this.hit = true
  }

  // Method to redraw the brick
  redraw() {
    this.graphics.clear();
    this.create(this.x, this.y, this.width, this.height);
  }
}

export default Brick