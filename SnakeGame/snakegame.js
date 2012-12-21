// <------- VARIABLES ------->
var DIR_LEFT = "left";
var DIR_RIGHT = "right";
var DIR_DOWN = "down";
var DIR_UP = "up";

var gameBoard;
var snake;
var moveDirection = DIR_RIGHT;
var gameExecutor;
var gameSpeed = 100;
var roundNum = 1;

var eatenItemsCount = 0;
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

// <------- END OF VARIABLES ------->

$(document).ready(function ()
{
    $("body").keydown(keyPressedHandler);
});  // End of document.ready

function move() {
    generateFood();
    snake.move(moveDirection);

    if (snake.holdsPosition(food.xPos, food.yPos))
        eatFood();

    drawSnake();
}; // End of move();

function keyPressedHandler(e) {
    // Get the pressed even code
    var code = (e.keyCode ? e.keyCode : e.which);

    // Switch accordingly
    switch(code) {
        case LEFT_ARROW:
            moveDirection = DIR_LEFT;
            break;
        case UP_ARROW:
            moveDirection = DIR_UP;
            break;
        case DOWN_ARROW:
            moveDirection = DIR_DOWN;
            break;
        case RIGHT_ARROW:
            moveDirection = DIR_RIGHT;
            break;
        case SPACE:
            startGame();
            break;
        case ESC:
            endGame();
            break;
    } // End of switch(code)

}; // End of keyPressedHandler()

function startGame() {
    gameBoard = new GameBoard();
    
    // This is fired when the game is ending
    // So default the values
    moveDirection = DIR_RIGHT;
    eatenItemsCount = 0;
    roundNum = 1;
    gameSpeed = 100;
    
    // Finally, end game
    endGame();
    gameBoard.clearGameInfo();

    snake = new Snake(80, 80);
    snake.onCrash(snakeCrashHandler, { xPos: 400, yPos: 400 });
    drawSnake();
    gameExecutor = setInterval(move, gameSpeed);

}; // End of startGame()

function endGame() {
    if (gameExecutor)
        clearInterval(gameExecutor);

    gameBoard.clearBoard();
}; // End of endGame()


function drawSnake() {
    // Remove the current body
    gameBoard.removeSnakeBody();

    // Get the new location
    var snakeBody = snake.getBody();

    // Loop through the body parts and draw them
    for(var i=0; i<snakeBody.length; i++) {
        gameBoard.drawElement("bodypart", snakeBody[i].xPos, snakeBody[i].yPos);
    } // End of for

}; // End of drawSnake()

function generateFood() {
    if (gameBoard.hasNoCreatedFood()) {
        do {
            xPos = Math.floor(Math.random() * gameFieldRelativeWidth) * snakeElementWidth;
            yPos = Math.floor(Math.random() * gameFieldRelativeHeight) * snakeElementHeight;
        }
        while (snake.holdsPosition(xPos, yPos));

        food = { xPos: xPos, yPos: yPos };
        gameBoard.drawElement("food", xPos, yPos);
    } // End of if
}; // End of generateFood()

function eatFood() {
    snake.eatFood();
    gameBoard.removeSnakeFood();

    eatenItemsCount++;
    if (eatenItemsCount >= MAX_FOOD_ITEMS)
        startNextRound();

    gameBoard.updateScore(roundNum);
}; // End of eatFood()


function snakeCrashHandler() {
    endGame();
    gameBoard.showLoseMessage();
}; // End of snakeCrashHandler()


function startNextRound() {
    roundNum++;
    eatenItemsCount = 0;
    gameBoard.showNextRoundMsg();
    gameSpeed = Math.floor(gameSpeed * 0.8);
    clearInterval(gameExecutor);
    gameExecutor = setInterval(move, gameSpeed);
}; // End of startNextRound()

// Bodypart definitions
function BodyPart(xpos, ypos, direction) {
    this.xPos = xpos;
    this.yPos = ypos;
    this.direction = direction;
}; // End of BodyPart(...)

