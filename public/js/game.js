var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const MAX_SCORE = 3;

var showingWinScreen = false;

var player1Y = 250;
var player2Y = 250;

const PLAYER_WIDTH = 10;
const PLAYER_HEIGHT = 100;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }
}

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  };
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);  

  canvas.addEventListener('mousemove', 
    function(evt) {
      var mousePos = calculateMousePos(evt);
      player1Y = mousePos.y - (PLAYER_HEIGHT/2);
    });
}

function ballReset() {
  if (player1Score >= MAX_SCORE || player2Score >= MAX_SCORE) {
    showingWinScreen = true;
  };

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement() {
  var player2YCenter = player2Y + (PLAYER_HEIGHT/2);

  if (player2YCenter < ballY - 35) {
    player2Y += 6;
  } else if (player2YCenter > ballY + 35) {
    player2Y -= 6;
  };
}

function moveEverything() {
  if (showingWinScreen == true) {
    return;
  };

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
    if (ballY > player1Y && ballY < player1Y+PLAYER_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      // speed up ball when collision on edges
      var deltaY = ballY - (player1Y + PLAYER_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++;
      ballReset();      
    }    
  };
  if (ballX > canvas.width) {
    if (ballY > player2Y && ballY < player2Y+PLAYER_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      // speed up ball when collision on edges
      var deltaY = ballY - (player2Y + PLAYER_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();      
    }
  };
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  };
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  };
}

function drawNet() {
  for (var i = 10; i < canvas.height; i+=40) {
    colorRect(canvas.width/2-1, i, 2, 20, 'white');
  };
}

function drawEverything() {
  // black screen
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  if (showingWinScreen) {
    canvasContext.fillStyle = 'white';

    if (player1Score >= MAX_SCORE) {
      canvasContext.font="30px Arial";
      canvasContext.fillText("You Won !", canvas.width/2 - 75, 200);
    } else if (player2Score >= MAX_SCORE) {
      canvasContext.font="30px Arial";
      canvasContext.fillText("Computer Won !", canvas.width/2 - 110, 200);
    };

    canvasContext.font="14px Arial";
    canvasContext.fillText("click to restart the game", canvas.width/2 - 80, 300);   
    
    return;
  };

  drawNet();

  // left player
  colorRect(0, player1Y, PLAYER_WIDTH, PLAYER_HEIGHT, 'white');

  // right player (computer)
  colorRect(canvas.width - PLAYER_WIDTH, player2Y, PLAYER_WIDTH, PLAYER_HEIGHT, 'white');

  // ball
  colorCircle(ballX, ballY, 10, 'white');

  canvasContext.font="30px Arial";
  canvasContext.fillText(player1Score, 100, 50);
  canvasContext.fillText(player2Score, canvas.width - 100, 50);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}