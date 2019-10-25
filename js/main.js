var waveInProgress = false;
var lastSecond = Date.now();
var lastMoveCheck = Date.now();
var currentGold;
var goldPerSecond = 100;
var startGold = 20;
var currentWaveCandies = [{type: 'red', health: 0, x: 0, y: 0, direction: 'up', deadChecked:  true}];
var ghosts = [{type: 'purple', x: 300, y: 600}];
var currentWave = 0;
var candiesEaten = 0;
var maxCandiesEaten = 50;
var gameOver = false;


//The canvas to draw on
var gameCanvas = document.getElementById('gameCanvas');
var ctx = gameCanvas.getContext('2d');

var candySpeed = 2;

//Speed of the candies(Red candy is multiplied by 1)
var blueSpeedMult = 1.2;
var greenSpeedMult = 0.75;
var purpleSpeedMult = 0.5;

//Health of the candies
var redHP = 10;
var blueHP = 25;
var greenHP = 50;
var purpleHP = 100;

//Amount of gold dropped by candies
var redGold = 2;
var blueGold = 5;
var greenGold = 15;
var purpleGold = 100;

//Damage of the ghosts
var redDamage = 2;
var blueDamage = 3;
var greenDamage = 5;
var purpleDamage = 7.5;

//Radius for ghosts damage
var redGhostRadius = 100;
var blueGhostRadius = 50;
var greenGhostRadius = 100;
var purpleGhostRadius = 150;

//Cost of the ghosts and the pumpkin
var redCost = 10;
var blueCost = 20;
var greenCost = 50;
var purpleCost = 100;
var pumpkinCost = 1000;

//Images used in the game

var images = {};

//Sources of the images

const sources = {
    //Candies
    redCandy: './img/redCandy.png',
    blueCandy: './img/blueCandy.png',
    greenCandy: './img/greenCandy.png',
    purpleCandy: './img/purpleCandy.png',
    
    //Ghosts
    redGhost: './img/redGhost.png',
    blueGhost: './img/blueGhost.png',
    greenGhost: './img/greenGhost.png',
    purpleGhost: './img/purpleGhost.png',

    //Pumpkin
    pumpkin: './img/pumpkin.png',

    //House
    house: './img/house.png'
};


//Load images using JS

function loadImages(sources, callback) {
    let loadedImages = 0;
    let numImages = 0;
    for(let src in sources) {
        numImages++;
    }
    for(let src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback();
            }
        };
        images[src].src = sources[src];
    }
}

//Call loadImages

loadImages(sources, function() {
    currentGold = startGold;
    window.requestAnimationFrame(game);
});

//Function for logic in the game
function game(){
    if(waveInProgress){
        update();
    }else {
        for(var i = 0; i < currentWaveCandies.length; i++){
            if(!currentWaveCandies[i].deadChecked){
                candyDead(i);
            }
        }
    }
    
    if(candiesEaten >= maxCandiesEaten){
        failGame();
    }

    draw();
    
    if(!gameOver)
    window.requestAnimationFrame(game);
    else
    failGame();
}

//Function to draw in the canvas
function draw(){
    //Clear the canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    //Draw the background
    drawBackground();
    
    //Draw the roads
    drawRoads();
    
    printText();
    
    drawGhosts();

    drawCandies();

    //Draw the house at the end of the road
    ctx.drawImage(images.house, 1000, 400, 64, 64);
    
}

function update(){
    if(Date.now() - lastSecond >= 1000){
        currentGold += goldPerSecond;    
        lastSecond = Date.now();
        for(var i = 0; i < currentWaveCandies.length; i++){
            for(var k = 0; k < ghosts.length; k++){
                var distance = getDistance(i, k);
                if(inRange(k, distance)){
                    damageCandy(ghosts[k].type, i);
                }
            }
        }
    }
    
    moveCandies();
}

//Function to print text
function printText(){
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    
    ctx.fillText("Gold: " + currentGold, 1000, 30);

    ctx.fillText((maxCandiesEaten - candiesEaten) + "/" + maxCandiesEaten, 0, 30);
    ctx.drawImage(images.redCandy, 75, 0, 40, 40);

    ctx.fillText("Current wave: " + currentWave, 500, 30);
}

//Function to move the candies
function moveCandies(){
    for(var i = 0; i < currentWaveCandies.length; i++){
        var currentCandy = currentWaveCandies[i];
        if(currentCandy.health > 0){
            if(currentCandy.type == 'red'){
                moveCurrentCandy(i, candySpeed, currentCandy.direction);
            }else if(currentCandy.type == 'blue'){
                moveCurrentCandy(i, candySpeed*blueSpeedMult, currentCandy.direction);
            }else if(currentCandy.type == 'green'){
                moveCurrentCandy(i, candySpeed*greenSpeedMult, currentCandy.direction);
            }else if(currentCandy.type == 'purple'){
                moveCurrentCandy(i, candySpeed*purpleSpeedMult, currentCandy.direction);
            }
        }else if(!currentCandy.deadChecked){
            candyDead(i);
        }
    }
}

