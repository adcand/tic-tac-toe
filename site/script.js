const positions = document.querySelectorAll(".position");
const winnerText = document.querySelector(".winner");
const winTrack = document.querySelector("#win-track");

positions.forEach(area => area.addEventListener("click", init));

let humanCharacter, aiCharacter;
let thereIsAWin = false;
let allAvailablePositions;
let positionsUsed = [];
let isTheFirstMove = true;
let aiInterceptCounter = 0;
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

    const noPositionAvailable = allAvailablePositions.length === 0;

    if (thereIsAWin || noPositionAvailable) return;

    const bestPositions = ["b1", "b3", "b7", "b9"]; 

    let aiOptionsToMove = [];
    let positionToMove;

    // First turn 

    if (isTheFirstMove) {
      allAvailablePositions.forEach(pos => {
        const bestPositionAvailable = bestPositions.includes(pos);
        if (bestPositionAvailable) aiOptionsToMove.push(pos);
      });

      const randomPosition = randomIntFromInterval(0, aiOptionsToMove.length - 1);
      positionToMove = document.getElementById(aiOptionsToMove[randomPosition]);
      createCharacter(positionToMove, aiCharacter);
      isTheFirstMove = false;
      return;
    }

    // Next turns

    let nextAiOptionsToMove = [];
    let toIntercept = [];
    let toWin = [];
    let arrayIndexToRemove = [];
    let emptyBoardPositions = [];

    positionsUsed.forEach(p => {
      getClassName(p) === humanCharacter ? toIntercept.push(p): toWin.push(p);
    });

    // If, in your two last turns, you chose two positions that can lead you to a win, the ai will
    // find the win possibility
    switch (aiInterceptCounter) {
      case 1: 
        toIntercept.shift();
        break;
      case 2: 
        toIntercept.splice(0, 2);
        break;
      case 3:
        toIntercept.splice(0, 3);
        break;
    }

    let humanWinPossibility =
      winPossibilities.filter(i => toIntercept.every(pos => i.includes(pos)));

    let aiWinPossibility = 
      winPossibilities.filter(i => toWin.every(pos => i.includes(pos)));

    aiWinPossibility.forEach(p => {
      p.map(a => {
        if (getClassName(a) === humanCharacter) {
          // A human character disrupts ai win possibility
          arrayIndexToRemove.push(aiWinPossibility.indexOf(p));
        } 
      });
    });
    
    arrayIndexToRemove.forEach(removable => delete aiWinPossibility[removable]);

    // Now only real win possibilities to the ai
    aiWinPossibility.forEach(i => {
      if (i.length !== 0) nextAiOptionsToMove.push(i);
    });

    nextAiOptionsToMove.forEach(a => {
      a.map(a => {
        if (!getClassName(a)) {
          emptyBoardPositions.push(document.getElementById(a));
        }
      });
    });

    let humanPossibilityClassNames = [];
    
    if (humanWinPossibility.length !== 0) {
      humanWinPossibility[0].map(p => {
        humanPossibilityClassNames.push(getClassName(p));
      });  
    }

    // An ai character disrupts human win possibility
    let humanCantWin = 
      humanPossibilityClassNames.every(item => typeof item === "string");

    if (humanCantWin) {
      if (nextAiOptionsToMove.length !== 0) {
        createCharacter(emptyBoardPositions[0], aiCharacter);
      } else {
        // Chooses a random position on the board
        positionToMove = randomIntFromInterval(0, allAvailablePositions.length - 1);
        const nextRandomPosition = document.getElementById(allAvailablePositions[positionToMove]);
        createCharacter(nextRandomPosition, aiCharacter);
      }

      return;
    }

    // Disrupt human win possibility
    humanWinPossibility[0].forEach(p => {
      const noCharacterOnPosition = !getClassName(p);

      if (noCharacterOnPosition) {
        positionToMove = document.getElementById(p);
        createCharacter(positionToMove, aiCharacter);
        aiInterceptCounter++;
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
