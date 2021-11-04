let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
document.getElementById("start-button").addEventListener("click", playAgain);
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
	if(e.keyCode == 39){
		right = false;
	}
	else if(e.keyCode == 37){
		left = false;
	}
}

let ballObj = {
	x:[],
	y:[],
	state: []
};

// place ball at random x coordinate
function placeBall() {
	if (Math.random() < .02) {
		ballObj.x.push(Math.random() * canvas.width - 50);
		ballObj.y.push(0);
		ballObj.state.push(true);
	}
	numBalls = ballObj.x.length;
}

function drawBall() {
	for (let i = 0; i < numBalls; i++) {
		if (ballObj.state[i] === true) {
      let ballImg = new Image();
      ballImg.src = "./assets/football.png"
      ctx.drawImage(ballImg, ballObj.x[i], ballObj.y[i], 30, 20);
			// ctx.beginPath();
			// ctx.arc(ballObj.x[i], ballObj.y[i], rad, 0, Math.PI * 2);
			// ctx.fillStyle = 'blue';
			// ctx.fill();
			// ctx.closePath();
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
	// ctx.beginPath();
	// ctx.rect(player.x, player.y, player.size, player.size);
	// ctx.fillStyle = 'black';
	// ctx.fill();
	// ctx.closePath();
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
		ballObj.y[i] += 5;
	}
	
	// collision detection
	for (let i = 0; i < numBalls; i++) {
		if (ballObj.state[i]) {
			if (catcher.x < ballObj.x[i] + rad && catcher.x + 30 + rad > ballObj.x[i] && catcher.y < ballObj.y[i] + rad && catcher.y + 30 > ballObj.y[i]){
				score++
				ballObj.state[i] = false;
			}
		}
		if (ballObj.y[i] + rad > canvas.height) {
			ballObj.x.shift();
			ballObj.y.shift();
			ballObj.state.shift();
		}
	}
}

function endGame() {
	ballObj.x = [];
	ballObj.y = [];
	ballObj.state = [];
	gameOver = true;
}

function playAgain() {
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

