const getPositions = document.querySelectorAll(".position");
const winnerText = document.querySelector(".winner");
const positions = Array.from(getPositions);

positions.forEach(area => area.addEventListener("click", addCharacter));

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

function addCharacter(e) {
  const emptyArea = e.target.classList.contains("circle");

  if (!emptyArea && !thereIsAWin) {
    createCircle(e);
    positionsUsed.push(e.target.id);
    decideWin();
    return;
  }

  return;

  function createCircle(e) {
    e.target.classList.add("circle");
  }

  function createX(e) {
    e.target.classList.add("x");
  }
}

function decideWin() {
  winPossibilities.forEach(possibility => {
    const win = possibility.every(option => positionsUsed.includes(option));
    
    if (win) {
      winnerText.textContent = "Someone win!"
      thereIsAWin = true;
    };
  });
}

// TODO
// . alternate the characters 
