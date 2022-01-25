let config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

let balls;
let blocks = [];
let basket;
let cursors;
let scoreText;
let livesText;
let gameOverText;
let pauseButton;
let lives = 3;
let score = 0;
let gameOver = false;
let isPaused = false;

function preload() {
  this.load.image("background", "assets/bg.jpg");
  this.load.image("block", "assets/red_ball.png");
  this.load.image("balls", "assets/shinyball.png");
  this.load.image("basket", "assets/basket.png");
  this.load.image("border", "assets/border.png");
  this.load.image("strip2", "assets/strip2.png");
  this.load.image("strip1", "assets/strip1.png");
  this.load.image("popup", "assets/popup.png");
  this.load.image("play_btn", "assets/play_btn.png");
  this.load.image("retry_btn", "assets/retry_btn.png");
  this.load.image("pause_btn", "assets/pause_btn.png");
}

function create() {
  this.add.image(300, 400, "background").setScale(0.5);

  balls = this.physics.add.group({
    key: "balls",
    frameQuantity: 3,
    setXY: { x: 150, y: 0, stepX: 150 },
  });

  balls.children.iterate(function (ball) {
    ball.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
    ball.setCollideWorldBounds(Phaser.Math.FloatBetween(0.4, 0.8));
    ball.setData("active", true);
    ball.setCircle(16);
    ball.depth = 10;
  });

  for (let i = 1; i < 9; i++) {
    blocks[i] = this.physics.add.staticGroup({
      key: "block",
      frameQuantity: 7,
    });

    if (i % 2 == 0) {
      Phaser.Actions.PlaceOnLine(blocks[i].getChildren(), new Phaser.Geom.Line(65, i * 65 + 65, 545, i * 65 + 65));
    } else {
      Phaser.Actions.PlaceOnLine(blocks[i].getChildren(), new Phaser.Geom.Line(102.5, i * 65 + 65, 582.5, i * 65 + 65));
    }

    blocks[i].children.iterate(function (block) {
      block.setCircle(8);
    });

    blocks[i].refresh();

    this.physics.add.collider(balls, blocks[i]);
  }

  this.physics.add.collider(balls, balls);

  basket = this.physics.add.image(300, 750, "basket").setScale(0.1);
  basket.setCollideWorldBounds();
  basket.setBodySize(1050, 1000, false);
  basket.depth = 11;

  let border = this.physics.add.staticGroup();
  border.create(1, 400, "strip1").refreshBody();
  border.create(596, 400, "strip1").refreshBody();
  border.create(300, 806, "strip2").refreshBody();
  let downbr = this.physics.add.staticGroup();
  downbr.create(300, 804, "strip2").refreshBody();

  this.physics.add.collider(border, balls);

  let basketcd = this.physics.add.overlap(basket, balls, collectBall, null, this);
  let bordercd = this.physics.add.collider(downbr, balls, collectFail, null, this);

  this.physics.add
    .staticGroup({
      key: "border",
      setXY: { x: 300, y: 400 },
    })
    .children.iterate(function (child) {
      child.setScale(0.58, 0.44);
      child.depth = 12;
    });

  scoreText = this.add.text(30, 25, "Score: " + score, { font: "25px Georgia Black", fill: "#fff", fontWeight: "bold" });
  livesText = this.add.text(30, 58, "Life: " + lives, { font: "25px Georgia Black", fill: "#fff", fontWeight: "bold" });
  gameOverText = this.add.text(190, 380, "", { font: "50px Georgia Black", fill: "#fff", fontWeight: "bold", align: "center" });

  pauseButton = this.add.image(530, 50, "pause_btn").setInteractive({ cursor: "pointer" });
  pauseButton.name = "pause_btn";
  pauseButton.setScale(0.9);

  this.input.on("gameobjectdown", pauseGame, this);

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    basket.setVelocityX(-400);
  } else if (cursors.right.isDown) {
    basket.setVelocityX(400);
  } else {
    basket.setVelocityX(0);
  }
}

function collectBall(player, ball) {
  let active = ball.getData("active");
  if (active) {
    ball.disableBody(true, true);
    score += 1;
    scoreText.setText("Score: " + score);
    ball.enableBody(true, Phaser.Math.RND.between(75, 525), 0, true, true);
  }
}

function collectFail(border, ball) {
  let active = ball.getData("active");
  if (active) {
    ball.setData("active", false);
    lives -= 1;
    livesText.setText("Life: " + lives);
    if (lives > 0) {
      ball = balls.create(Phaser.Math.RND.between(75, 525), 0, "balls").refreshBody();
      ball.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
      ball.setCollideWorldBounds(Phaser.Math.FloatBetween(0.4, 0.8));
      ball.setData("active", true);
      ball.setCircle(16);
      ball.depth = 10;
    } else {
      gameOverText.setText("Game Over");
      pauseButton.setTexture("retry_btn");
      this.physics.pause();
      gameOver = true;
    }
  }
}

function pauseGame(pointer, button) {
  if (!gameOver) {
    if (button.name == "pause_btn") {
      if (isPaused) {
        pauseButton.setTexture("pause_btn");
        gameOverText.setText("");
        this.physics.resume();
        isPaused = false;
      } else {
        pauseButton.setTexture("play_btn");
        gameOverText.setText("Game Paused");
        this.physics.pause();
        isPaused = true;
      }
    }
  } else {
    this.scene.restart();
    gameOver = false;
    isPaused = false;
    lives = 3;
    score = 0;
  }
}
