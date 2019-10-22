var waveInProgress = false;
var lastSecond = Date.now();
var currentGold;
var goldPerSecond = 1;
var startGold = 20;
var currentWaveCandies = [{type: 'red', health: 0}];
var currentWave = 0;


//The canvas to draw on
var gameCanvas = document.getElementById('gameCanvas');
var ctx = gameCanvas.getContext('2d');

var candySpeed = 2;

//Speed of the candies
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
var purpleDamage = 15;

//Multiplers of the cost of the ghosts(Red is always * 1)
var blueCostMult = 2;
var greenCostMult = 5;
var purpleCostMult = 10;

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
    window.requestAnimationFrame(draw);
});

//Function to draw in the canvas

function draw(){
    //Clear the canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    //Draw the background
    drawBackground();
    //Draw the roads
    drawRoads();
    
    ctx.drawImage(images.house, 1000, 400, 64, 64);

    if(Date.now() - lastSecond >= 1000 && waveInProgress){
        currentGold += goldPerSecond;
        lastSecond = Date.now();
    }

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText("Gold: " + currentGold, 1000, 30);

    drawCandies();


    window.requestAnimationFrame(draw);
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
    ctx.drawImage(images.redCandy, 0, 0, 32, 32);
}

function startNextWave(){
    currentWaveCandies.forEach(candy => {
        if(candy.health !== 0){
            return false;
        }
    });
    currentWave++;

    if(currentWave == 1){
        addFirstWave();
        return true;
    }else if(currentWave == 2){
        addSecondWave();
        return true;
    }
}


function addFirstWave(){
    currentWaveCandies = [];
    for(var i = 0; i < 10; i++){
        currentWaveCandies.push({type: 'red', health: redHP});
    }
}

function addSecondWave(){
    addFirstWave();
    for(var i = 0; i < 6; i++){
        currentWaveCandies.push({type: 'blue', health: blueHP});
    }
}

function addThirdWave(){
    addSecondWave();
    for(var i = 0; i < 4; i++){
        currentWaveCandies.push({type: 'blue', health: blueHP});
    }
    for(var i = 0; i < 5; i++){
        currentWaveCandies.push({type: 'green', health: greenHP});
    }
}