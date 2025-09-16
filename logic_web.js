let board;
let score = 0;

let rows = 4;
let cols = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function initGame() {
  console.log("Game initialized");
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]; // 2D array to represent the game board
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let tile = document.createElement("div");

      tile.id = i + "-" + j;
      let num = board[i][j];

      updateTile(tile, num);
      document.getElementById("board").append(tile);
    }
  }
  setTwo();
  setTwo();
}
function updateTile(tile, num) {
  tile.innerText = ""; // Clear the tile text
  tile.classList.value = ""; // Clear all classes from the tile
  tile.classList.add("tile"); // Add the base tile class
  console.log(num);
  if (num > 0) {
    tile.innerText = num.toString();
    console.log(num);
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
    //tile.classList.add("tile-" + num);
  } else {
    tile.classList.add("tile-0");
  }
}
window.onload = function () {
  initGame();
};

function handleSlide(event) {
  //console.log("Key pressed: " + event.key);
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    event.preventDefault(); // Prevent default scrolling behavior
    //console.log("Invalid key");
    if (event.key === "ArrowLeft" && canMoveLeft()) {
      slideLeft();
      setTwo();
      console.log("slide left");
    } else if (event.key === "ArrowRight" && canMoveRight()) {
      slideRight();
      setTwo();
      console.log("slide right");
    } else if (event.key === "ArrowUp" && canMoveUp()) {
      slideUp1();
      setTwo();
      console.log("slide up");
    } else if (event.key === "ArrowDown" && canMoveDown()) {
      slideDown1();
      setTwo();
      console.log("slide down");
    }

    document.getElementById("score").innerText = score;
    setTimeout(() => {
      console.log(hasLost());
      if (hasLost()) {
        alert("You have lost the game. Click any arrow to restart");
        restartGame();
      } else {
        checkWin();
      }
    }, 100);
  }
}

function restartGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]; // 2D array to represent the game board
  score = 0;
  document.getElementById("score").innerText = score;

  setTwo();
}
function filterZeros(row) {
  return row.filter((num) => num !== 0);
}
function slide(row) {
  row = filterZeros(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0; // Set the next element to 0 after combining
      score += row[i];
    }
  }
  row = filterZeros(row);
  while (row.length < 4) {
    row.push(0);
  }
  return row;
}
/**
 * Slide all tiles in the board to the left.
 * Combines adjacent tiles with the same value.
 * Updates the score with the combined values.
 * @returns {undefined}
 */
