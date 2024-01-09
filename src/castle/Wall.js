import DebugObject from "../utils/DebugObject";
import Brick from "./Brick";

class Wall extends Phaser.GameObjects.Container {
  constructor(scene, x, y, brickWidth, brickHeight, brickDepth, bricksPerRow, bricksPerCol) {
    super(scene, x, y)

    this.scene = scene;
    this.brickWidth = brickWidth
    this.brickHeight = brickHeight
    this.brickDepth = brickDepth
    this.maxHealth = 3;
    this.health = this.maxHealth;
    this.state = 'alive';
    this.x = x;
    this.y = y;
    this.bricksPerCol = bricksPerCol
    this.bricksPerRow = bricksPerRow
    this.targeted = false

    // Add the body to the scene
    this.scene.physics.add.existing(this, true)
    this.scene.add.existing(this);

    //this.setImmovable(true); // Important for static bodies

    // Graphics to visually represent the wall
    this.graphics = scene.add.graphics()
    this.create()
  }

  create() {
    const brickWidth = this.brickWidth
    const brickHeight = this.brickHeight
    const brickDepth = this.brickDepth
    const bricksPerRow = this.bricksPerRow
    const bricksPerCol = this.bricksPerCol
    const offset = brickWidth / 2
    const horizontalSpacing = 0
    const verticalSpacing = 0

    this.bricks = []

    const alternateColors = [
      { front: 0x272223, top: 0x3D3637 },
      { front: 0x504748, top: 0x625759 },
    ]

    for (let row = 0; row < this.bricksPerRow; row++) {
      for (let col = 0; col < this.bricksPerCol; col++) {
        let cubeX = row * (brickWidth + horizontalSpacing)

        if ((this.bricksPerCol - col) % 2 === 0) {
          cubeX += offset
        }

        let cubeY = col * (brickHeight + verticalSpacing)

        // Choose color set based on alternating pattern
        const colorSetIndex = (row + col) % alternateColors.length
        const faceColors = alternateColors[colorSetIndex]

        // Create the cube with the chosen colors
        const posX = cubeX - (bricksPerRow * (brickWidth / 2)) + offset
        const posY = cubeY - (bricksPerCol * (brickHeight / 2)) + offset

        // fill in a small brick
        if ((this.bricksPerCol - col) % 2 ==- 0) {
          if( row == 0) {
            const brick = new Brick(this.scene, posX - 7.5, posY, 5, brickHeight, brickDepth, { front: 0x615859, top: 0x73686A })
            this.add(brick)
            brick.setDepth(-posY)
          }
        }

        const brick = new Brick(this.scene, posX, posY, brickWidth, brickHeight, brickDepth, faceColors)
        this.add(brick)
        brick.setDepth(-posY)

        // fill in a small brick
        if ((this.bricksPerCol - col) % 2 !== 0) {
          if( row == 3) {
            const brick = new Brick(this.scene, posX + 7.5, posY, 5, brickHeight, brickDepth, { front: 0x615859, top: 0x73686A })
            this.add(brick)
            brick.setDepth(-posY)
          }
        }

        if (DEBUG) new DebugObject(brick)
      }
    }
    this.sort('depth')
    this.setDepth(9)

    // Calculate total wall size
    const totalWidth = this.bricksPerRow * brickWidth
    const totalHeight = this.bricksPerCol * brickHeight
    // Set physics body size to total dimensions of bricks
    this.body.setSize(totalWidth, totalHeight);
    //this.body.setOffset(totalWidth, totalHeight);

    if (DEBUG) new DebugObject(this)

    this.width = totalWidth
    this.height = totalHeight
  }

