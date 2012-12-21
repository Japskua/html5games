var gameBoard;
var snake;
var moveDirection = 'right';
var gameExecutor;
var gameSpeed=100;
var roundNum = 1;

var eatenItemsCount =0;
var MAX_FOOD_ITEMS = 12;

var gameFieldRelativeWidth = 50;
var gameFieldRelativeHeight = 50;

var snakeElementWidth = 8;
var snakeElementHeight = 8;

var ESC = 27;
var SPACE = 32;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;

var food;

$(document).ready(function() {
    $('body').keydown(keyPressedHandler);
});

function move() {
  generateFood();
  snake.move(moveDirection);
  
  if(snake.holdsPosition(food.xPos,food.yPos))
    eatFood();
    
  drawSnake();
};

function keyPressedHandler(e) {
  var code = (e.keyCode ? e.keyCode : e.which);
  
  switch(code) {
    case LEFT_ARROW:
      moveDirection = 'left';
      break;
    case UP_ARROW:
      moveDirection = 'up';
      break;
    case RIGHT_ARROW:
      moveDirection = 'right';
      break;
    case DOWN_ARROW:
      moveDirection = 'down';
      break;
    case SPACE:
      startGame();
      break;
    case ESC:
      endGame();
      break;
  }
 }

function startGame() {
  gameBoard = new GameBoard();
  moveDirection = 'right';
  eatenItemsCount = 0;
  roundNum = 1;
  gameSpeed=100;
  endGame();
  gameBoard.clearGameInfo();
  
  snake = new Snake(80,80);
  snake.onCrash(snakeCrashHandler,{xPos:400,yPos:400});
  drawSnake();
  gameExecutor = setInterval(move,gameSpeed);
};
function endGame() {
  if(gameExecutor)
    clearInterval(gameExecutor);
  
  gameBoard.clearBoard();
};

function drawSnake() {
  gameBoard.removeSnakeBody();

  var snakeBody = snake.getBody();
  
  for(var i=0; i<snakeBody.length; i++){
    gameBoard.drawElement('bodypart',snakeBody[i].xPos,snakeBody[i].yPos);
  }
};

function generateFood() {
  if(gameBoard.hasNoCreatedFood()){
    do{
      xpos = Math.floor(Math.random() * gameFieldRelativeWidth) * snakeElementWidth;
      ypos = Math.floor(Math.random() * gameFieldRelativeHeight)* snakeElementHeight;
    }
    while(snake.holdsPosition(xpos,ypos));
    food = {xPos:xpos,yPos:ypos};
    gameBoard.drawElement('food',xpos,ypos);
  }
};

function eatFood() {
  snake.eatFood();
  gameBoard.removeSnakeFood();
  
  eatenItemsCount++;
  if(eatenItemsCount >= MAX_FOOD_ITEMS)
    startNextRound();
  
  gameBoard.updateScore(roundNum);
};

function snakeCrashHandler() {
  endGame();
  gameBoard.showLoseMessage();
};

function startNextRound() {
  roundNum++;
  eatenItemsCount = 0;
  gameBoard.showNextRoundMsg();
  gameSpeed = Math.floor(gameSpeed * 0.8);
  clearInterval(gameExecutor);
  gameExecutor = setInterval(move,gameSpeed);
};

function BodyPart(xpos,ypos,direction) {
  this.xPos=xpos;
  this.yPos=ypos;
  this.direction=direction;;
};