// ----------------------------------------------
// DEFINE CONSTANTS
var KEYCODE_ENTER = 13;		//useful keycode
var KEYCODE_SPACE = 32;		//useful keycode
var KEYCODE_UP = 38;		//useful keycode
var KEYCODE_LEFT = 37;		//useful keycode
var KEYCODE_RIGHT = 39;		//useful keycode
var KEYCODE_DOWN = 40;		//useful keycode
var KEYCODE_W = 87;			//useful keycode
var KEYCODE_A = 65;			//useful keycode
var KEYCODE_D = 68;			//useful keycode
var KEYCODE_S = 83;			//useful keycode

var canvasWidth = 800;
var canvasHeight = 600;

// ----------------------------------------------
// DEFINE VARIABLES 

var gameState = "idle";

var lfHeld;				
var rtHeld;				
var fwdHeld;		
var dnHeld;

var playerTurn = 1

var movesPattern = []

// player 1
var player1 = {
    points: 0,
}

// player 2
var player2 = {
    points: 0,
}


var spriteSheet1
var player1Sprite
var spriteSheet2
var player2Sprite

var stageBg = {
    width: 350,
    height: 200,
    bitmap: null,
}

var buttonPressesOnscreen = []
var buttonDefault = {
    width: 150,
    height: 150,
    bitmap: null,
    x: 800,
    y: 0,
    alpha: 1,
    visible: true,
}

var buttonPressView = {
    bitmap: null,
    width: 150,
    height: 150,
}

var loadingInterval = 0;

var overlayBitmap

var currentMoveIndex = 0;

var winner = 0;

var playerTurnTxt;

var soundInstance;

// ----------------------------------------------
// CANVAS SETTINGS

var canvasSize = {
	height: "80%",
	width: "80%",
}

let viewportHeight = window.innerHeight;
let viewportWidth = window.innerWidth;

// ----------------------------------------------

//register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;
document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

// ----------------------------------------------

// Runs once the body element has loaded
function init() {

    // // check if the document sound plugins can be initialized successfully 
    // if (!createjs.Sound.initializeDefaultPlugins()) {
	// 	document.getElementById("error").style.display = "block";
	// 	document.getElementById("content").style.display = "none";
	// 	return;
	// }

    // // Disable on certain browsers
    // if (createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry) {
	// 	document.getElementById("mobile").style.display = "block";
	// 	document.getElementById("content").style.display = "none";
	// 	return;
	// }

	// identify the stage
    canvas = document.getElementById("danceCanvas");
	canvas.height = canvasHeight 
	canvas.width = canvasWidth
	stage = new createjs.Stage(canvas);

	// message field for loading
	messageField = new createjs.Text("Loading", "bold 24px Arial", "#FFFFFF");
	messageField.maxWidth = 1000;
	messageField.textAlign = "center";
	messageField.textBaseline = "middle";
	messageField.x = canvasWidth / 2;
	messageField.y = canvasHeight / 2;
	stage.addChild(messageField);
	stage.update(); 	//update the stage to show text


    // begin loading content (only sounds to load)
	var assetsPath = "../Assets/";
	manifest = [
		{id: "danceGirlGreen", src: "Images/danceGirlGreen.png"},
		{id: "danceGirlBlue", src: "Images/danceGirlBlue.png"},

		{id: "stage", src: "Images/stage.png"},

		{id: "down", src: "Images/down_s_white.png"},
		{id: "left", src: "Images/left_a_white.png"},
		{id: "right", src: "Images/right_d_white.png"},
		{id: "up", src: "Images/up_w_white.png"},
        
		{id: "divider", src: "Images/divider.png"},

		{id: "introCard", src: "Images/instructions.png"},
		
		{id: "sound1", src: "Sounds/sound1.wav"},
		{id: "sound2", src: "Sounds/sound2.wav"},
		{id: "sound3", src: "Sounds/sound3.wav"},
		{id: "sound4", src: "Sounds/sound4.wav"},

		{id: "beat", src: "Sounds/beat.wav"},

	];

	createjs.Sound.alternateExtensions = ["mp3"];

	// preload assets
    preload = new createjs.LoadQueue(true, assetsPath);
    preload.installPlugin(createjs.Sound);
    preload.addEventListener("complete", doneLoading); // add an event listener for when load is completed
	preload.addEventListener("progress", updateLoading);
	preload.loadManifest(manifest);

    createjs.Ticker.framerate = 30; 
    createjs.Ticker.addEventListener("tick", handleTick);
}


