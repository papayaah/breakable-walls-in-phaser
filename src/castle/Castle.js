import Wall from "./Wall"

class Castle {
  constructor(scene) {
    this.scene = scene
    this.walls = this.scene.physics.add.staticGroup()
  }

  create() {
    const brickWidth = 10
    const brickHeight = 6
    const brickDepth = 2
    const bricksPerRow = 4
    const bricksPerCol = 4
    const wallWidth = bricksPerRow * brickWidth + 5
    const wallHeight = bricksPerCol * brickHeight;
    const totalWalls = 6
    const totalWallsWidth = totalWalls * wallWidth

    const gameCenterX = config.width / 2

    // Calculate the starting X-coordinate so that walls are centered
    const startX = gameCenterX - (totalWallsWidth / 2) + (wallWidth / 2);
    const startY = config.height / 2 + wallHeight

    for (let i = 0; i < totalWalls; i++) {
      const wallX = startX + i * wallWidth;
      const wall = new Wall(
        this.scene,
        wallX,
        startY,
        brickWidth,
        brickHeight,
        brickDepth,
        bricksPerRow,
        bricksPerCol,
      );
      this.walls.add(wall);
    }

    this.x = startX
    this.y = startY
    this.totalWallsWidth = totalWallsWidth
    this.totalWalls = totalWalls
  }

  availableWalls() {
    return this.walls.getChildren().filter(wall => !wall.dead() && !wall.targeted);
  }

  aliveWalls() {
    return this.walls.getChildren().filter(wall => !wall.dead());
  }
}

export default Castle