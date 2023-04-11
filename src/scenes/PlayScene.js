
import BaseScene from './BaseScene';

class PlayScene extends BaseScene {
  //Sets the properties of the play scene
  constructor(config) {
    super('PlayScene', config);

    //Adds player variables and input variables
    this.player = null;
    this.playerDoubleJump = true;
    this.inputKeys = null;

    //Adds variables for the main platforms
    this.platforms = null;
    this.platformHorizontalDistance = 0;
    this.platformVelocityMod = 0;

    //Adds variables for the starting platform and buzzsaw sprite
    this.buzzsaw = null;
    this.startPlatform = null;

    //Adds other variables needed for Pause function and score
    this.isPaused = false;
    this.platformTimer = 220;
    this.score = 0;
    this.scoreText = '';
  }

  create() {
    super.create();

    //Calls the various create functions needed for game items
    this.createPlayer();
    this.createPlatforms();
    this.createBuzzsaw();

    this.createColliders();

    this.createScore();
    this.createPause();

    this.listenToEvents();

    this.createAnims();
  }

  update() {
    //Updates the status of the player
    this.checkPlayerStatus();

    //Handle inputs
    this.playerInputs();
    //Moves the platforms to the top of the screen outside of the play area
    this.recyclePlatforms();

    //Increases the timer for the starting platform and moves it offscreen if timer is up
    this.timerTick();
  }


  //Adds the buzzsaw item
  createBuzzsaw() {
    this.buzzsaw = this.physics.add.sprite( 300 , 584, 'sawblades');
  }

  //Adds the background
  createBG() { this.add.image(0, 0, 'sky').setOrigin(0); }


  createPlayer() {
    //Adds the player sprite and the physics options for the sprite
    this.player = this.physics.add.sprite( 300 , 475 , 'ninja')
      .setScale(1)
      .setOrigin(0);
    this.player.body.gravity.y = 600;
    this.player.setCollideWorldBounds(true);
    //Decreases the body size and slightly offsets it
    this.player.setBodySize(this.player.width-8, this.player.height-2);
    this.player.setOffset(3, 0);

    //Adds the key variable needed for handling inputs for the player
    this.inputKeys = this.input.keyboard.createCursorKeys();
  }

  createPlatforms() {
    //Sets the timer for the platform 
    //If set in the create function, the platform does not reappear after a game over
    this.platformTimer = 220;
    //Adds physics to the platorms
    this.platforms = this.physics.add.group();
    this.startPlatform = this.physics.add.sprite(300, 550, 'platform').setImmovable(true);

    //Creates platforms (one for each side) and then places them
    for (let i = 0; i < 6; i++) {
      const rPlatform = this.platforms.create(0, 0, 'platform').setOrigin(0, 1).setImmovable(true);
      const lPlatform = this.platforms.create(0, 0, 'platform').setOrigin(0, 0).setImmovable(true);

      this.placePlatform(rPlatform, lPlatform)
    }
    //Sets the platform velocity and makes them fall
    this.platforms.setVelocityY(200);
  }

  createColliders() { 
    //Adds colliders to the players
    this.physics.add.collider(this.player, this.platforms, null, null, this); 
    this.physics.add.collider(this.player, this.startPlatform, null, null, this); 
  }