function handleTick(event) {
	if (gameState == "playing") {

		// STEERING CONTROLS
		if (lfHeld) {
            createjs.Sound.play("sound1");

            if (playerTurn == 1) {
                player1Sprite.gotoAndPlay("dance2");
            } else {
                player2Sprite.gotoAndPlay("dance2");
            }

            addNewButtonPress("left");

            lfHeld = false;

            processMove("left");
		}
		
		if (rtHeld) {
            createjs.Sound.play("sound4");

            if (playerTurn == 1) {
                player1Sprite.gotoAndPlay("dance3");
            } else {
                player2Sprite.gotoAndPlay("dance3");
            }

            addNewButtonPress("right");

            rtHeld = false;

            processMove("right");

		} 
		
		if (fwdHeld) {
            createjs.Sound.play("sound2");
            
            if (playerTurn == 1) {
                player1Sprite.gotoAndPlay("dance4");
            } else {
                player2Sprite.gotoAndPlay("dance4");
            }

            addNewButtonPress("up");

            fwdHeld = false;

            processMove("up");
			
		}

		if (dnHeld) {
            createjs.Sound.play("sound3");
            
            if (playerTurn == 1) {
                player1Sprite.gotoAndPlay("dance5");
            } else {
                player2Sprite.gotoAndPlay("dance5");
            }

            addNewButtonPress("down");

			dnHeld = false;

            processMove("down");

		}


		// update current button view

        for (let i = 0; i < buttonPressesOnscreen.length; i++) {
            buttonPressesOnscreen[i].bitmap.x = buttonPressesOnscreen[i].bitmap.x - 5;
            if (buttonPressesOnscreen[i].bitmap.x < -buttonPressView.width) {
                stage.removeChild(buttonPressesOnscreen[i].bitmap)
                buttonPressesOnscreen.splice(i, 1)
            }
        }

        playerTurnTxt.text = "Player " + playerTurn + "'s Turn";

	}


	stage.update();
}

function processMove(move) {
    if (movesPattern.length < 4) {
        // record the move
        movesPattern.push(move);

        if (currentMoveIndex == 3) {
            currentMoveIndex = 0;

            // swap player turn
            playerTurn = playerTurn == 1 ? 2 : 1;
    
            // add divider
            let newButtonPress = {}
            image = preload.getResult("divider");							
            bitmap = new createjs.Bitmap(image)
            bitmap.scaleX = buttonPressView.height / canvasHeight
            bitmap.scaleY =  buttonPressView.width / canvasWidth
            bitmap.x = canvasWidth - 20
            bitmap.y = Math.floor(canvasHeight / 2 + 180) 
            newButtonPress.bitmap = bitmap
            buttonPressesOnscreen.push(newButtonPress)
            stage.addChild(newButtonPress.bitmap)
        } else {
            currentMoveIndex++;
            
        }

    } else if (currentMoveIndex < movesPattern.length) {
        if (movesPattern[currentMoveIndex] == move) {
            
        } else {
            // game over
            winner = playerTurn == 1 ? 2 : 1;

            gameover()
        }
        currentMoveIndex++;

    } else {
        // record new move
        movesPattern.push(move);
        currentMoveIndex = 0;

        // swap player turn
        playerTurn = playerTurn == 1 ? 2 : 1;

        // add divider
        let newButtonPress = {}
        image = preload.getResult("divider");							
        bitmap = new createjs.Bitmap(image)
        bitmap.scaleX = buttonPressView.height / canvasHeight
        bitmap.scaleY =  buttonPressView.width / canvasWidth
        bitmap.x = canvasWidth - 20
        bitmap.y = Math.floor(canvasHeight / 2 + 180) 
        newButtonPress.bitmap = bitmap
        buttonPressesOnscreen.push(newButtonPress)
        stage.addChild(newButtonPress.bitmap)

        // // activate change sound
        // createjs.Sound.play("beat");

        // // activate cooldown timer

    }

    


    console.log(currentMoveIndex, movesPattern)
}

