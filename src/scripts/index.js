let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
document.getElementById("start-button").addEventListener("click", play);
// document.getElementById('start-button').addEventListener('click', togglePause);

let left = false;
let right = false;
let gameOver = true;
let score = 0;
let numBalls = 0;
let rad = 30;
let paused = false;

// key funcs
function keyDown(e) {
	if (e.keyCode == 39) {
		right = true;
	}
	else if (e.keyCode == 37) {
		left = true;
	}
}
function keyUp(e) {
	if (e.keyCode == 39) {
		right = false;
	}
	else if (e.keyCode == 37) {
		left = false;
	}
}

let ball = {
	x:[],
	y:[],
	state: []
};

// place ball at random x coordinate
function placeBall() {
	if (Math.random() < .02) {
		ball.x.push(Math.random() * canvas.width - 50);
		ball.y.push(0);
		ball.state.push(true);
	}
	numBalls = ball.x.length;
}

function drawBall() {
	for (let i = 0; i < numBalls; i++) {
		if (ball.state[i] === true) {
      let ballImg = new Image();
      ballImg.src = "./assets/football.png"
      ctx.drawImage(ballImg, ball.x[i], ball.y[i], 30, 20);
		}
	}
}

let catcher = {
	x: 380,
	y: 600,
  w: 80,
  h: 100
};

function drawCatcher() {
  let catcherImg = new Image();
  catcherImg.src = "./assets/catcher.png";
  ctx.drawImage(catcherImg, catcher.x, catcher.y, catcher.w, catcher.h);
}

// moves objects
function playUpdate() {
	if (left && catcher.x > 0) {
		catcher.x -= 10;
	}
	if (right && catcher.x + catcher.w < canvas.width) {
		catcher.x += 10;
	}
	for (let i = 0; i < numBalls; i++) {
		ball.y[i] += 5;
	}
	
	// collision detection
	for (let i = 0; i < numBalls; i++) {
		if (ball.state[i]) {
			if (catcher.x < ball.x[i] + rad && catcher.x + 30 + rad > ball.x[i] && catcher.y < ball.y[i] + rad && catcher.y + 30 > ball.y[i]){
				score++
				ball.state[i] = false;
			}
		}
		if (ball.y[i] + rad > canvas.height) {
			ball.x.shift();
			ball.y.shift();
			ball.state.shift();
		}
	}
}

function endGame() {
	ball.x = [];
	ball.y = [];
	ball.state = [];
	gameOver = true;
}

function play() {
	gameOver = false;
	score = 0;
}

function togglePause() {
  paused = !paused;
  draw();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (!gameOver) {
		drawCatcher();
		drawBall();
		playUpdate();
		placeBall();
		
		ctx.fillStyle = "black";
		ctx.font = "25px Times New Roman";
		ctx.textAlign = "left";
		ctx.fillText("Score: " + score, 50, 30);
  }

	requestAnimationFrame(draw);
}

draw();