function Snake(startX, startY) {
    var moveStep = 8;
    var bodyParts = [new BodyPart(startX, startY, DIR_RIGHT)];
    var reverseDirections = { "right": "left", "left": "right", "up": "down", "down": "up" };
    var gameRegion;
    var onCrashCallback;
    var self = this;

    this.eatFood = function () {
        bodyParts.push(getNewTail());
    };  // End of this.eatFood

    this.move = function (newDirection) {
        if (isReverseDirection(newDirection))
            reverseBodyMove();

        var newHead = getNewHead(newDirection);

        // Check for crash
        if (crash(newHead))
            onCrashCallback();
        else {
            for (var i = bodyParts.length - 1; i > 0; i--) {
                bodyParts[i] = bodyParts[i - 1];
            } // End of for
            bodyParts[0] = newHead;
        } // End of else

    };      // End of this.move


    this.getBody = function () {
        return bodyParts;
    };  // End of this.getBody

    this.holdsPosition = function (xpos, ypos) {
        for (var i = 0; i < bodyParts.length; i++) {
            if (bodyParts[i].xPos == xpos && bodyParts[i].yPos == ypos)
                return true;
        } // End of for
        return false;
    };   // End of this.holdsPosition

    this.onCrash = function (crashCallback, fieldSize) {
        gameRegion = fieldSize;
        onCrashCallback = crashCallback;
    };   // End of this.onCrash

    var getNewHead = function (direction) {
        var currentHead = bodyParts[0];

        switch (direction) {
            case DIR_RIGHT:
                return new BodyPart(currentHead.xPos + moveStep, currentHead.yPos, direction);
                break;
            case DIR_LEFT:
                return new BodyPart(currentHead.xPos - moveStep, currentHead.yPos, direction);
                break;
            case DIR_UP:
                return new BodyPart(currentHead.xPos, currentHead.yPos - moveStep, direction);
                break;
            case DIR_DOWN:
                return new BodyPart(currentHead.xPos, currentHead.yPos + moveStep, direction);
                break;
        }; // End of switch(direction)
    };  // End of getNewHead

    var getNewTail = function () {
        var currentTail = bodyParts[bodyParts.length - 1];
        var tailDirection = currentTail.direction;

        switch (tailDirection) {
            case DIR_RIGHT:
                return new BodyPart(currentTail.xPos - moveStep, currentTail.yPos, tailDirection);
                break;
            case DIR_LEFT:
                return new BodyPart(currentTail.xPos + moveStep, currentTail.yPos, tailDirection);
                break;
            case DIR_UP:
                return new BodyPart(currentTail.xPos, currentTail.yPos + moveStep, tailDirection);
                break;
            case DIR_DOWN:
                return new BodyPart(currentTail.xPos, currentTail.yPos - moveStep, tailDirection);
                break;

        }; // End of switch(tailDirection)
    };       // End of getNewTail

    var crash = function (head) {
        // Check if the boundaries are hit
        if (head.Xpos >= gameRegion.xPos
          || head.yPos >= gameRegion.yPos
          || head.xPos < 0
          || head.yPos < 0
          || self.holdsPosition(head.Xpos, head.yPos))
            return true;

        // Otherwise return false
        return false;
    };   // End of crash

    var isReverseDirection = function (newDirection) {
        var currentHeadDirection = bodyParts[0].direction;
        return newDirection == reverseDirections[currentHeadDirection];
    };   // End of isReverseDirection


    var reverseBodyMove = function () {
        var tmpBodyPart;
        var halfBodyLength = Math.floor(bodyParts.length / 2);
        var bodyLenght = bodyParts.length - 1;

        for (var i = 0; i < halfBodyLength; i++) {
            tmpBodyPart = bodyParts[i];
            bodyParts[i] = bodyParts[bodyLenght - i];
            bodyParts[bodyLenght - i] = tmpBodyPart;
            bodyParts[i].direction = reverseDirections[bodyParts[i].direction];
            bodyParts[bodyLenght - 1].direction = reverseDirections[bodyParts[bodyLenght - i]];
        } // End of for
    };          // End of reverseBodyMove

}; // End of Snake(...)

function GameBoard() {

    this.drawElement = function (classname, xpos, ypos) {
        var $element = $("<div/>").addClass(classname);
        $element.css("top", ypos + "px").css("left", xpos + "px");
        $("#gameField").append($element);
    };    // End of drawElement

    this.clearBoard = function () {
        $("div.bodypart").remove();
        $(".food").remove();
    };   // End of clearBoard

    this.clearGameInfo = function () {
        $("#score").html("0");
        $("#loseMsg").css("visibility", "hidden");
        $("#speed").html("1");
    };    // End of clearGameInfo

    this.hasNoCreatedFood = function () {
        return $(".food").length == 0;
    };  // End of hasNoCreatedFood

    this.removeSnakeBody = function () {
        $("div.bodypart").remove();
    };  // End of removeSnakeBody

    this.removeSnakeFood = function () {
        $(".food").remove();
    };  // End of removeSnakeFood

    this.updateScore = function () {
        var $currentScore = Number($("#score").html());
        $currentScore += currentRound;
        $("#score").html($currentScore);
    };    // End of updateScore

    this.showLoseMessage = function () {
        $("#loseMsg").css("visibility", "visible");
    };  // End of showLoseMessage

    this.showNextRoundMsg = function () {
        $("#nextRndMsg").hide().css({ visibility: "visible" }).fadeIn(2000);
        $("#nextRndMsg").fadeOut(2000, function () {
            $(this).show().css({visibility:"hidden"})';'
        }); // End of nextRndMsg.fadeOut()

        var $currentSpeed = Number($("#speed").html());
        $currentSpeed++;
        $("#speed").html($currentSpeed);

    };   // End of showNextRoundMsg

}; // End of GameBoard()