function addNewButtonPress(button) {
    let newButtonPress = {}
    image = preload.getResult(button);							
    bitmap = new createjs.Bitmap(image)
    bitmap.scaleX = buttonPressView.height / canvasHeight
    bitmap.scaleY =  buttonPressView.width / canvasWidth
    bitmap.x = canvasWidth - buttonPressView.width / 2
    bitmap.y = Math.floor(canvasHeight / 2 + 180) 
    newButtonPress.bitmap = bitmap
    buttonPressesOnscreen.push(newButtonPress)
    stage.addChild(newButtonPress.bitmap)

}


function resetGameVar() {
    // reset the score
    player1.points = 0;
    player2.points = 0;

    // reset the game state
    gameState = "idle";

    // reset the player turn
    playerTurn = 1;

    // reset the pattern
    movesPattern = [];

    // reset the button presses
    buttonPressesOnscreen = [];

    // reset current move index
    currentMoveIndex = 0;
}


function restart() {
    resetGameVar();

    stage.removeAllChildren();

    lfHeld = rtHeld = fwdHeld = dnHeld = false;

    stage.clear();

    // stage bg

	let	image = preload.getResult("stage")							
	let bitmap = new createjs.Bitmap(image)
	bitmap.scaleX = stageBg.width / canvasWidth
	bitmap.scaleY = stageBg.height / canvasHeight
	bitmap.x = Math.floor(canvasWidth / 2 - 270) 
	bitmap.y = Math.floor(canvasHeight / 2 - 270) 
	// bitmap.regX = bitmap.regY = SQRIMGHEIGHT / 2;
	stageBg.bitmap = bitmap
	stage.addChild(stageBg.bitmap)

    // add player1
    
	spriteSheet1 = new createjs.SpriteSheet({
        framerate: 30,
        "images": [preload.getResult("danceGirlGreen")],
        "frames": {"regX": 55, "height": 128, "count": 80, "regY": 64, "width": 110},

        "animations": {
            "idle": [1, 8, "idle", 0.125],
            "turn": [9, 16, "idle", 0.25],
            "jump": [17, 24, "idle", 0.25],
            "hands": [25, 32, "idle", 0.25],
            "dance": [33, 40, "idle", 0.25],
            "dance2": [41, 48, "idle", 0.25],
            "dance3": [49, 56, "idle", 0.25],
            "dance4": [57, 64, "idle", 0.25],
            "dance5": [65, 72, "idle", 0.25],
            "idle2": [73, 80, "idle", 0.25],
        }
    });

    player1Sprite = new createjs.Sprite(spriteSheet1, "turn");
    player1Sprite.x = Math.floor(canvasWidth / 2 - 70) 
	player1Sprite.y = Math.floor(canvasHeight / 2  + 10) 


    // add player2

    spriteSheet2 = new createjs.SpriteSheet({
        framerate: 30,
        "images": [preload.getResult("danceGirlBlue")],
        "frames": {"regX": 55, "height": 128, "count": 80, "regY": 64, "width": 110},

        "animations": {
            "idle": [1, 8, "idle", 0.125],
            "turn": [9, 16, "idle", 0.25],
            "jump": [17, 24, "idle", 0.25],
            "hands": [25, 32, "idle", 0.25],
            "dance": [33, 40, "idle", 0.25],
            "dance2": [41, 48, "idle", 0.25],
            "dance3": [49, 56, "idle", 0.25],
            "dance4": [57, 64, "idle", 0.25],
            "dance5": [65, 72, "idle", 0.25],
            "idle2": [73, 80, "idle", 0.25],
        }
    });

    player2Sprite = new createjs.Sprite(spriteSheet2, "turn");
    player2Sprite.x = Math.floor(canvasWidth / 2 + 90) 
	player2Sprite.y = Math.floor(canvasHeight / 2  + 10) 


    
    // winner text

    playerTurnTxt = new createjs.Text("Player " + playerTurn + "'s Turn", "bold 18px Arial", "#FFFFFF");
	playerTurnTxt.textAlign = "right";
	playerTurnTxt.x = canvasWidth / 2 + 80;
	playerTurnTxt.y = 200;
	playerTurnTxt.maxWidth = 1000;

    stage.addChild(
        playerTurnTxt, 
        player1Sprite,
        player2Sprite
    );

    gameState = "playing"

    createjs.Ticker.timingMode = createjs.Ticker.RAF;

}