  createScore() {
    //Adds the score variable, loads the high score from the local storage and then adds text for the score
    this.score = 0;
    const bestScore = localStorage.getItem('bestScore');
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {fontSize: '32px', fill: '#000'} );
    this.bestScoreText = this.add.text(16, 52, `Best Score: ${bestScore || 0}`, {fontSize: '18px', fill: '#000'} );
  }

  createPause() {
    //Adds a pause button and causes it to enter the pause scene when clicked
    //It also pauses both the physics and existing scene
    this.isPaused = false;
    const pauseButton = this.add.image(this.config.width - 30, this.config.height - 60, 'pause')
      .setOrigin(1).setScale(0.5).setInteractive();

    pauseButton.on('pointerdown', ()=> { 
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    })
  }

  //Adds the animations needed for the player and buzzsaw
  createAnims() {
    this.anims.create({
      key: 'idleKey',
      frames: this.anims.generateFrameNumbers('ninja', { start: 3, end: 4}),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'jumpKey',
      frames: this.anims.generateFrameNumbers('ninja', { start: 13, end: 14}),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'doubleJumpKey',
      frames: this.anims.generateFrameNumbers('ninja', { start: 17, end: 24}),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'fallKey',
      frames: this.anims.generateFrameNumbers('ninja', { start: 15, end: 16}),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'runKey',
      frames: this.anims.generateFrameNumbers('ninja', { start: 4, end: 11}),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'buzzKey',
      frames: this.anims.generateFrameNumbers('sawblades', { start: 0, end: 1}),
      frameRate: 6,
      repeat: -1
    });
  }


  //Ticks the timer down, moves the platform, and animates the saw. 
  timerTick() {
    this.platformTimer--;
    if (this.platformTimer <= 0){
      this.startPlatform.x = 62500;
    }
    this.buzzsaw.play('buzzKey', true);
    this.playerJumpCooldown++;
  }

  //Checks for the pause event and if the player comes back from the menu, pauses the game and counts down
  listenToEvents() {
    if (this.pauseEvent) { return; }
    this.pauseEvent = this.events.on('resume', () => {
      this.initialTime = 3;
      this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true
      })
    })
  }  

  //Counts down the pause timer and resumes the game when finished
  countDown() {
    this.initialTime--;
    this.countDownText.setText('Game resumes in: ' + this.initialTime);
    if (this.initialTime <= 0) {
      this.countDownText.setText('');
      this.physics.resume();
      this.timedEvent.remove();
      this.isPaused = false;
    }
  }


  //Checks if the player hit the bottom of the screen
  checkPlayerStatus() {
    if (this.player.getBounds().bottom >= this.config.height) {
      this.gameOver();
    }
  }

  //Gets the highest platform and returns it
  getTopMostPlatform() {
    let topMostY = 0;
    this.platforms.getChildren().forEach(function(platform) {
      topMostY = Math.max(-platform.y, topMostY);
    })
    return topMostY;
  }


  //Places the platforms at random positions offscreen
  placePlatform(rPlatform, lPlatform) {
    const topMostY = this.getTopMostPlatform();
    const platformVerticalDistance = Phaser.Math.Between(650, 700);
    const platformVerticalPosition = Phaser.Math.Between(0, -400);
    const platformHorizontalDistance =  Phaser.Math.Between(-300, -450);

    lPlatform.y = -topMostY + platformHorizontalDistance;
    lPlatform.x = platformVerticalPosition;

    rPlatform.y = lPlatform.y + 60;
    rPlatform.x = lPlatform.x + platformVerticalDistance;
  }

  //If a platform goes offscreen, replaces it at the top and increases the score
  recyclePlatforms() {
    const tempPlatforms = [];
    this.platforms.getChildren().forEach(platform => {
      if (platform.getBounds().top >= this.config.height) {
        tempPlatforms.push(platform);
        if (tempPlatforms.length === 2) {
          this.platforms.setVelocityY(200+this.platformVelocityMod)
          this.platformVelocityMod += 1;
          this.placePlatform(...tempPlatforms);
          this.increaseScore();
          this.saveBestScore();
        }
      }
    })
  }

  //Adds the best score to the local storage. 
  saveBestScore() {
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
       localStorage.setItem('bestScore', this.score); 
    }
  }

  //Increases the score. 
  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`)
  }

  //Plays the game over scene and sets the score if it was higher than the best score
  gameOver() {
    localStorage.setItem('currentScore', this.score);    
    this.scene.stop('PlayScene');
    this.scene.launch('GameOverScene');
  }

  //Handles the inputs of the player and changes the animations when input is given. 
  playerInputs() {
    if (this.inputKeys.left.isDown) {
        this.player.setVelocityX(-260);
        //Flips the direction of the animations if the left or right arrow keys are pressed, 
        this.player.flipX = true;
        if (this.player.body.touching.down) {
          //Only plays the anim if the player is on the ground. 
          this.player.play('runKey', true);
        }
    }
    else if (this.inputKeys.right.isDown) {
      this.player.setVelocityX(260);
      //Flips the direction of the animations if the left or right arrow keys are pressed, 
      this.player.flipX = false;
      if (this.player.body.touching.down) {
        //Only plays the anim if the player is on the ground. 
        this.player.play('runKey', true);
      }
    }
    else {
      //Plays the idle anim if left or right isn't pressed
      this.player.setVelocityX(0);
      if (this.player.body.touching.down) {
        this.player.play('idleKey');
      }
    }

    //Resets the double jump cooldown if the player hits the ground. 
    if (this.player.body.touching.down) {
      this.playerJumpCooldown = 90;
    }

    if (this.inputKeys.up.isDown) {
      //Does a standard jump if the player is touching the ground
      if (this.player.body.touching.down) {
        this.player.setVelocityY(-470);
        this.playerJumpCooldown = 65;
        this.player.play('jumpKey', true);
      }
      //Otherwise, a double jump is done if the cooldown is low enough.
      //After the double jump, sets the cooldown extrodinarily high
      else if (this.playerJumpCooldown >= 100) {
        this.playerJumpCooldown = -99999;
        this.player.setVelocityY(-370);
        this.player.play('doubleJumpKey', true);
      }
    }
    //Causes the player to fall if down is pressed.
    else if (this.inputKeys.down.isDown) {
      this.player.setVelocityY(1000);
      this.player.play('fallKey', true);
    }
  }
}

export default PlayScene;