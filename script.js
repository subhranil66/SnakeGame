var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var coArray = [];
var isPaused = true;

var btnToPause = document.getElementById('btnToPause');
var btnToRenew = document.getElementById('btnToRenew');
var count=0;
var paused = false;


function createCoOrdinateArray()
{
    if(!localStorage.coordinate || JSON.parse(localStorage.coordinate) == [])
    {
        localStorage.coordinate = JSON.stringify([{"x_coord":160,"y_coord":160,"x_app":320,"y_app":320,"scores":0,"lastMoves":'right',"cell":[{x: 160, y: 160}, {x: 144, y: 160}]}]);
    }
    else
    {
        coArray = JSON.parse(localStorage.coordinate);
    }
}
createCoOrdinateArray();

var lsArray = localStorage.getItem('coordinate');
var lsarr = JSON.parse(lsArray);


var lastMove = lsarr[lsarr.length-1].lastMoves;

var score = lsarr[lsarr.length-1].scores;
document.getElementById("scorePrint").innerHTML = "Score = " +  score;

var snake = 
{
    x : lsarr[lsarr.length-1].x_coord,
    y : lsarr[lsarr.length-1].y_coord,
    cells : lsarr[lsarr.length-1].cell,
    die: false,
    eatApple: false
};

var apple = 
{
    x : lsarr[lsarr.length-1].x_app,
    y : lsarr[lsarr.length-1].y_app
};



//draw apple
function drawApple()
{
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);
}
drawApple();

//draw snake
function drawSnake()
{
    context.fillStyle = 'green';
    for(let i=0;i<snake.cells.length;i++)
    context.fillRect(snake.cells[i].x, snake.cells[i].y, grid-1, grid-1);
}
drawSnake();

function moveSnake(dx, dy)
{
    snake.x += dx;
    snake.y += dy;
    
    snake.cells.unshift({x: snake.x, y: snake.y});
    if(!snake.eatApple)snake.cells.pop();
    else snake.eatApple = false;
}

function checkBoundary()
{
    if(snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height)
    {
        snake.die = true;
    }
}

function getRandomInt()
{
    return Math.floor(Math.random() * 25) * grid;
}

function checkAppleIsOnSnake()
{
    for(let  i=0;i<snake.cells.length;i++)
    {
        if(apple.x == snake.cells[i].x && apple.y == snake.cells[i].y)
        {
        return true;
        }
    }
}

function checkSnakeBiteItself()
{
    for(let i=4;i<snake.cells.length;i++)
    {
        if(snake.x == snake.cells[i].x && snake.y == snake.cells[i].y)
        {
            snake.die = true;
        }
    } 
}

function generateApple()
{
    apple.x = getRandomInt();
    apple.y = getRandomInt();
    if(checkAppleIsOnSnake())
    {
        generateApple();
    }
}

function checkEatApple()
{
    if(snake.x == apple.x && snake.y == apple.y)
    {
        snake.eatApple = true;
        generateApple();
        drawApple();
        var s = countScore();
    }
}

function countScore()
{
    score = score + 10;
    document.getElementById("scorePrint").innerHTML = "Score = " +  score;
    return score;
}

function gameOver()
{
    context.clearRect(0, 0, canvas.width,canvas.height);
    snake.cells = [];
    context.fillStyle = 'red';
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText("Game Over", canvas.width/2, canvas.height/2);
    localStorage.removeItem("coordinate");
    coArray = [];
}



function move(i)
{
    let dx = 0, dy = 0;
    while(i==1)
    {
        if(lastMove != 'right'){
        dx = -grid;
        dy = 0;
        lastMove = 'left';
        }
         else if(lastMove == 'right'){
            dx += grid;
        dy = 0;
         }
        break;
    }
    while(i==2)
    {
        if(lastMove != 'down'){
        dy = -grid;
        dx = 0;
        lastMove = 'up';
        }
         else if(lastMove == 'down'){
            dy += grid;
        dx = 0;
         }
        break;
    }
    while(i==3)
    {
        if(lastMove != 'left'){
        dx = grid;
        dy = 0;
        lastMove = 'right';
        }
         else if(lastMove == 'left'){
            dx -= grid;
        dy = 0;
         }
        break;
    }
    while(i==4)
    {
        if(lastMove != 'up'){
        dy = grid;
        dx = 0;
        lastMove = 'down';
        }
         else if(lastMove == 'up'){
            dy -= grid;
        dx = 0;
         }
        break;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake(dx, dy);
    checkBoundary();
    checkSnakeBiteItself();
    checkEatApple();
    if(snake.die)
    {
        gameOver();
        return;
    }
    drawSnake();
    drawApple();
}



function main()
{
    var i=0;
    var interval;
document.addEventListener('keydown', function(event){
    if(interval) clearInterval(interval);

    var e = event.which;
    
    if(e == 37)
    {
        i=1;
    }
    else if(e == 38)
    {
        i=2;
    }
    else if(e == 39)
    {
        i=3;
    }
    else if(e == 40)
    {
        i=4
    }

    interval = setInterval(function(){
        move(i);
    },200);
});


btnToPause.addEventListener('click', function(){
    count++;
    if(snake.x>=0 && snake.x<=400 && snake.y>=0 && snake.y<=400)
    {
        
        if(count%2==1)
        {
            localStorage.removeItem("coordinate");
            coArray = [];
            document.getElementById("btnToPause").innerHTML = "Play";
            document.getElementById("btnToPause").style.backgroundColor = "#008CBA";
        
            addCoOrdinateToLS();
        }
        else if(count%2==0 && count>0)
        {
            document.getElementById("btnToPause").innerHTML = "Pause";
            document.getElementById("btnToPause").style.backgroundColor = "#f44336";
     
           interval = setInterval(function(){
            move(i);
        },200);
        }
    }
});

btnToRenew.addEventListener('click', function(){
    window.location.href = ("index.html");
    localStorage.removeItem("coordinate");
});


document.addEventListener('keydown', function(e){
    if(e.keyCode == 32) 
    {
        count++;
        console.log(count);
        if(snake.x>=0 && snake.x<=400 && snake.y>=0 && snake.y<=400)
    {
        if(count%2==1 && paused==false)
        {
            localStorage.removeItem("coordinate");
            coArray = [];
            pauseGame();
            addCoOrdinateToLS();
        }
        else if(count%2==0 && paused==true)
        {
            move(i);
        }
    }
    }
});

function pauseGame()
{
   clearInterval(interval);
}

}
main();

function addCoOrdinateToLS()
{
    var coObject = {
        x_coord : snake.x,
        y_coord : snake.y,
        x_app : apple.x,
        y_app : apple.y,
        scores : score,
        lastMoves : lastMove,
        cell : snake.cells
    }
    coArray.push(coObject);
    localStorage.coordinate = JSON.stringify(coArray);
}
