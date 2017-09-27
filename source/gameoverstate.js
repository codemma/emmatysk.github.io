var gameOverState = { };

gameOverState.preload = function () {
     this.game.load.image('game_over', 'assets/gameoverplanet.png');
    this.game.load.image('button', 'assets/purplebutton.png');
};

gameOverState.create = function () {
   
    this.gameOver = this.add.sprite(this.game.width * 0.5, this.game.height * 0.3, 'game_over');
    this.gameOver.anchor.setTo(0.5, 0.5);
    game.add.tween(this.gameOver).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1500, true);
   
    this.button = game.add.button(this.game.width * 0.5, this.game.height * 0.4, 'button', actionOnClick, this, 2, 1, 0);
    this.button.anchor.setTo(0.5, 0.5);
    
};

function actionOnClick () {
game.state.start("MainGame");
   
}


gameOverState.update = function () {
      
};