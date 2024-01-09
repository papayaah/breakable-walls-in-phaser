class Camera {
  constructor(scene) {
    this.scene = scene
    this.cameras = scene.cameras
    this.maxZoom = 6.0
    this.minZoom = 1
    this.buffer = 50
    this.initialZoom = 3.5

    const camera = this.cameras.main
    const worldBounds = this.scene.physics.world.bounds
    this.baseWorldBounds = new Phaser.Geom.Rectangle(worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height)

    // Calculate the panning limits considering the game's viewport size
    this.maxPanningX = worldBounds.width - camera.width + this.buffer
    this.minPanningX = -this.buffer
    this.maxPanningY = worldBounds.height - camera.height + this.buffer
    this.minPanningY = -this.buffer

    this.setupControls()
    this.setupZooming()
    this.setupPanning()

    this.cameras.main.setZoom(this.initialZoom)
    this.cameras.main.centerOn(400, 320)

    this.debugScene = scene.scene.get('DebugScene')
  }

  setupControls() {
    const cursors = this.scene.input.keyboard.createCursorKeys()
    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      acceleration: 0.06,
      drag: 0.001,
      maxSpeed: 1.0
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
  }

  setupZooming() {
    this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      let zoomFactor = deltaY > 0 ? 0.9 : 1.1;
      let worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

      // Calculate new zoom level
      let newZoom = this.cameras.main.zoom * zoomFactor;

      // Clamp new zoom level between minZoom and maxZoom
      newZoom = Phaser.Math.Clamp(newZoom, this.minZoom, this.maxZoom);

      // Set the camera zoom to the new level
      this.cameras.main.zoom = newZoom;

      let newWorldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.cameras.main.scrollX += worldPoint.x - newWorldPoint.x;
      this.cameras.main.scrollY += worldPoint.y - newWorldPoint.y;
    });
  }

  setupPanning() {
    this.isPanning = false;
    this.lastPanPoint = new Phaser.Math.Vector2();

    this.scene.input.on('pointerdown', pointer => {
      if (pointer.button === 1) {
        this.isPanning = true;
        this.lastPanPoint.set(pointer.x, pointer.y);
        this.scene.game.canvas.style.cursor = 'grabbing'
      }
    });

    this.scene.input.on('pointerup', pointer => {
      if (pointer.button === 1) {
        this.isPanning = false;
        this.scene.game.canvas.style.cursor = 'default'
      }
    });

    this.scene.input.on('pointermove', pointer => {
      if (this.isPanning) {
        const dx = pointer.x - this.lastPanPoint.x
        const dy = pointer.y - this.lastPanPoint.y

        let newScrollX = Phaser.Math.Clamp(this.cameras.main.scrollX - dx, this.minPanningX, this.maxPanningX)
        let newScrollY = Phaser.Math.Clamp(this.cameras.main.scrollY - dy, this.minPanningY, this.maxPanningY)

        this.cameras.main.scrollX = newScrollX
        this.cameras.main.scrollY = newScrollY

        this.lastPanPoint.set(pointer.x, pointer.y)
      }
    });
  }

  calculateMinZoom() {
    const camera = this.cameras.main;
    const worldBounds = this.scene.physics.world.bounds

    // Calculate the minimum zoom based on the camera viewport and world bounds
    const minZoomX = camera.width / worldBounds.width
    const minZoomY = camera.height / worldBounds.height

    // Use the larger of the two zoom values to ensure the entire viewport is covered
    this.minZoom = Math.max(minZoomX, minZoomY)
  }

  follow(sprite) {
    this.cameras.main.startFollow(sprite, true)
  }

  update(time, delta) {
    this.controls.update(delta)
    this.updatePanningBounds() // Update panning bounds based on current zoom

    // Apply hard cap to the camera position
    this.cameras.main.scrollX = Phaser.Math.Clamp(this.cameras.main.scrollX, this.minPanningX, this.maxPanningX)
    this.cameras.main.scrollY = Phaser.Math.Clamp(this.cameras.main.scrollY, this.minPanningY, this.maxPanningY)

    if (!DEBUG) return

    const cam = this.cameras.main
    const pointer = this.scene.input.activePointer

    let debugLines = [
      `Camera scrollX: ${cam.scrollX.toFixed(2)}`,
      `Camera scrollY: ${cam.scrollY.toFixed(2)}`,
      `Camera x: ${cam.x.toFixed(2)}`,
      `Camera y: ${cam.y.toFixed(2)}`,
      `Zoom: ${cam.zoom.toFixed(2)}`,
      `Pointer X: ${pointer.worldX.toFixed(2)}`,
      `Pointer Y: ${pointer.worldY.toFixed(2)}`
    ];
    this.debugScene.addAdditionalText(debugLines)
  }

  updatePanningBounds() {
    const zoom = this.cameras.main.zoom
    const camera = this.cameras.main
    const worldBounds = this.baseWorldBounds

    // Adjust the maximum and minimum panning limits based on the current zoom level
    this.maxPanningX = worldBounds.width - (camera.width / zoom) + this.buffer
    this.minPanningX = -(camera.width * (1 - 1 / zoom)) - this.buffer
    this.maxPanningY = worldBounds.height - (camera.height / zoom) + this.buffer
    this.minPanningY = -(camera.height * (1 - 1 / zoom)) - this.buffer
  }

  focusOnDestruction(target, duration = 2000, zoomLevel = 7, slowMotionFactor = 0.2) {
    // Slow down the game
    //this.scene.time.timeScale = slowMotionFactor;

    // Remember original camera settings
    const originalZoom = this.cameras.main.zoom;
    const originalPosition = new Phaser.Math.Vector2(this.cameras.main.scrollX, this.cameras.main.scrollY)
    // Zoom in on the target
    this.cameras.main.pan(target.x, target.y, 500, 'Power2')
    this.cameras.main.zoomTo(zoomLevel, 500)

    // Reset camera and time scale after the specified duration
    const centerX = config.width / 2
    const centerY = config.height / 2
    this.scene.time.delayedCall(duration, () => {
      this.cameras.main.pan(centerX, centerY, 500, 'Power2')
      this.cameras.main.zoomTo(this.initialZoom, 500)
    });
  }

}

export default Camera;