  hitBrick(hitX, hitY, angle) {
    // Calculate the relative X position of the hit
    const relativeHitX = hitX - this.x;

    // Determine the column based on the relative hit position
    const columnIndex = Math.floor(relativeHitX / this.brickWidth);

    // Ensure the column index is within the range of available columns
    const validColumnIndex = Math.max(0, Math.min(columnIndex, this.bricksPerRow - 1));

    // Filter bricks that are in the same column and haven't been hit
    const bricksInColumn = this.list.filter(brick => {
      const brickColumnIndex = Math.floor(brick.x / this.brickWidth);

      return brickColumnIndex === validColumnIndex && !brick.hit;
    });

    // Randomly select a brick from the column
    if (bricksInColumn.length > 0) {
      const randomBrick = Phaser.Utils.Array.GetRandom(bricksInColumn);

      // We assume 'angle' is the direction from which the hit comes, so we'll reverse it
      // to make the brick move away from the hit
      const oppositeAngle = angle + Math.PI; // Add π radians (180 degrees) to reverse the direction

      const knockbackDistance = Phaser.Math.Between(30, 50); // Adjust the distance as needed

      // Determine the target's knockback position
      const knockbackX = randomBrick.x + Math.cos(angle) * knockbackDistance;
      const knockbackY = randomBrick.y + Math.sin(angle) * knockbackDistance;

      // Determine the direction of the x-component of the knockback
      const xDirection = Math.cos(oppositeAngle);

      // Decide the rotation direction based on the x-component direction
      // Rotate counterclockwise (negative) if moving left, and clockwise (positive) if moving right
      const rotationDirection = xDirection < 0 ? 1 : -1;

      // Calculate a rotation angle in radians
      const rotationAngle = rotationDirection * Phaser.Math.Between(10, 300)

      // Apply effects to simulate the brick moving away from the hit
      this.scene.tweens.add({
        targets: randomBrick,
        x: knockbackX,
        y: knockbackY,
        angle: rotationAngle, // Add rotation to the brick
        duration: Phaser.Math.Between(100, 500),
        ease: 'Cubic.easeIn',
        onComplete: () => {
          // If you want to do something when the tween completes, like removing the brick
        }
      });

      randomBrick.hit = true;
      // randomBrick.flash(); // Uncomment if you want to visually flash the brick upon hit
    }
  }

  hit(damage, hitX, hitY, attackAngle) {
    this.takeDamage(damage);

    if (this.health <= 0) {
      this.destroy(hitX, hitY, attackAngle);
    } else {
      this.findAndHitNearestBrick(hitX, hitY, attackAngle);
    }
  }

  takeDamage(damageAmount) {
    this.health -= damageAmount;

    this.scene.events.emit('attack')
    if (this.health <= 0) {
      this.scene.events.emit('wallDestroyed')
      this.health = 0;
      this.body.enable = false;
      this.state = 'dead';
    }
  }

  alive() {
    return this.state == 'alive'
  }

  dead() {
    return this.state == 'dead'
  }

  deadOnHit(damage) {
    return this.health - damage <= 0
  }

  findAndHitNearestBrick(spriteX, spriteY, angle) {
    let nearestBrick = null;
    let minDistance = Number.MAX_VALUE;

    this.list.forEach(brick => {
      if (!brick.hit) {
        // Get the brick's absolute position in the scene
        const brickSceneX = brick.x + this.x;
        const brickSceneY = brick.y + this.y;
        // Calculate the distance from the sprite to the brick
        const distance = Phaser.Math.Distance.Between(spriteX, spriteY, brickSceneX, brickSceneY);
        if (distance < minDistance) {
          minDistance = distance;
          nearestBrick = brick;
        }
      }
    });

    if (nearestBrick) {
      // Since the nearestBrick position is relative to the container, add the container's position
      const nearestBrickSceneX = nearestBrick.x + this.x;
      const nearestBrickSceneY = nearestBrick.y + this.y;

      // Hit the nearest brick
      this.hitBrick(nearestBrickSceneX, nearestBrickSceneY, angle);
      //nearestBrick.flash(); // Uncomment if you want to visually flash the brick upon hit
    }
  }

  destroy(x /* enemy position */) {
    const wallHeight = this.height

    const castle = this.scene.castle

    if (castle.totalWalls - castle.aliveWalls().length == 1) {
      // apply dramatic effect only on the first destroyed wall
      this.scene.tweens.timeScale = 0.25
      this.scene.camera.focusOnDestruction(this)
    }

    this.list.forEach(brick => {
      if (brick.hit) return

      this.scene.time.delayedCall(200, () => {
        // Determine horizontal offset direction based on brick position relative to wall center
        const directionMultiplier = brick.x + this.x < x ? -1 : 1; // Left falls slightly left (-1), right falls slightly right (1)
        // Small horizontal offset based on direction
        const offsetX = directionMultiplier * Phaser.Math.Between(20, 25); // Very small offset values

        // Larger vertical offset for falling effect
        const heightFactor = (brick.y - wallHeight) / wallHeight
        const offsetY = Phaser.Math.Between(25, 45) * -heightFactor

        // Rotation based on falling direction
        const rotationAngle = directionMultiplier * Phaser.Math.Between(10, 120);
        this.scene.tweens.add({
          targets: brick,
          x: brick.x + offsetX,
          y: brick.y + offsetY,
          angle: rotationAngle,
          duration: Phaser.Math.Between(300, 600), // Adjusted for the falling effect
          ease: 'Cubic.easeOut',
          onComplete: () => {
            this.scene.tweens.timeScale = 1
          }
        })
      })
    })
  }


}

export default Wall