# Breakable Walls in Phaser

A demo tutorial using Phaser [Graphics](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html) game object to render walls built with perspective bricks and having it smashed.  Focused on clean, architecturally sound coding practices to make this demo not just visually appealing but a learning resource... I hope!

![Screenshot](demo.gif)


>_Hello, I'm embarking on a journey to launch my first game, Invasion, into the gaming world. It would be a delight if you can tag along as I break down and share different component of the game with you. You can follow me at [itch.io](https://papayaah.itch.io/)._

>_Protect your camp from the Invasion. You will have troops to summon to help you. Troops and equipment upgrades are at your disposal and with each passing level, the onslaught intensifies._


Each Brick is created by defining the faces of the vertices and using Graphics#lineTo to form each face (side) of the brick. 

The bricks are put into multiple rows and columns to form a Wall. They are staggered and have different colors to make it visually appealing.

When a wall gets hit by the enemy, the nearest brick flies away from the angle of attack. When a wall destroyed, it gets half-ed where the enemy is standing, clearing a path forward for the enemy.

The Sprite related classes:

*   Spritesheet: Handles loading of animations. Since we only need to store one copy of these spritesheet in memory.
*   PhysicsSprite - Has reference to Spritesheet, and general functionality like playing animation. 
*   Enemy - Inherits from PhysicsSprite and has functionality that is related to enemies. Also has reference to AI behavior classes. 

AI Classes:

*   SeekBehavior: Attached to a Enemy class. Responsible in moving the Enemy sprite in the world.
*   AttackBehavior: Attached to an Enemy class. Responsible in hitting the wall and playing the animation. 

Attribution:

*   Built with the fun and fast 2D HTML game framework [Phaser](https://github.com/phaserjs/phaser)
*   Character sprite is not free and requires payments from the [Penusbmic](https://penusbmic.itch.io/stranded-starter-pack)
*   Impact sound from [OpenGameArt](https://opengameart.org/content/37-hitspunches) 
*   Wall crumbling sound from [Youtube](https://www.youtube.com/watch?v=oRwHxQnu-gs)

Version 1.0 - Jan. 10, 2024. First release.

[Github Link](https://github.com/papayaah/breakable-walls-in-phaser)

_I may not update this moving forward, but rather I intend to build up from this and focus on getting different features release and shared until eventually piecing them altogether leading into my complete game._

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) into the `dist` folder |