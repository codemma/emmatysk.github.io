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
};

// Add the create function
mainGameState.create = function () {
   
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = "#0E243B";
    
    //Asteroid timer
    this.asteroidTimer = 2.0;
    
    //Bullet timer
    this.bulletTimer = .3;
    
    //Create field of stars
    starfield = this.game.add.tileSprite(0, 0, 400, 600, 'stars');
    
    //Asteroid group
    this.asteroids = this.game.add.group();
    
    //Bullet group
    this.bullets = this.game.add.group();
    
    //Create music
    this.music = this.game.add.audio('mainmusic');
    this.music.play();
    this.music.loopFull();
    
    //Position of player
    var playerX = this.game.width * 0.5;         // Middle of the screen
    var playerY = this.game.height * 0.95;

    //Adding ship
    this.playerShip = this.add.sprite(playerX, playerY, 'rocket');
    this.playerShip.anchor.setTo(0.5, 0.5);
    this.playerShip.scale.setTo(.3, .3);
    
    this.game.world.bringToTop(this.playerShip);


    //Allow phycis on playership
    this.game.physics.arcade.enable(this.playerShip);

    //Track input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
};

// UPDATE
mainGameState.update = function() { 
    
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
   
    var bullet = this.add.sprite(this.playerShip.x, this.playerShip.y, 'bullet-laser');
    bullet.anchor.setTo(0.5, 0.5);
    
    this.game.physics.arcade.enable(bullet);
    bullet.body.velocity.y = -playerBulletSpeed;
    this.bullets.add(bullet);
    
     
};



