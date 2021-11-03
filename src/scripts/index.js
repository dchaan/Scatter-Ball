let canvas = document.getElementById("canvas");
let contxt = canvas.getContext("2d");
let lefty = false;
let righty = false;
let gameOver = true;
let score = 0;
let lives = 3;
let track = 0;
let level = 1;

document.addEventListener("keydown", keysDown, false);
document.addEventListener("keyup", keysUp, false);

// when key is pressed down, move
function keysDown(e) {
	if(e.keyCode == 39){
		righty = true;
	}
	else if(e.keyCode == 37){
		lefty = true;
	}
	else if(e.keyCode == 32 && gameOver){
		playAgain();
	}
}
// when key is released, stop moving
function keysUp(e) {
	if(e.keyCode == 39){
		righty = false;
	}
	else if(e.keyCode == 37){
		lefty = false;
	}
}

// player specs
let player = {
	size: 40,
	x: (canvas.width - 30),
	y: canvas.height - 30,
};

// specs for balls you want to collect
let ballObj = {
	x:[],
	y:[],
	speed: 1,
	state: []
};

let numBalls = 0;
let rad = 10;

// adds value to x property of ballObj
function drawNewGood(){
	if(Math.random() < .02){
		ballObj.x.push(Math.random() * canvas.width);
		ballObj.y.push(0);
		ballObj.state.push(true);

	}
	numBalls = ballObj.x.length;
}

// draws balls
function drawBall() {
	for(let i = 0; i < numBalls; i++){
		if(ballObj.state[i] === true){
			contxt.beginPath();
			contxt.arc(ballObj.x[i], ballObj.y[i], rad, 0, Math.PI * 2);
			contxt.fillStyle = 'blue';
			contxt.fill();
			contxt.closePath();
		}
	}
}

// draw player
function drawPlayer() {
	contxt.beginPath();
	contxt.rect(player.x, player.y, player.size, player.size);
	contxt.fillStyle = 'black';
	contxt.fill();
	contxt.closePath();
}

// moves objects in play
function playUpdate() {
	if(lefty && player.x > 0){
		player.x -= 6;
	}
	if(righty && player.x + player.size < canvas.width) {
		player.x += 6;
	}
	for(let i = 0; i < numBalls; i++){
		ballObj.y[i] += ballObj.speed;
	}
	
	
	// collision detection
	for(let i = 0; i < numBalls; i++){
		if(ballObj.state[i]){
			if(player.x < ballObj.x[i] + rad && player.x + 30 + rad> ballObj.x[i] && player.y < ballObj.y[i] + rad && player.y + 30 > ballObj.y[i]){
				score++
				ballObj.state[i] = false;
			}
		}
		if(ballObj.y[i] + rad > canvas.height){
			ballObj.x.shift();
			ballObj.y.shift();
			ballObj.state.shift();
			track++;
		}
	}
	
	// switch(score){
	// 	case 20:
	// 		ballObj.speed = 2;
	// 		level = 2;
	// 		break;
	// 	case 30:
	// 		level = 3;
	// 		break;
	// 	case 40: 
	// 		ballObj.speed = 3;
	// 		level = 4;
	// 		break;
	// 	case 50:
	// 		level = 5;
	// 		break;
	// }

}
//signals end of game and resets x, y, and state arrays for arcs
function gamesOver(){
	ballObj.x = [];
	ballObj.y = [];
	ballObj.state = [];
	gameOver = true;
}

//resets game, life, and score counters
function playAgain() {
	gameOver = false;
	level = 1;
	score = 0;
	lives = 3;
	ballObj.speed = 1;
}
function draw(){
	contxt.clearRect(0, 0, canvas.width, canvas.height);
	if(!gameOver){
		drawPlayer();
		drawBall();
		playUpdate();
		drawNewGood();
			
		//score
		contxt.fillStyle = "black";
		contxt.font = "20px Helvetica";
		contxt.textAlign = "left";
		contxt.fillText("Score: " + score, 10, 25);
	
		//lives
		contxt.textAlign = "right";
		contxt.fillText("Lives: " + lives, 500, 25);
	}
	else{
		contxt.fillStyle = "black";
		contxt.font = "50px Helvetica";
		contxt.textAlign = "center";
		contxt.fillText("GAME OVER!", canvas.width/2, 175);
		
		contxt.font = "20px Helvetica";
		contxt.fillText("PRESS SPACE TO PLAY", canvas.width/2, 475);
		
		contxt.fillText("FINAL SCORE: " + score, canvas.width/2, 230);
	}
	// document.getElementById("level").innerHTML = "Level: " + level;
	requestAnimationFrame(draw);
}

draw();

