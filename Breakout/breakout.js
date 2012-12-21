$(document).ready(function() {

	var x = 25;
	var y = 250;
	var dx = 1.5;
	var dy = -4;
	var WIDTH;
	var HEIGHT;
	var context;
	var intervalId = 0;

	// Canvas variables
	var canvasMinX = 0;
	var canvasMaxX = 0;

	// Paddle variables
	var paddleX;
	var paddleH = 10;
	var paddleW = 75;

	// Keyboard variables
	rightDown = false;
	leftDown = false;

	// Color settings
	var ballr = 10;
	var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
	var paddlecolor = "#FFFFFF";
	var ballcolor = "#FFFFFF";
	var backcolor = "#000000";

	function init() {
		// Get the canvas context
		context = $("#canvas")[0].getContext("2d");
		WIDTH = $("#canvas").width();
		HEIGHT = $("#canvas").height();

		paddleX = WIDTH / 2;

		canvasMinX = $("#canvas").offset().left;
		canvasMaxX = canvasMinX + WIDTH;

		intervalId = setInterval(draw, 10);
		return intervalId;
	}; // End of init()

	function circle(x, y, r) {
		context.beginPath();
		context.arc(x, y, r, 0, Math.PI*2, true);
		context.closePath();
		context.fill();
	}; // End of circle()

	function rect(x, y, w, h) {
		context.beginPath();
		context.rect(x, y, w, h);
		context.closePath();
		context.fill();
	}; // End of rect()

	function clear() {
		context.clearRect(0, 0, WIDTH, HEIGHT);
	}; // End of clear()

	function draw() {
		context.fillStyle = backcolor;
		clear();
		//context.fillStyle = ballcolor;
		circle(x, y, ballr);

		// Move the paddle left or right if key pressed
		if (rightDown)
			paddleX += 5;
		else if (leftDown)
			paddleX -= 5;

		// Draw the paddle
		//context.fillStyle = paddlecolor;
		rect(paddleX, HEIGHT-paddleH, paddleW, paddleH);

		// Draw the bricks
		drawbricks();



		// BRICK COLLISION
		rowheight = BRICKHEIGHT + PADDING;
		colwidth = BRICKWIDTH + PADDING;
		row = Math.floor(y/rowheight);
		col = Math.floor(x/colwidth);

		// If hit, change ball direction
		// and mark the ball hit
		if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
			dy = -dy;
			bricks[row][col] = 0;
		}

		// Check for bouncing of side walls
		if (x + dx + ballr > WIDTH || x + dx - ballr < 0)
			dx = -dx;

		// Check for bouncing of up & down walls + paddle
		if (y + dy - ballr < 0)
			dy = -dy;
		else if (y + dy + ballr > HEIGHT - paddleH) {
			if ( x > paddleX && x < paddleX + paddleW) {
				// Move the ball based on where it hit the paddle
				dx = 8* ((x-(paddleX+paddleW/2))/paddleW);
				dy = -dy;
			}
			else {
				// Game over, stop animation
				clearInterval(intervalId);

			} // end of else

		} // end of else if()

		x += dx;
		y += dy;
	}; // End of draw()


// <<------- KEYBOARD CONTROLS --------->>

	function onKeyDown(event) {
		if (event.keyCode == 39)
			rightDown = true;
		else if (event.keyCode == 37) 
			leftDown = true;
	}; // End of onKeyDown()

	function onKeyUp(event) {
		if (event.keyCode == 39)
			rightDown = false;
		if (event.keyCode == 37)
			leftDown = false;
	}; // End of onKeyUp()


$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

// <<--------- END OF KEYBOARD CONTROLS ------------>

// <<--------- MOUSE CONTROLS ------------>

function init_mouse() {

}; // End of init_mouse()

function onMouseMove(event) {
	if (event.pageX > canvasMinX && event.pageX < canvasMaxX ) {
		paddleX = Math.max(event.pageX - canvasMinX - (paddleW/2), 0);
		paddleX = Math.min(WIDTH - paddleW, paddleX);
	}
}; // End of onMouseMove()

$(document).mousemove(onMouseMove);


// <<--------- END OF MOUSE CONTROLS ------------>



// <<--------- BRICKS ------------>

var bricks;
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;

function initbricks() {
	NROWS = 5;
	NCOLS = 5;
	BRICKWIDTH = (WIDTH/NCOLS) - 1;
	BRICKHEIGHT = 15;
	PADDING = 1;

	// Populate bricks
	bricks = new Array(NROWS);
	for (i=0; i<NROWS; i++) {
		bricks[i] = new Array(NCOLS);
		for (j=0; j < NCOLS; j++) {
			bricks[i][j] = 1;
		} // End of for j
	} // End of for i

}; // End of initbricks()


function drawbricks() {
	// Draw the bricks
	for (i=0; i<NROWS; i++) {
		// Set the color for row
		context.fillStyle = rowcolors[i];
		for (j=0; j<NCOLS; j++) {
			if (bricks[i][j] == 1) {
				rect((j * (BRICKWIDTH + PADDING)) + PADDING,
					 (i * (BRICKHEIGHT + PADDING)) + PADDING,
					  BRICKWIDTH, BRICKHEIGHT);
			}
		} // End of for j
	} // End of for i

} // End of drawbricks()

// <<--------- END OF BRICKS ------------>

init();
init_mouse();
initbricks();


});  // End of document.ready()