// Based on https://www.udemy.com/code-your-first-game/ by Chris Deleon

var canvas; 
var canvasContext;
var ballx = 50;
var bally = 50;
var ballSpeedx = 5;
var ballSpeedy = 2.5;

var paddleY = 250;
var paddleX = 0;

var deltaX, deltaY = 0;

const paddleHeight = 100;
const paddleWidth = 20;
const puckWidth = 30;
const framesPerSecond = 200;

window.onload = function() {

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	
	setInterval(()=>{
		moveEverything(); 
		drawEverything(); 
	}, 1000/framesPerSecond);

	canvas.addEventListener('mousemove', (e)=>{
		
		let mousePosition = calculateMouse(e);
		setDelta(mousePosition);
		
		paddleX = mousePosition.x - paddleWidth/2;
		paddleY = mousePosition.y - paddleHeight/2;
		
	});
}

/////////////////////////////////////////////////////////////////////////////////
function drawEverything(){


	colorRect(0, 0, canvas.width, canvas.height, 'white');
	
	colorRect(paddleX, paddleY, paddleWidth, paddleHeight, 'black');

	colorCircle('red', ballx, bally, puckWidth);

}


function moveEverything(){
	ballx += ballSpeedx;
	bally += ballSpeedy;
    //wall collision
	if(ballx>canvas.width || ballx<0){
		ballSpeedx = -ballSpeedx;	
	}

	if(bally>canvas.height || bally<0){
		ballSpeedy = -ballSpeedy;
	}
	//paddle collision
	if (ballx < (paddleX + paddleWidth + puckWidth - 5) && ballx > (paddleX - puckWidth + 5) 
	&& bally < (paddleY + paddleHeight + puckWidth - 5) && bally > (paddleY - puckWidth + 5)	){

		ballSpeedx = -(deltaX);
		ballSpeedy = -(deltaY);
	}
	
	//friction
	ballSpeedx = ballSpeedx*.996;
	ballSpeedy = ballSpeedy*.996;

}
///////////////////////////////////////////////////////////////////////////

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(drawColor, centerX, centerY, radius){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}
////////////////////////////////////////////////////////////////////////////////
function calculateMouse(event) {
	let mouseX = event.offsetX;
	let mouseY = event.offsetY;

	return {
		x: mouseX, 
		y: mouseY
	}
}

//////////////////////////////////////////////////////////////////////////////////
function setMinSpeed() {
	if(Math.abs(ballSpeedx)<.2)
		ballSpeedx = Math.sign(ballSpeedx)*.2;

	if(Math.abs(ballSpeedy)<.2)
		ballSpeedy = Math.sign(ballSpeedy)*.2;

}
///////////////////////////////////////////////////////////////////////////////////
function setDelta(mousePosition){

	deltaX = paddleX - mousePosition.x + paddleWidth/2;
	deltaY = paddleY - mousePosition.y + paddleHeight/2;

}
////////////////////////////////////////////////////////////////////////////////////