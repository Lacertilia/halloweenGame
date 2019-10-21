//The canvas to draw on
var gameCanvas = document.getElementById('gameCanvas');
var ctx = gameCanvas.getContext('2d');


//Candy Image
var images = {};

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
    pumpkin: './img/pumpkin.png'
};


//Get images

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
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

//Call loadImages

loadImages(sources, function() {

    window.requestAnimationFrame(step);
});

