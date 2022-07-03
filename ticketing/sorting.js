const timeLeft = document.querySelector('#time-left-value');
const score = document.querySelector('#score-value');
const wristbandColour = document.querySelector('#customer-category-value');

const squareRed = document.querySelector('.square-red');
const squareYellow = document.querySelector('.square-yellow');
const squareGreen = document.querySelector('.square-green');
const squareBlue = document.querySelector('.square-blue');

const squares = document.querySelectorAll('.square');

let currentTime = 15;
let timerId = null;

let result = 0;

let hitPosition;

let countDownTimerId = setInterval(countDown, 1000)

function update() {
  score.textContent = result;
  timeLeft.textContent = currentTime;
  wristbandColour.textContent = currentTime;
}

function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime == 0) {
    clearInterval(countDownTimerId);
    clearInterval(timerId);
    alert('Your score is ' + result);
    next();
  }
}

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

function randomSquare() {
  // add mole to random position from 1 - 4
  let randomPosition = squares[Math.floor(Math.random() * 4)];
  randomPosition.classList.add('mole');
  hitPosition = randomPosition.id;
  wristbandColour.textContent = hitPosition;
}

randomSquare();

squares.forEach(square => {
  square.addEventListener('click', () => {
    if (square.id == hitPosition) {
      result++;
      score.textContent = result;
      hitPosition = null;
      smashedLoggers = new playSound("sounds/correct.mp3");
      smashedLoggers.play();
      randomSquare();
    }
  })
})

function next() {
  window.location.href = "../ticketingInfo/ticketInfo.html";
}