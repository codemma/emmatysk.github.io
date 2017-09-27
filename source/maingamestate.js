const playerShipSpeed = 200;
const playerBulletSpeed = 300;

// Create an empty object
var mainGameState = { };



// Add the preload function
mainGameState.preload = function () {
    
    
    const playerShipSpeed = 200;
   
    this.game.load.image('stars', 'assets/stars3.png');
    this.game.load.image('asteroid', 'assets/asteroid.png');
    this.game.load.image('rocket', 'assets/rocket.png');
    this.game.load.image('bullet-laser', 'assets/bullet-laser.png');
    this.game.load.audio('mainmusic', 'music/spacetrip.mp3');
    this.game.load.audio('player_fire_01', 'assets/audio/player_fire_01.mp3');
    this.game.load.audio('player_fire_02', 'assets/audio/player_fire_02.mp3');
    this.game.load.audio('player_fire_03', 'assets/audio/player_fire_03.mp3');
    this.game.load.audio('player_fire_04', 'assets/audio/player_fire_04.mp3');
    this.game.load.audio('player_fire_05', 'assets/audio/player_fire_05.mp3');
    this.game.load.audio('player_fire_06', 'assets/audio/player_fire_06.mp3');
};

// Add the create function
mainGameState.create = function () {
   
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = "#0E243B";
    
    
    //Create field of stars
    starfield = this.game.add.tileSprite(0, 0, 400, 600, 'stars');
    
    //Text fields - Score and Lives
    var textStyle = {font: "16px Arial", fill: "#ffffff", align: "center"}

    this.scoreTitle = game.add.text(game.width * 0.8, 30, "SCORE: ", textStyle);
    this.scoreTitle.fixedToCamera = true;
    this.scoreTitle.anchor.setTo(0.5, 0.5);

    this.scoreValue = game.add.text(game.width * 0.9, 30, "0", textStyle);
    this.scoreValue.fixedToCamera = true;
    this.scoreValue.anchor.setTo(0.5, 0.5);

    this.playerScore = 0;
    //Lives
    this.playerLives = 3;
    
    this.livesTitle = game.add.text(game.width * 0.1, 30, "LIVES: ", textStyle);
    this.livesTitle.fixedToCamera = true;
    this.livesTitle.anchor.setTo(0.5, 0.5);
    
    this.livesValue = game.add.text(game.width * 0.191, 30, "3", textStyle);
    this.livesValue.fixedToCamera = true;
    this.livesValue.anchor.setTo(0.5, 0.5);
    
    //Asteroid timer
    this.asteroidTimer = 2.0;
    
    //Bullet timer
    this.bulletTimer = .3;
    

    
    //Asteroid group
    this.asteroids = this.game.add.group();
    
    //Bullet group
    this.bullets = this.game.add.group();
    
    //Background music
    this.music = this.game.add.audio('mainmusic');
    this.music.play();
    this.music.loopFull();
    //Effect music
    this.playerFireSfx = [];
    this.playerFireSfx.push(game.add.audio("player_fire_01"));
    this.playerFireSfx.push(game.add.audio("player_fire_02"));
    this.playerFireSfx.push(game.add.audio("player_fire_03"));
    this.playerFireSfx.push(game.add.audio("player_fire_04"));
    this.playerFireSfx.push(game.add.audio("player_fire_05"));
    this.playerFireSfx.push(game.add.audio("player_fire_06"));
    
    //Position of player
    var playerX = this.game.width * 0.5;         // Middle of the screen
    var playerY = this.game.height * 0.95;

    //Adding ship
    this.playerShip = this.add.sprite(playerX, playerY, 'rocket');
    this.playerShip.anchor.setTo(0.5, 0.5);
    this.playerShip.scale.setTo(.3, .3);
    
     //Allow phycis on playership
    this.game.physics.arcade.enable(this.playerShip);
    //Ship should not be pushed down by asteroids
    this.playerShip.body.immovable = true;

    //Track input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
};

