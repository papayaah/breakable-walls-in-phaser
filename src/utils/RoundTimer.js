class RoundTimer {
  constructor(scene) {
      this.scene = scene;
      this.elapsed = 0; // Total elapsed time in milliseconds
      this.timerText = this.scene.add.text(
          this.scene.cameras.main.centerX,
          10,
          '',
          { font: '30px Verdana', fill: '#ffffff' }
      ).setOrigin(0.5, 0);

      this.updateTimer(0);
  }

  updateTimer(delta) {
      this.elapsed += delta; // Accumulate the delta time

      const seconds = Math.floor(this.elapsed / 1000) % 60;
      const minutes = Math.floor(this.elapsed / 60000) % 60;
      const hours = Math.floor(this.elapsed / 3600000);

      let displayText = hours > 0
          ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          : `${minutes}:${seconds.toString().padStart(2, '0')}`;

      this.timerText.setText(displayText);
  }
}

export default RoundTimer