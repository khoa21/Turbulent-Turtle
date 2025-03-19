let game;
let gwidth = 360;
let gheight = 640;
let ctx;
let gameOver = false;
let score = 0;



//turtle 
let twidth = 30;
let theight = 30;
let tx = gwidth/8; //turtle starting x cord
let ty = gheight/2; //starting y cord

let turtle = {
    x: tx,
    y: ty,
    width: twidth,
    height: theight,
    color: "green"
}

//obstacles
let oArray = []; //using array to store obstacles
let owidth = 64;
let oheight = 512;
let ox = gwidth;
let oy = 0;


//game physics
let o_veloX = -2; //obstacles moving left
let t_veloY = 0; //turtle flying up
let gravity = 0.2;


// initilizing 
window.onload = function(){
    game = document.getElementById("game");
    ctx = game.getContext("2d");
    game.width = gwidth;
    game.height = gheight;


    //innitialize turtle
    ctx.fillRect(turtle.color, turtle.x, turtle.y, turtle.width, turtle.height);


    requestAnimationFrame(update);
    setInterval(addObstacle, 1500);
    document.addEventListener("keydown", Flying);
}

//frame update
function update(){
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    ctx.clearRect(0, 0, game.width, game.height);

    //updating turlte frames (make sure to replace
    //  ctx.fillRect with ctx.drawImage when have the png)
    t_veloY += gravity;
    turtle.y += t_veloY;
    ctx.fillRect(turtle.x, turtle.y, turtle.width, turtle.height);


    //fall detection
    if(turtle.y > game.height){
        gameOver = true;
    }

    //updating obstacles (also change .fillRect to .drqawImage when hanve png)
    for (let i = 0; i < oArray.length; i++){
        let obstacle = oArray[i];
        obstacle.x += o_veloX;  //shifting obstacle to left

        ctx.fillStyle = "red";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (collision(turtle, obstacle)){
            gameOver = true;
        }

        if(!obstacle.passed && turtle.x > obstacle.x + obstacle.width){
            score += 0.5;
            obstacle.passed = true;
        }
    }

    //removing obstacles off screen
    while(oArray.length > 0 && oArray[0].x < -owidth){
        oArray.shift();
    }

    //updating score
    ctx.fillStyle = "white";
    ctx.font = "45px Arial";
    ctx.fillText(score, 5, 45);

    //game over
    if(gameOver)
    {
        ctx.fillText("YOU LOSE", 5, 90);
    }
}

//generating obstacles function
function addObstacle(){
    if (gameOver){
        return;
    }
    let randheight = oy - oheight/4 - Math.random()*(oheight/2); //random height
    let opening = game.height/4; //opening between obstacles


    //top obstacle
    let topObstacle = {
        x: ox,
        y: randheight,
        width: owidth,
        height: oheight,
        passed: false
    }
    oArray.push(topObstacle);
    
    //bottom obstacle
    let bottomObstacle = {
        x: ox,
        y: randheight + oheight + opening,
        width: owidth,
        height : oheight,
        passed: false
    }
    oArray.push(bottomObstacle);
}

function Flying(e){
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW")
    {
        t_veloY = -5;

        if(gameOver){
            gameOver = false;
            oArray = [];
            score = 0;
            turtle.y = ty;
        }
    }
}

//collision detection
function collision(a, b){
    return a.x < b.x + b.width && 
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

}