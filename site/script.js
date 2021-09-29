const getPositions = document.querySelectorAll(".position");
const winnerText = document.querySelector(".winner");
const positions = Array.from(getPositions);

positions.forEach(area => area.addEventListener("click", addCharacter));

let isCircle = false;
let thereIsAWin = false;
let positionsUsed = [];
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

(function setCharacter() {
  let randomValue = Math.random();
  let circleSelected = randomValue > 0.5;

  if (circleSelected) isCircle = true;
})();

function addCharacter(e) {
  const emptyArea = 
    e.target.classList.contains("circle") || 
    e.target.classList.contains("x");

  const isValid = !emptyArea && !thereIsAWin;

  if (isValid) {
    if (isCircle) {
      createCharacter(e, "circle");
      positionsUsed.push(e.target.id);
      decideWin();
      return isCircle = false;
    }

    createCharacter(e, "x");
    positionsUsed.push(e.target.id)
    decideWin();
    isCircle = true;
  }

  return;

  function createCharacter(e, character) {
    e.target.classList.add(character);
  }
}

function decideWin() {
  let charactersOnPositions = [];

  winPossibilities.forEach(possibility => {
    const positionMatched = possibility.every(option => positionsUsed.includes(option));

    if (positionMatched) {
      possibility.forEach(pos => {
        const item = document.getElementById(pos);
        const getCharacterUsed = item.classList[1];
        charactersOnPositions.push(getCharacterUsed);
      });    

      const win = charactersOnPositions.every(character => character === charactersOnPositions[0]);

      if (win) {
        const character = charactersOnPositions[0];
        winnerText.textContent = `${character} wins!`;
        thereIsAWin = true;
      };
    }
  });
}

// TODO
// . Decide win when position is not matched on the first time 
// . Write better code 
