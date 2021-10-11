const getPositions = document.querySelectorAll(".position");
const winnerText = document.querySelector(".winner");
const positions = Array.from(getPositions);
const winTrack = document.querySelector("#win-track");

positions.forEach(area => area.addEventListener("click", init));

let humanCharacter, aiCharacter;
let thereIsAWin = false;
let allAvailablePositions;
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
    decideWin();
    makeAiPlay();
    decideWin();
  }

  return;

  function makeAiPlay() {
    allAvailablePositions = [];
    getAllAvailablePositions();

    let noPositionAvailable = allAvailablePositions.length === 0;

    if (thereIsAWin || noPositionAvailable) return;

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

    let nextAiOptionsToMove = [];
    let arrayIndexToRemove = [];
    let toWin = [];
    let filteredOptions = [];

    positionsUsed.forEach(p => {
      getClassName(p) === humanCharacter ? toIntercept.push(p): toWin.push(p);
    });

    let humanWinPossibility =
      winPossibilities.filter(i => toIntercept.every(pos => i.includes(pos)));

    let aiWinPossibility = 
      winPossibilities.filter(i => toWin.every(pos => i.includes(pos)));

    aiWinPossibility.forEach(p => {
      p.map(a => {
        if (getClassName(a) === humanCharacter) {
          arrayIndexToRemove.push(aiWinPossibility.indexOf(p));
        } 
      });
    });
    
    arrayIndexToRemove.forEach(removable => delete aiWinPossibility[removable]);

    aiWinPossibility.forEach(i => {
      if (i.length !== 0) nextAiOptionsToMove.push(i);
    });

    nextAiOptionsToMove.forEach(a => {
      a.map(a => {
        if (!getClassName(a)) {
          filteredOptions.push(document.getElementById(a));
        }
      });
    });

    let humanPossibilityClassNames = [];
    
    if (humanWinPossibility.length !== 0) {
      humanWinPossibility[0].map(p => {
        humanPossibilityClassNames.push(getClassName(p));
      });  
    }

    let humanCantWin = 
      humanPossibilityClassNames.every(item => typeof item === "string");

    if (humanCantWin) {
      if (nextAiOptionsToMove.length !== 0) {
        createCharacter(filteredOptions[0], aiCharacter);
      } else {
        const positionIndex = randomIntFromInterval(0, allAvailablePositions.length - 1);
        const random = document.getElementById(allAvailablePositions[positionIndex]);
        createCharacter(random, aiCharacter);
      }

      return;
    }

    humanWinPossibility[0].forEach(p => {
      const noCharacterOnPosition = !getClassName(p);

      if (noCharacterOnPosition) {
        positionToMove = document.getElementById(p);
        createCharacter(positionToMove, aiCharacter);
      }
    });

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
        const charactersClasses = pos.map(p => getClassName(p));
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

  function getClassName(id) {
    return document.getElementById(id).classList[1];
  }
}
