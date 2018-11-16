// N = Aantekening (Note) van Marlein (voor haarzelf)

//INIT CANVAS + SCREEN CONFIGURATION

    //get our drawwable canvas
    const canvasEl = document.getElementById('canvas');
    // N -- The HTMLCanvasElement.getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.
    const context = canvasEl.getContext('2d');

    //grid and canvas size
    const gridSizeX = 128;
    const gridSizeY = 80;
    const width = canvasEl.width = gridSizeX;
    const height = canvasEl.height = gridSizeY;
    const backgroundColor = "#515151";


//GAME VARIABLES

//speed is in units per second, a unit is a square on the playfield
let ballSpeedX = -25;
let ballSpeedY = -10;
let ballacceleration = 1.3
let ballSizeX = 1;
let ballSizeY = 1;
let ballColor = "#FFFF00";
let ballPositionX = Math.round(gridSizeX * .5); 
let ballPositionY = Math.round(gridSizeY * .5);

let batSpeedY = 40;

let batSizeX = 1;
let batSizeYPart = 4
let batSizeY = 3 * batSizeYPart

let bat1ColorMiddle = "#0000FF";
let bat1ColorTopBottom = "#FF0000"
let bat2ColorMiddle = "#0000FF";
let bat2ColorTopBottom = "#00FF00";

let bat1PositionX = 1;
let bat1PositionY = Math.round((gridSizeY - batSizeY * .5) * .5);  // N -- (80 - 12 * .5) *.5 = 74 * .5 = 37 
let bat2PositionX = gridSizeX - 2;
let bat2PositionY = Math.round((gridSizeY - batSizeY * .5) * .5); // N -- 37

let bat1movingUp = false;
let bat1movingDown = false;
let bat2movingUp = false; 
let bat2movingDown = false;

let scoreLeft = 0;
let scoreRight = 0;
let player1Text = "Player 1";
let player2Text = "Player 2";

let gameOver = false;

//RENDER FUNCTIONS

/**
 * Draw a rectangle at given position and given size with given color
 * N -- The param tag provides the name, type, and description of a function parameter.
 * N -- The parameter's type is enclosed in curly brackets
 * @param {number} xPos 
 * @param {number} yPos 
 * @param {number} xWidth 
 * @param {number} yWidth 
 * @param {string} color example and default: "#FFFFFF"
 */
function drawRectangle(xPos, yPos, width, height, color = "#FFFFFF") {
    context.fillStyle = color;
    // N -- fillRect = built-in function
    context.fillRect(Math.round(xPos), Math.round(yPos), width, height);
}

/**
 * Draws the current score
 */

function drawScore() {
    context.textAlign = "center";
    context.font = "12px 'MS UI Gothic'";
    context.fillStyle = "#FFFFFF";
    context.fillText(scoreLeft + " - " + scoreRight, gridSizeX * .5, 10);

    if(gameOver) {
        context.fillText("GG", gridSizeX * .5, 20);
    }
}

/**
 * Actually draws the background, the players and the ball
 */
function drawGame() {
    //draw the background
    // N-- 0, 0, 128, 80, zwart
    drawRectangle(0,0,width,height, backgroundColor);

    //draw player 1 (middle)
    // N-- initially 1, 37, 1, 12, groen
    drawRectangle(bat1PositionX, bat1PositionY, batSizeX, batSizeYPart, bat1ColorTopBottom);
    drawRectangle(bat1PositionX, bat1PositionY + batSizeYPart, batSizeX, batSizeYPart, bat1ColorMiddle);
    drawRectangle(bat1PositionX, bat1PositionY + batSizeYPart * 2, batSizeX, batSizeYPart, bat1ColorTopBottom);

    //draw player 2
    // N-- initially  126, 37, 1, 12, paars
    drawRectangle(bat2PositionX, bat2PositionY, batSizeX, batSizeYPart, bat2ColorTopBottom);
    drawRectangle(bat2PositionX, bat2PositionY + batSizeYPart, batSizeX, batSizeYPart, bat2ColorMiddle);
    drawRectangle(bat2PositionX, bat2PositionY + batSizeYPart * 2, batSizeX, batSizeYPart, bat2ColorTopBottom);

    //draw ball
    // N-- initially 64, 40, 1, 1, rood
    drawRectangle(ballPositionX, ballPositionY, ballSizeX, ballSizeY, ballColor);

    //draw the score
    drawScore();
}




