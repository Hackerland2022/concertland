const squareRed = document.querySelector('#square-red');
const squareYellow = document.querySelector('#square-yellow');
const squareGreen = document.querySelector('#square-green');
const squareBlue = document.querySelector('#square-blue');

//var wrong = document.getElementById("wrong");
//var wristbandColour = document.getElementById("colour");

// sync
let red = 0;
let yellow = 1;
let green = 2;
let blue = 3;

// selecting for an element with id time-left
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');
const wristbandColour = document.querySelector('#colour');

let result = 0;
let hitPosition;
let currentTime = 30;
let timerId = null;

let countDownTimerId = setInterval(countDown, 1000)

//create audio element for playing music and sfx
function playSound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);

  this.play = function () {
    this.sound.play();
  };
  
  this.stop = function () {
    this.sound.pause();
  };
}

squareRed.forEach(square => {
  square.addEventListener('click', () => {
    if (square.id == hitPosition) {
      result++;
      score.textContent = result;
      smashedLoggers = new playSound("sounds/correct.mp3");
      smashedLoggers.play();
      randomSquare();
    } 
    /*else {
      score.textContent = result;
      wrong.classList.add("fadeAway");
      setTimeout(function() {
        wrong.classList.remove("fadeAway");
      }, 500);
      randomSquare();
    }*/
  })
})

squareYellow.forEach(square => {
  square.addEventListener('click', () => {
    if (square.id == hitPosition) {
      result++;
      score.textContent = result;
      smashedLoggers = new playSound("sounds/correct.mp3");
      smashedLoggers.play();
      randomSquare();
    } 
  })
})

squareGreen.forEach(square => {
  square.addEventListener('click', () => {
    if (square.id == hitPosition) {
      result++;
      score.textContent = result;
      smashedLoggers = new playSound("sounds/correct.mp3");
      smashedLoggers.play();
      randomSquare();
    } 
  })
})

squareBlue.forEach(square => {
  square.addEventListener('click', () => {
    if (square.id == hitPosition) {
      result++;
      score.textContent = result;
      smashedLoggers = new playSound("sounds/correct.mp3");
      smashedLoggers.play();
      randomSquare();
    } 
  })
})

function randomSquare() {
  // choose random position from 1 - 4
  let randomPosition = squares[Math.floor(Math.random() * 4)];
  hitPosition = randomPosition.id;
  wristbandColour = hitPosition;
}

function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime == 0) {
    clearInterval(countDownTimerId);
    clearInterval(timerId);
    alert('Your score is ' + result);
  }
}

function next() {
  window.location.href = "../transitionPages/antiTrawling.html";
}