// ------------------------------------------------------
// HANDLE KEYPRESSES

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}

    if (gameState == "gamemover") {
        return
    }

    if (playerTurn == 1) {

        switch (e.keyCode) {

            case KEYCODE_A:
                lfHeld = true;
                return false;
            case KEYCODE_D:
                rtHeld = true;
                return false;
            case KEYCODE_W:
                fwdHeld = true;
                return false;
            case KEYCODE_S:
                dnHeld = true;
                return false;
                    
            case KEYCODE_ENTER:
                if (canvas.onclick == handleClick) {
                    handleClick();
                }
                return false;
        }
    } else {
        switch (e.keyCode) {

            case KEYCODE_LEFT:
                lfHeld = true;
                return false;
            case KEYCODE_RIGHT:
                rtHeld = true;
                return false;
            case KEYCODE_UP:
                fwdHeld = true;
                return false;
            case KEYCODE_DOWN:
                dnHeld = true;
                return false;
                    
            case KEYCODE_ENTER:
                if (canvas.onclick == handleClick) {
                    handleClick();
                }
                return false;
        }
    }
}

function handleKeyUp(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}

	// switch (e.keyCode) {

    //     case KEYCODE_A:
	// 	case KEYCODE_LEFT:
	// 		lfHeld = false;
	// 		break;
	// 	case KEYCODE_D:
	// 	case KEYCODE_RIGHT:
	// 		rtHeld = false;
	// 		break;
	// 	case KEYCODE_W:
	// 	case KEYCODE_UP:
	// 		fwdHeld = false;
	// 		break;
	// 	case KEYCODE_S:
    //     case KEYCODE_DOWN:
    //         dnHeld = false;
    //         break;

	// }

    console.log(e.keyCode)
}

// ------------------------------------------------------
// LOADING SCREEN ELEMENTS

// Loading screen update functions
function updateLoading() {
	messageField.text = "Loading " + (preload.progress * 100 | 0) + "%";
	stage.update();
}

function doneLoading(event) {
	clearInterval(loadingInterval);

	stage.removeChild(messageField);

	var image = preload.getResult("introCard")
	overlayBitmap = new createjs.Bitmap(image);
	overlayBitmap.scaleX = 1
	overlayBitmap.scaleY = 1
	overlayBitmap.x = (canvasWidth / 2) - (overlayBitmap.getTransformedBounds().width / 2)
	overlayBitmap.y = (canvasHeight / 2) - (overlayBitmap.getTransformedBounds().height / 2)
	stage.addChild(overlayBitmap)

	soundInstance = createjs.Sound.play("beat", {loop: -1, volume: 0.5});

	watchRestart();
}

// ------------------------------------------------------
// TRIGGER RESTART

function watchRestart() {
	//watch for clicks
	stage.update(); 	//update the stage to show text
	canvas.onclick = handleClick;
}

function handleClick() {
    

	//prevent extra clicks and hide text
	canvas.onclick = null;
    
    soundInstance.play()

	restart();
}


function gameover() {

	stage.removeAllChildren()
	stage.clear()

    gameState = "gamemover"

    console.log("Gameover")

    endGameTxt = new createjs.Text("Player " + winner + " wins!\n\nClick to replay", "bold 30px Arial", "#FFFFFF");
	endGameTxt.textAlign = "center";
	endGameTxt.x = canvasWidth / 2;
	endGameTxt.y = canvasHeight / 2 - 50;
	endGameTxt.maxWidth = 1000;

    stage.addChild(
        endGameTxt
    );

    soundInstance.stop()

	watchRestart()
}