//Function to get gold from killing a candy
function candyDead(i){
    currentWaveCandies[i].deadChecked = true;
    switch(currentWaveCandies[i].type){
        case 'red':
            currentGold += 2;
            break;
        case 'blue':
            currentGold += 5;
            break;
        case 'green':
            currentGold += 15;
            break;
        case 'purple':
            currentGold += 100;
            break;
    }
}

//Function to check distance between a ghost and a candy.
function getDistance(iCandy, iGhost){
    var dX = currentWaveCandies[iCandy].x - ghosts[iGhost].x;
    var dY = currentWaveCandies[iCandy].y - ghosts[iGhost].y;

    return Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
}

//Function to check if a candy is in range of a turret
function inRange(iGhost, distance){
    var type = ghosts[iGhost].type;
    switch (type){
        case 'red':
            if(distance <= redGhostRadius)return true;
            break;
        case 'blue':
            if(distance <= blueGhostRadius)return true;
            break;
        case 'green':
            if(distance <= greenGhostRadius)return true;
            break;
        case 'purple':
            if(distance <= purpleGhostRadius)return true;
            break;
    }
    return false;
}

//Function to damage candies if in range of ghosts
function damageCandy(type, iCandy){
    if(currentWaveCandies[iCandy].health > 0)
    switch(type){
        case 'red':
            currentWaveCandies[iCandy].health -= redDamage;
            break;
        case 'blue':
            currentWaveCandies[iCandy].health -= blueDamage;
            break;
        case 'green':
            currentWaveCandies[iCandy].health -= greenDamage;
            break;
        case 'purple':
            currentWaveCandies[iCandy].health -= purpleDamage;
    }
}

//Function to move one candy in a specified direction
function moveCurrentCandy(i, speed, direction){
    checkPath(i, speed, direction);
    direction = currentWaveCandies[i].direction;
    if(direction == 'up'){
        currentWaveCandies[i].y -= speed;
    }else if(direction == 'right'){
        currentWaveCandies[i].x += speed;
    }else if(direction == 'down'){
        currentWaveCandies[i].y += speed;
    }else if(direction == 'left'){
        currentWaveCandies[i].x -= speed;
    }
}

function checkPath(i, speed, direction){
    var currentCandy = currentWaveCandies[i];
    if(direction == 'up'){
        if(currentCandy.x == 409 && currentCandy.y - speed < 509){
            currentWaveCandies[i].direction = 'left';
            currentWaveCandies[i].y = 509;
        }else if(currentCandy.x == 109 && currentCandy.y - speed < 109){
            currentWaveCandies[i].direction = 'right';
            currentWaveCandies[i].y = 109;
        }
    }else if(direction == 'right'){
        if(currentCandy.y == 109 && currentCandy.x + speed > 559){
            currentWaveCandies[i].direction = 'down';
            currentWaveCandies[i].x = 559;
        }else if(currentCandy.y == 429 && currentCandy.x + speed + 32 > 1000){
            eatCandy(i, currentCandy);
        }
    }else if(direction == 'down'){
        if(currentCandy.x == 259 && currentCandy.y + speed > 659){
            currentWaveCandies[i].direction = 'left';
            currentWaveCandies[i].y = 659;
        }else if(currentCandy.x == 559 && currentCandy.y + speed > 429){
            currentWaveCandies[i].direction = 'right';
            currentWaveCandies[i].y = 429
        }
    }else if(direction == 'left'){
        if(currentCandy.y == 509 && currentCandy.x - speed < 259){
            currentWaveCandies[i].direction = 'down';
            currentWaveCandies[i].x = 259;
        }else if(currentCandy.y == 659 && currentCandy.x - speed < 109){
            currentWaveCandies[i].direction = 'up';
            currentWaveCandies[i].x = 109;
        }
    }
}

//Function to eat candy
function eatCandy(i, currentCandy){
    currentWaveCandies[i].health = 0;
    currentWaveCandies[i].deadChecked = true;
    switch(currentCandy.type){
        case "red":
            candiesEaten++;
            break;
        case "blue":
            candiesEaten += 2;
            break;
        case "green":
            candiesEaten += 5;
            break;
        case "purple":
            candiesEaten += 10;
            break;
    }
}