function slideLeft() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];

    let originalRow = row.slice();

    row = slide(row);
    board[i] = row;
    for (let j = 0; j < cols; j++) {
      let tile = document.getElementById(i + "-" + j);
      let num = board[i][j];
      if (originalRow[j] !== num && num !== 0) {
        tile.style.animation = "slide-from-right 0.3s ease-in-out";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];
    let originalRow = row.slice();
    row = slide(row.reverse()).reverse();
    board[i] = row;
    for (let j = 0; j < cols; j++) {
      let tile = document.getElementById(i + "-" + j);
      let num = board[i][j];
      if (originalRow[j] !== num && num !== 0) {
        tile.style.animation = "slide-from-left 0.3s ease-in-out";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}

function slideUp1() {
  for (let j = 0; j < cols; j++) {
    let col = [board[0][j], board[1][j], board[2][j], board[3][j]];
    let originalCol = col.slice();
    col = slide(col);
    for (let i = 0; i < rows; i++) {
      board[i][j] = col[i];
      let tile = document.getElementById(i + "-" + j);
      let num = board[i][j];
      if (originalCol[i] !== num && num !== 0) {
        tile.style.animation = "slide-from-bottom 0.3s ease-in-out";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}
function slideUp() {
  for (let j = 0; j < cols; j++) {
    let col = [];
    for (let i = 0; i < rows; i++) {
      col.push(board[i][j]);
    }

    let filteredCol = filterZeros(col);
     let originalCol = col.slice();
    filteredCol = slide(filteredCol);
    while (filteredCol.length < rows) {
      filteredCol.push(0);
    }
    for (let i = 0; i < rows; i++) {
      board[i][j] = filteredCol[i];
      let tile = document.getElementById(i + "-" + j);
      let num = board[i][j];
      if (originalCol[i] !== num && num !== 0) {
        tile.style.animation = "slide-from-bottom 0.3s ease-in-out";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}
function slideDown1() {
  for (let j = 0; j < cols; j++) {
    let col = [board[0][j], board[1][j], board[2][j], board[3][j]];
    let originalCol = col.slice();
    col = slide(col.reverse()).reverse();
    for (let i = 0; i < rows; i++) {
      board[i][j] = col[i];
      let tile = document.getElementById(i + "-" + j);
      let num = board[i][j];
      if (originalCol[i] !== num && num !== 0) {
        tile.style.animation = "slide-from-top 0.3s ease-in-out";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}
function slideDown() {
  for (let j = 0; j < cols; j++) {
    let col = [];
    for (let i = 0; i < rows; i++) {
      col.push(board[i][j]);
    }
    let filteredCol = filterZeros(col);
    let originalCol = col.slice();
    filteredCol = slide(filteredCol.reverse()).reverse();
    while (filteredCol.length < rows) {
      filteredCol.unshift(0);
    }

    for (let i = 0; i < rows; i++) {
      board[i][j] = filteredCol[i];
      let tile = document.getElementById(i + "-" + j);
      let num = board[i][j];
      if (originalCol[i] !== num && num !== 0) {
        tile.style.animation = "slide-from-top 0.3s ease-in-out";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}
document.addEventListener("keydown", handleSlide);

function hasEmptyTile() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return true;
      //if (j < 3 && board[i][j] === board[i][j + 1]) return true;
      //if (i < 3 && board[i][j] === board[i + 1][j]) return true;
    }
  }
  return false;
}
function setTwo() {
  if (!hasEmptyTile()) {
    return;
  } else {
    let found = false;
    while (!found) {
      let row = Math.floor(Math.random() * rows);
      let col = Math.floor(Math.random() * cols);
      if (board[row][col] === 0) {
        found = true;
        board[row][col] = 2;
        //board[row][col] = 2;
        //updateTile(document.getElementById(row + "-" + col), 2);
        let tile = document.getElementById(row + "-" + col);
        tile.innerText = "2"; // Set the tile text to 2
        tile.classList.add("x2");
      }
    }
    score += 2;
  }
}

function canMoveLeft() {
  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (board[i][j - 1] === 0 || board[i][j - 1] === board[i][j]) {
        return true;
      }
    }
  }
  return false;
}
function canMoveRight() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols - 1; j++) {
      if (board[i][j] !== 0) {
        if (board[i][j + 1] === 0 || board[i][j + 1] === board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
function canMoveUp() {
  for (let j = 0; j < cols; j++) {
    for (let i = 1; i < rows; i++) {
      if (board[i][j] !== 0) {
        if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
function canMoveDown() {
  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < rows - 1; i++) {
      if (board[i][j] !== 0) {
        if (board[i + 1][j] === 0 || board[i + 1][j] === board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkWin() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === 2048 && is2048Exist === true) {
        alert("Congrats! You got 2048!");
        is2048Exist = true;
      } else if (board[i][j] === 4096 && is4096Exist === true) {
        alert("Congrats! You got 4096!");
        is4096Exist = true;
      } else if (board[i][j] === 8192 && is8192Exist === true) {
        alert("Victory! You got 8192!");
        is8192Exist = true;
      }
    }
  }
}

function hasLost() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === 0) {
        return false;
      }
      if (
        (i > 0 && board[i][j - 1] === board[i][j]) ||
        (i < rows - 1 && board[i + 1][j] === board[i][j]) ||
        (j > 0 && board[i][j - 1] === board[i][j]) ||
        (j < cols - 1 && board[i][j + 1] === board[i][j])
      ) {
        return false;
      }
    }
  }
  return true;
}
