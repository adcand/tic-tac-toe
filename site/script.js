const getPositions = document.querySelectorAll(".position");
const winnerText = document.querySelector(".winner");
const positions = Array.from(getPositions);
const winTrack = document.querySelector("#win-track");

positions.forEach(area => area.addEventListener("click", init));

let humanCharacter, aiCharacter;
let thereIsAWin = false;
let positionsUsed = [];
let isTheFirstMove = true;
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
  
  if (circleDecided) {
    humanCharacter = "circle";
    aiCharacter = "x"; 
  } else {
    humanCharacter = "x";
    aiCharacter = "circle";
  }
}();

function init(e) {
  const areaContainsCharacter = e.target.classList.length > 1;
  const isValid = !areaContainsCharacter && !thereIsAWin;

  if (isValid) {
    createCharacter(e.target, humanCharacter);
    makeAiPlay();
    decideWin();
  }

  return;

  function makeAiPlay() {
    const bestPositions = ["b1", "b3", "b7", "b9"];
    let bestPositionAvailable = false;
    let aiOptionsToMove = []; 

    allAvailablePositions = [] // Restarted because a move was made
    getAllAvailablePositions();

    if (allAvailablePositions.length === 0) return;

    allAvailablePositions.forEach(pos => {
      bestPositionAvailable = bestPositions.includes(pos);
      if (bestPositionAvailable) aiOptionsToMove.push(pos);
    });

    if (bestPositionAvailable && isTheFirstMove) {
      const randomPosition = randomIntFromInterval(0, 2);
      const firstAiMove = aiOptionsToMove[randomPosition];

      createCharacter(document.getElementById(firstAiMove), aiCharacter);
      isTheFirstMove = false;
      return;
    } 
    
    const positionSelected = randomIntFromInterval(0, allAvailablePositions.length - 1);
    const positionToMove = document.getElementById(allAvailablePositions[positionSelected]);
    createCharacter(positionToMove, aiCharacter);

    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  };

  function createCharacter(e, character) {
    e.classList.add(character);
    positionsUsed.push(e.id);
  }

  function getAllAvailablePositions() {
    positions.forEach(p => {
      if (p.classList.length === 1) allAvailablePositions.push(p.id);
    });
  }

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