//Function to draw the background
function drawBackground(){
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Function to draw the roads
function drawRoads(){
    ctx.fillStyle = 'dimgray';
    ctx.fillRect(400, 500, 50, 300);
    ctx.fillRect(550, 420, 460, 50);
    ctx.fillRect(100, 100, 50, 600);
    ctx.fillRect(100, 650, 200, 50);
    ctx.fillRect(250, 500, 200, 50);
    ctx.fillRect(250, 500, 50, 200);
    ctx.fillRect(100, 100, 500, 50);
    ctx.fillRect(550, 100, 50, 320);
}

//Function to draw candies
function drawCandies(){
    var stillAlive = false;
    //Loop through all the candies in the list
    for(var i = 0; i < currentWaveCandies.length; i++){
        var currentCandy = currentWaveCandies[i];
        //Check if current candy the program is checking is alive
        if(currentCandy.health > 0){
            //Check what type current candy is
            stillAlive = true;
            if(currentCandy.type == 'red'){
                ctx.drawImage(images.redCandy, currentCandy.x, currentCandy.y);
            }else if(currentCandy.type == 'blue'){
                ctx.drawImage(images.blueCandy, currentCandy.x, currentCandy.y);
            }else if(currentCandy.type == 'green'){
                ctx.drawImage(images.greenCandy, currentCandy.x, currentCandy.y);
            }else if(currentCandy.type == 'purple'){
                ctx.drawImage(images.purpleCandy, currentCandy.x, currentCandy.y);
            }
        }
    }
    if(!stillAlive){
        waveInProgress = false;
    }
}

//Function to draw ghosts
function drawGhosts(){
    for(var i = 0; i < ghosts.length; i++){
        if(ghosts[i].type == 'red'){
            ctx.drawImage(images.redGhost, ghosts[i].x, ghosts[i].y);
        }else if(ghosts[i].type == 'blue'){
            ctx.drawImage(images.blueGhost, ghosts[i].x, ghosts[i].y);
        }else if(ghosts[i].type == 'green'){
            ctx.drawImage(images.greenGhost, ghosts[i].x, ghosts[i].y);
        }else if(ghosts[i].type == 'purple'){
            ctx.drawImage(images.purpleGhost, ghosts[i].x, ghosts[i].y);
        }
    }
}

//Function to kill game if game is over
function failGame(){
    gameOver = true;
    drawBackground();
    ctx.font = '60px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('You got Diabetes and lost!', 200, gameCanvas.height/2);
}

//Function to start the next wave
function startNextWave(){
    var stillAlive = false;
    currentWaveCandies.forEach(candy => {
        if(candy.health > 0){
            stillAlive = true;
        }
    });
    if(!stillAlive){
        currentWave++;
        waveInProgress = true;
        if(currentWave == 1){
            addFirstWave();
        }else if(currentWave == 2){
            addSecondWave();
        }else if(currentWave == 3){
            addThirdWave();
        }else{
            addLaterWave(currentWave);
        }
    }
}

//Adds first wave
function addFirstWave(){
    currentWaveCandies = [];
    for(var i = 0; i < 10; i++){
        currentWaveCandies.push({type: 'red', health: redHP, x: 409, y: gameCanvas.height + i * 32, direction: 'up', deadChecked:  false});
    }
}

//Adds second wave
function addSecondWave(){
    addFirstWave();
    for(var i = 0; i < 6; i++){
        currentWaveCandies.push({type: 'blue', health: blueHP, x: 409, y: gameCanvas.height + i * 32, direction: 'up', deadChecked:  false});
    }
}

//Adds third wave
function addThirdWave(){
    addSecondWave();
    for(var i = 0; i < 4; i++){
        currentWaveCandies.push({type: 'blue', health: blueHP, x: 409, y: gameCanvas.height + i * 32, direction: 'up', deadChecked:  false});
    }
    for(var i = 0; i < 5; i++){
        currentWaveCandies.push({type: 'green', health: greenHP, x: 409, y: gameCanvas.height + i * 32, direction: 'up', deadChecked:  false});
    }
}

//Adds later waves
function addLaterWave(current){
    addThirdWave();
    for(var i = 0; i <= current; i++){
        currentWaveCandies.push({type: 'red', health: redHP, x: 409, y: gameCanvas.height + i * 32, direction: 'up', deadChecked:  false});
        currentWaveCandies.push({type: 'blue', health: blueHP, x: 409, y: gameCanvas.height + i * 32, direction: 'up', deadChecked:  false});
        currentWaveCandies.push({type: 'green', health: greenHP, x: 409, y: gameCanvas.height + i * 32, direction: 'up', deadChecked:  false});
        currentWaveCandies.push({type: 'purple', health: purpleHP, x: 409, y: gameCanvas.height + i * 32, direction: 'up', deadChecked:  false});
    }
}

//Function to buy pumpkin
function buyPumpkin(){
    if(currentGold >= pumpkinCost && waveInProgress){
        for(var i = 0; i < currentWaveCandies.length; i++){
            currentWaveCandies[i].health = 0;
        }
        currentGold -= pumpkinCost;
    }
}


document.addEventListener('keydown', function(e){
    switch(e.key){
        case ' ':
            startNextWave();
            break;
        case 'p':
            buyPumpkin();
            break;
        case 'k':
            failGame();
            break;

        
    }
});