// Collision
mainGameState.onAsteroidBulletCollision = function(asteroid, bullet) {
    asteroid.destroy();
    bullet.destroy();
    this.playerScore += 1;
};

// Collision
mainGameState.onAsteroidPlayerCollision = function(playerShip, asteroid) {
    asteroid.destroy();
    this.playerLives -= 1;
    
    if ( this.playerLives <= 0 ) {
        game.state.start("GameOver");
    }
};

// UPDATE
mainGameState.update = function() { 
    
    
    this.scoreValue.setText(this.playerScore);
    this.livesValue.setText(this.playerLives);
    
    // Scroll the background
    starfield.tilePosition.y += 2;
    
    //Update Asteroid timer
    this.asteroidTimer = this.asteroidTimer  - game.time.physicsElapsed;
    if (this.asteroidTimer<=0) {
        this.asteroidTimer = 2;
        this.spawnAsteroid();    //Spawn Asteroid
    };
    
    //Update player
    this.updatePlayer(); 
    this.updatePlayerBullets();
    
    //Check for collision - asteriod and bullet
    game.physics.arcade.collide(this.asteroids, this.bullets, mainGameState.onAsteroidBulletCollision, null, this);
    //Check for collision - asteriod and player
    
    
    
    game.physics.arcade.collide(this.playerShip, this.asteroids, mainGameState.onAsteroidPlayerCollision, null, this);
};

//SPAWN ASTEROID
mainGameState.spawnAsteroid = function() {
    //New Asteroid speed
    var asteroidSpeed = game.rnd.integerInRange(150, 300);
    
    this.asteroid = this.add.sprite(game.rnd.integerInRange(0, 370), 0, 'asteroid');
    this.asteroid.anchor.setTo(0.5, 0.5);
    
    this.asteroid.scale.setTo(0.3, 0.3);
    this.game.physics.arcade.enable(this.asteroid);
    this.asteroid.body.velocity.y = asteroidSpeed;
    this.asteroids.add(this.asteroid);
    this.asteroid.body.angularVelocity = game.rnd.integerInRange(150, 300);
    
    for (i=0; i<this.asteroids.children.length; i++) {
        if (this.asteroids.children[i].y > 500) {
            this.asteroids.children[i].destroy();
        }
    };
    
    
};



mainGameState.updatePlayer = function() {
    
    if (this.cursors.right.isDown) {
        this.playerShip.body.velocity.x = playerShipSpeed;
    } else if ( this.cursors.left.isDown ) {
        this.playerShip.body.velocity.x = -playerShipSpeed;
    } else {
        this.playerShip.body.velocity.x = 0;
    }
    
    if (this.playerShip.world.x >= (this.game.width-this.playerShip.width) && this.playerShip.body.velocity.x > 0 ) {
        this.playerShip.body.velocity.x = 0;
    }   
    if (this.playerShip.world.x < this.playerShip.width  &&  this.playerShip.body.velocity.x<0) {
        this.playerShip.body.velocity.x = 0;
    } 
    
};

mainGameState.updatePlayerBullets = function() {
    //Update bullet-timer
    this.bulletTimer -= game.time.physicsElapsed;
    if (this.bulletTimer<=0 && this.fireKey.isDown) {
        this.bulletTimer = 0.3;
        this.spawnPlayerBullet();  //Spawn Bullet
    };
    
    for (i=0; i<this.bullets.children.length; i++) {
        if (this.bullets.children[i].y <= 0) {
            this.bullets.children[i].destroy();
        }
    };
};

mainGameState.spawnPlayerBullet = function() {
    //Pick sound to play
    this.playerFireSfx[game.rnd.integerInRange(0,4)].play();
   
    var bullet = this.add.sprite(this.playerShip.x, this.playerShip.y, 'bullet-laser');
    bullet.anchor.setTo(0.5, 0.5);
    
    this.game.physics.arcade.enable(bullet);
    bullet.body.velocity.y = -playerBulletSpeed;
    this.bullets.add(bullet);
};



