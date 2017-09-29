const playerShipSpeed = 200;
const playerBulletSpeed = 300;

// Create an empty object
var mainGameState = { };



// Add the preload function
mainGameState.preload = function () {
    
    
    const playerShipSpeed = 200;
   
    this.game.load.image('stars', 'assets/stars3.png');
    this.game.load.image('asteroid', 'assets/asteroid.png');
    this.game.load.image('particle', 'assets/particle.png');
    this.game.load.image('rocket', 'assets/dogrocket.png');
    this.game.load.image('enemy', 'assets/cat3.svg');
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
    starfield = this.game.add.tileSprite(0, 0, 500, 600, 'stars');
    
    //Add particle explosion
    this.emitter = game.add.emitter(0, 0, 100);

    this.emitter.makeParticles('particle');
    this.emitter.gravity = 200;

    //game.input.onDown.add(mainGameState.particleBurst, this);
    
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
    
    //Timers
    this.asteroidTimer = 4.0;
    this.bulletTimer = .3;
    this.enemyTimer = 1.0;
    
    //Level
    this.level = 1;
    
    //Asteroidspeed
    this.asteroidSpeed = 200;
    
    //Groups
    this.asteroids = this.game.add.group();
    this.bullets = this.game.add.group();
    this.enemies = this.game.add.group();
    this.enemyBullets = this.game.add.group();
    
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


mainGameState.particleBurst = function(pointer)  {

    //  Position the emitter where the mouse/touch event was
    this.emitter.x = pointer.x;
    this.emitter.y = pointer.y;

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst
    this.emitter.start(true, 2000, null, 10);

}

function showGame() {
    //document.getElementById("gameContainer").style.display = "block";
 window.scroll({
  top: 2500, 
  left: 0, 
  behavior: 'smooth' 
});
    
setTimeout(function() {  game.state.start("MainGame"); }, 1000);

};


// Collision
mainGameState.onAsteroidBulletCollision = function(object1, object2) {
    
    if (object1.key.includes('asteroid')) {
        this.particleBurst(object1);
    }
    else {
        this.particleBurst(object2);
    }
   
    object1.pendingDestroy =true;
    object2.pendingDestroy = true;
    this.playerScore += 1;
};

// Collision
mainGameState.onAsteroidPlayerCollision = function(object1, object2) {
    if (object1.key.includes('asteroid')) {
        object1.destroy();
    }
    else {
        object2.destroy();
    }
   
    this.playerLives -= 1;
    
    if ( this.playerLives <= 0 ) {
        game.state.start("GameOver");
    }
};

mainGameState.playerOnEnemyCollision = function(object1, object2) {
    if (object1.key.includes('enemy')) {
        this.particleBurst(object1);
        object1.pendingDestroy = true;
        object2.pendingDestroy = true;
    }
    else {
        object2.destroy();
    }
    this.playerScore += 4;
};

mainGameState.enemyOnPlayerCollision = function(object1, object2) {
    
    this.playerLives -= 2;
    
     if (object1.key.includes('bullet-laser')) {
        object1.pendingDestroy = true;
         }
    else {
         object2.pendingDestroy = true;
    }
    
    if ( this.playerLives <= 0 ) {
        game.state.start("GameOver");
    }

};




// UPDATE
mainGameState.update = function() { 
    
    this.scoreValue.setText(this.playerScore);
    this.livesValue.setText(this.playerLives);
    
    if (this.playerScore > this.level * 10) {
        this.level++;
        this.asteroidSpeed =  this.asteroidSpeed*1.05;
    }
    
    
    //Check enemies position
     for (i=0; i<this.enemies.children.length; i++) {
        if (this.enemies.children[i].x < 10) {
            this.enemies.children[i].body.velocity.x = 200;
        }
         else if (this.enemies.children[i].x > game.width-10 && this.enemies.children[i].body.velocity.x>0) {
             this.enemies.children[i].body.velocity.x = -200;
         }
    };
    
    //Spawn enemy
    this.enemyTimer = this.enemyTimer  - game.time.physicsElapsed;
    if(this.enemies.children.length == 0 && this.enemyTimer<=0) {
         this.spawnEnemy();
         this.enemyTimer = 1;
    }
    
    //Spawn enemy bullet
    if (this.enemies.children.length >0 && this.enemyTimer <= 0) {
       enemy = this.enemies.children[game.rnd.integerInRange(0, (this.enemies.children.length)-1)];
     mainGameState.spawnEnemyBullet(enemy.x, enemy.y); 
        this.enemyTimer = 1;
    };
    
    
    
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
    //
    game.physics.arcade.collide(this.enemies, this.bullets, mainGameState.playerOnEnemyCollision, null, this);
    game.physics.arcade.collide(this.playerShip, this.enemyBullets, mainGameState.enemyOnPlayerCollision, null, this);
    
   
    
};

//SPAWN ASTEROID

mainGameState.spawnAsteroid = function() {
    
    
    this.asteroid = this.add.sprite(game.rnd.integerInRange(10, game.width-10), 0, 'asteroid');
    this.asteroid.anchor.setTo(0.5, 0.5);
    
    this.asteroid.scale.setTo(0.3, 0.3);
    this.game.physics.arcade.enable(this.asteroid);
    this.asteroid.body.velocity.y =  this.asteroidSpeed;
    this.asteroids.add(this.asteroid);
    this.asteroid.body.angularVelocity = game.rnd.integerInRange(150, 300);
    
    for (i=0; i<this.asteroids.children.length; i++) {
        if (this.asteroids.children[i].y > 500) {
            this.asteroids.children[i].destroy();
        }
    };
};




//SPAWN Enemy

mainGameState.spawnEnemy = function() {
    //New Asteroid speed
    var enemySpeed = game.rnd.integerInRange(150, 300);
    
    this.enemy = this.add.sprite(game.width, game.rnd.integerInRange(150, 200), 'enemy');
    
    this.enemy.anchor.setTo(0.5, 0.5);
    
    this.enemy.scale.setTo(0.3, 0.3);
    this.game.physics.arcade.enable(this.enemy);
    this.enemy.body.immovable = true;
    this.enemy.body.velocity.x = -enemySpeed;  //OBS
    this.enemies.add(this.enemy);
    
        
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

mainGameState.spawnEnemyBullet = function(x,y) {
    var enemybullet = this.add.sprite(x, y, 'bullet-laser');
    this.game.physics.arcade.enable(enemybullet);
    enemybullet.body.velocity.y = 300;
    if (this.playerShip.x < 200) {
       enemybullet.body.velocity.x = -40; 
    }
    this.enemyBullets.add(enemybullet);
};

