class SoundManager {
  constructor(scene, sounds) {
    this.scene = scene;
    this.sounds = sounds;

    this.loadSounds()
    this.setupEventListeners()
  }

  loadSounds() {
    for (const [event, config] of Object.entries(this.sounds)) {
      if (typeof config === 'string') {
        this.scene.load.audio(event, config)
      } else if (Array.isArray(config) && config.length > 0) {
        this.scene.load.audio(event, ...config);
      } else if (typeof config === 'object' && config.path) {
        this.scene.load.audio(event, config.path);
      } else {
        console.warn('Wrong sound config:', config)
      }
    }
  }

  setupEventListeners() {
    for (const [event, config] of Object.entries(this.sounds)) {
        this.scene.events.on(event, () => {
            const soundConfig = {
                volume: config.volume || 1.0,  // Use provided volume or default to 1.0
                seek: config.seek || 0        // Use provided seek or default to 0
            };
            this.scene.sound.play(event, soundConfig);
        });
    }
  }
}

export default SoundManager