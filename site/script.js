const getPositions = document.querySelectorAll(".position");
const winnerText = document.querySelector(".winner");
const positions = Array.from(getPositions);
const winTrack = document.querySelector("#win-track");

positions.forEach(area => area.addEventListener("click", addCharacter));

let isCircle = false;
let thereIsAWin = false;
let isTheFirstMove = true;
let ai = 0;
let human = 0;
let positionsUsed = [];
let allAvailablePositions = [];
let winPossibilities = [
  // Horizontal
  ["b1", "b2", "b3"], 
  ["b4", "b5", "b6"], 
  ["b7", "b8", "b9"],

  // Vertical
  ["b1", "b4", "b7"], 
  ["b2", "b5", "b8"], 
  ["b3", "b6", "b9"],

  // Diagonal
  ["b1", "b5", "b9"], 
  ["b3", "b5", "b7"]
];

!function setCharacter() {
  const randomValue = Math.random();
  const circleDecided = randomValue > 0.5;
  if (circleDecided) isCircle = true;
}();

function addCharacter(e) {
  const areaContainsCharacter = e.target.classList.length > 1;
  const isValid = !areaContainsCharacter && !thereIsAWin;

  if (isValid) {
    allAvailablePositions = [];

    if (isCircle) {
      createCharacter(e.target, "circle");
      callFunctions();
      isCircle = true;
    } else {
      createCharacter(e.target, "x");
      callFunctions();
      isCircle = false;
    }

    human++;
    console.log(human, ai)
  }

  return;

  function createCharacter(e, character) {
    e.classList.add(character);
    positionsUsed.push(e.id);
  }

  function callFunctions() {
    getAllAvailablePositions();
    makeAiPlay();
    decideWin();
  }

  function getAllAvailablePositions() {
    winPossibilities.forEach(pos => pos.map(p => {
      if (document.getElementById(p).classList.length === 1) allAvailablePositions.push(p);
    }));
  }

  function makeAiPlay() {
    const positionCounter = {};
    const bestPositions = ["b1", "b3", "b7", "b9"];
    let bestPositionAvailable = false;
    let aiOptionsToMove = []; 

    // The opposite character for the ai to play
    isCircle ? isCircle = false : isCircle = true;

    // Counts how many times each position appears on each win possibility
    allAvailablePositions.forEach(x => positionCounter[x] = (positionCounter[x] || 0) + 1);

    for (pos in positionCounter) {
      bestPositionAvailable = bestPositions.includes(pos);
      if (bestPositionAvailable) aiOptionsToMove.push(pos);
    }

    if (bestPositionAvailable && isTheFirstMove) {
      const randomPosition = randomIntFromInterval(0, 2);
      const firstAiMove = aiOptionsToMove[randomPosition];

      isCircle
        ? createCharacter(document.getElementById(firstAiMove), "circle")
        : createCharacter(document.getElementById(firstAiMove), "x");
      
      ai++;
      isTheFirstMove = false;
    }

    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  };

  function decideWin() {
    let charactersOnWinPossibilities = [];

    const possibilityMatched = 
      winPossibilities.filter(pos => pos.every(option => positionsUsed.includes(option)));

    if (possibilityMatched.length !== 0) {
      possibilityMatched.forEach(pos => {
        const charactersClasses = pos.map(p => document.getElementById(p).classList[1]);
        charactersOnWinPossibilities.push(charactersClasses);
      });    
    }

    const win = 
      charactersOnWinPossibilities.filter(item => item.every(character => character === item[0]));
    
    if (win.length !== 0) thereIsAWin = true;

    if (thereIsAWin) {
      const characterWinner = win[0][0];
      characterWinner === "circle" ? writeWinner("circle") : writeWinner("x");
      winTrack.play();
    }

    function writeWinner(w) {
      winnerText.textContent = `${w} wins!`;
      winnerText.classList.add(`${w}-winner`);
    }
  }
}