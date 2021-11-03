// get a refrence to the canvas and its context
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// drop marble every 4sec
let dropRate = 4000;
// set how fast the objects will fall
let marbleSpeed = 0.70;
// when last marble was dropped
let lastDropped = -1;
// this array holds all spawned object
let marbles = [];
// start animating
animate();


function generateMarble() {
    let object = {
        // set x randomly but at least 15px off the canvas edges
        x: Math.random() * (canvas.width - 30) + 15,
        // set y to start on the line where marbles are spawned
        y: 0,
    }
    marbles.push(object);
}

function animate() {
    // get the elapsed time
    let time = Date.now();
    // see if its time to spawn a new object
    if (time > (lastDropped + dropRate)) {
        lastDropped = time;
        generateMarble();
        dropRate*=1;
    }

    // request another animation frame
    requestAnimationFrame(animate);

    // clear the canvas so all marbles can be 
    // redrawn in new positions
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the line where new marbles are spawned
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    // move each marble down the canvas
    for (let i = 0; i < marbles.length; i++) {
        let marble = marbles[i];
        marble.y += marbleSpeed;
        ctx.beginPath();
        ctx.arc(marble.x, marble.y, 15, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill();
    }

}