//GAMELOOP

    console.log('setOriginal buiten update met 2: ', setOriginalBallSpeed(2))

    /**
     * Restarts the game
     */
    function setOriginalBallSpeed() {
        if (ballSpeedX > 0) {
            ballSpeedX = -25;
            return ballSpeedX;
        } else {
            ballSpeedX = 25;
            return ballSpeedX;
        }
    }

    function restart() {
        setTimeout(function() {
            //change game over to false
            gameOver = false;

            //reset all the positions
            ballPositionX = Math.round(gridSizeX * .5);
            ballPositionY = Math.round(gridSizeY * .5);
            bat1PositionX = 1;
            bat1PositionY = Math.round((gridSizeY - batSizeY * .5) * .5);
            
            bat2PositionX = gridSizeX - 2;
            bat2PositionY = Math.round((gridSizeY - batSizeY * .5) * .5);

            //give the ball a random direction
            ballSpeedX = ( 10 + (Math.random() * 40) ) * (Math.random() > .5 ? -1 : 1); // N-- 10 <= X < 50 || -50 < X <= 10
            ballSpeedY = ( 10 + (Math.random() * 20) ) * (Math.random() > .5 ? -1 : 1); // N-- 10 <= X < 30 || -30 < X <= 10

        }, 2000); // N -- Changed to 2000 (instead of 1000)
    }

    let deltaTime = 0;
    let lastTime = performance.now();
    let now = performance.now();

    //update is called every frame
    function update() {

        //calculate the time difference (deltaTime) with last frame
        now = performance.now();
        deltaTime = (now - lastTime) * .001;
        lastTime = now;
        
        //move ball
        // N -- ballPositionX === initially 64.
        
        ballPositionX = ballPositionX + ballSpeedX * deltaTime;
        ballPositionY = ballPositionY + ballSpeedY * deltaTime;
        
        //for colission checking we will use a rounded ball position so we can check if a ball is matching an exact round number
        let roundedBallPositionX = Math.round(ballPositionX);
        let roundedBallPositionY = Math.round(ballPositionY);
        
        //check for ball colission with player 1
        if (roundedBallPositionX === bat1PositionX) { //check if the ballposition is the same as the players x position
            if(
                (roundedBallPositionY >= bat1PositionY && //the rounded ballPosition is greater or equal to the position of the bat
                roundedBallPositionY < bat1PositionY + batSizeYPart) 
                ||
                (roundedBallPositionY >= bat1PositionY + 2 * batSizeYPart &&
                    roundedBallPositionY < bat1PositionY + 3 * batSizeYPart)
                //the rounded ballPosition is smaller than the batPosition plus its size
                //if both statements are true we are connecting vertically with the bat
            ) {
                //ball collided with player so we reverse it's xSpeed so we have a "bounce"
                setOriginalBallSpeed()
            } else if (
                roundedBallPositionY >= bat1PositionY + 1 * batSizeYPart &&
                    roundedBallPositionY < bat1PositionY + 2 * batSizeYPart) {
                ballSpeedX = ballSpeedX * -ballacceleration
            }
        }

        //@TODO DONE: check for ball colission with player 2
        if (roundedBallPositionX === bat2PositionX) { 
            if (
                (roundedBallPositionY >= bat2PositionY && 
                roundedBallPositionY < bat2PositionY + batSizeYPart)
                ||
                (roundedBallPositionY >= bat2PositionY + 2 * batSizeYPart &&
                    roundedBallPositionY < bat2PositionY + 3 * batSizeYPart)
                // set ballspeed back to -25 or 25
            ) { 
                setOriginalBallSpeed()
            } else if (
                roundedBallPositionY >= bat2PositionY + 1 * batSizeYPart &&
                    roundedBallPositionY < bat2PositionY + 2 * batSizeYPart) {
                ballSpeedX = ballSpeedX * -ballacceleration
            }
        }

        //@TODO DONE: check for ball with top and bottom boundary colission

        if (roundedBallPositionY === 0 || roundedBallPositionY === canvasEl.height) ballSpeedY *= -1

        if (roundedBallPositionY < 2 || roundedBallPositionY > (canvasEl.height - 2)) {
            ballColor = "#FF0505";
            console.log('height', canvasEl.height)
        } else {
            ballColor = "#D0D08A"
        }

        //check if the ball is passed the left boundary
        //@TODO DONE: check if the ball is passed the right boundary
        // -> Restart the game if the boundaries are hit and update the scoreLeft or scoreRight
        
        if(roundedBallPositionX < 0 && !gameOver) { 
            gameOver = true;
            scoreRight++;
            restart();
        } else if (roundedBallPositionX > canvasEl.width && !gameOver){ 
            gameOver = true;
            scoreLeft++;
            restart();
        }

        //move player 1 up or down
        if(bat1movingUp) {
            bat1PositionY = bat1PositionY - batSpeedY * deltaTime;
        } else if (bat1movingDown) {
            bat1PositionY = bat1PositionY + batSpeedY * deltaTime; 
        }

        //@TODO DONE: move player 2 up an down
        if(bat2movingUp) {
            bat2PositionY = bat2PositionY - batSpeedY * deltaTime;
        } else if (bat2movingDown) {
            bat2PositionY = bat2PositionY + batSpeedY * deltaTime; 
        }

        //call the drawGame functions so that we actually draw the game after all variable changes inside the gameloop are done
        drawGame();

        //request an animation from the browser to start the next update loop
        window.requestAnimationFrame(update);
    }

    //start the game loop by requesting an animation frame from the browser
    window.requestAnimationFrame(update);



//INPUT HANDLING

//Player 1 & 2 input
//@TODO DONE: listen for player 2 input
document.addEventListener('keydown', function(e){
        switch(e.key) {
            // Player 1
            case "w":
                bat1movingUp = true;
                break;
            case "s":
                bat1movingDown = true;
                break;
            // Player 2
            case "o":
                bat2movingUp = true;
                break;
            case "k":
                bat2movingDown = true;
                break;
        }
    });

    document.addEventListener('keyup', function(e){
        switch(e.key) {
            // Player 1 
            case "w":
                bat1movingUp = false;
                break;
            case "s":
                bat1movingDown = false;
                break;
            // Player 2
            case "o":
                bat2movingUp = false;
                break;
            case "k":
                bat2movingDown = false;
                break;
        }
    });



