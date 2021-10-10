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
  ["b3", "b5", "b7"],
];

!(function setCharacter() {
  const randomValue = Math.random();
  const circleDecided = randomValue > 0.5;

  if (circleDecided) {
    humanCharacter = "circle";
    aiCharacter = "x";
  } else {
    humanCharacter = "x";
    aiCharacter = "circle";
  }
})();

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
    allAvailablePositions = []; // Restarted because a move was made
    getAllAvailablePositions();

    if (thereIsAWin || allAvailablePositions.length === 0) return;

    const bestPositions = ["b1", "b3", "b7", "b9"]; 
    let toIntercept = [];
    let aiOptionsToMove = [];
    let positionToMove;

    // First AI play 

    allAvailablePositions.forEach(pos => {
      const bestPositionAvailable = bestPositions.includes(pos);
      if (bestPositionAvailable) aiOptionsToMove.push(pos);
    });

    if (isTheFirstMove) {
      const randomPosition = randomIntFromInterval(0, 2);
      positionToMove = document.getElementById(aiOptionsToMove[randomPosition]);
      createCharacter(positionToMove, aiCharacter);
      isTheFirstMove = false;
      return;
    }

    // Next AI plays

    positionsUsed.forEach(p => {
      const el = document.getElementById(p).classList[1];
      if (el === humanCharacter) toIntercept.push(p);
    });

    let humanWinPossibility = winPossibilities.filter(i =>
      toIntercept.every(o => i.includes(o))
    );

    let possibilityClassNames = [];
    
    if (humanWinPossibility.length !== 0) {
      humanWinPossibility[0].map(p => {
        possibilityClassNames.push(document.getElementById(p).classList[1])
      });  
    }

    let humanCantWin = possibilityClassNames.every(item => typeof item === "string");

    if (humanWinPossibility.length === 0 || humanCantWin) {
      const positionIndex = randomIntFromInterval(0, allAvailablePositions.length - 1);
      const random = document.getElementById(allAvailablePositions[positionIndex]);
      createCharacter(random, aiCharacter);
      humanCantWin = false;
      return; 
    }

    humanWinPossibility[0].forEach(p => {
      const noCharacterOnPosition = document.getElementById(p).classList.length === 1;

      if (noCharacterOnPosition) {
        positionToMove = document.getElementById(p);
      }
    });

    createCharacter(positionToMove, aiCharacter);
    toIntercept = [];

    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }

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

    const possibilityMatched = winPossibilities.filter(pos =>
      pos.every(option => positionsUsed.includes(option))
    );

    if (possibilityMatched.length !== 0) {
      possibilityMatched.forEach(pos => {
        const charactersClasses = pos.map(p => document.getElementById(p).classList[1]);
        charactersOnWinPossibilities.push(charactersClasses);
      });
    }

    const win = charactersOnWinPossibilities.filter(item =>
      item.every(character => character === item[0])
    );

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
