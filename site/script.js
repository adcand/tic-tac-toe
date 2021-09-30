const getPositions = document.querySelectorAll(".position");
const winnerText = document.querySelector(".winner");
const positions = Array.from(getPositions);
const winTrack = document.querySelector("#win-track");

positions.forEach(area => area.addEventListener("click", addCharacter));

let isCircle = thereIsAWin = false;
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
  const randomValue = Math.random();
  const circleDecided = randomValue > 0.5;
  if (circleDecided) isCircle = true;
})();

function addCharacter(e) {
  const areaContainsCharacter = 
    e.target.classList.contains("circle") || 
    e.target.classList.contains("x");

  const isValid = !areaContainsCharacter && !thereIsAWin;

  if (isValid) {
    if (isCircle) {
      createCharacter(e, "circle");
      decideWin();
      return isCircle = false;
    }

    createCharacter(e, "x");
    decideWin();
    isCircle = true;
  }

  return;

  function createCharacter(e, character) {
    e.target.classList.add(character);
    positionsUsed.push(e.target.id);
  }
}

function decideWin() {
  let charactersUsed = [];

  const possibilityMatched = 
    winPossibilities.filter(pos => pos.every(option => positionsUsed.includes(option)));

  if (possibilityMatched.length !== 0) {
    possibilityMatched.forEach(pos => {
      const charactersClasses = pos.map(p => document.getElementById(p).classList[1]);
      charactersUsed.push(charactersClasses);
    });    
  }

  const win = charactersUsed.filter(item => item.every(character => character === item[0]));
  
  if (win.length !== 0) {
    const characterWinner = win[0][0];

    if (characterWinner === "circle") {
      winnerText.textContent = "Circle wins!";
      winnerText.classList.add("circle-winner");
      winTrack.play();
      return thereIsAWin = true;
    }

    winnerText.textContent = "X wins!";
    winnerText.classList.add("x-winner");
    winTrack.play();
    thereIsAWin = true;
  }
}