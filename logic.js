const gameContainer = document.getElementById('game-container');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');

let grid = [];
let score = 0;
let gameOver = false;

function initGrid() {
    grid = [];
    for (let i = 0; i < 4; i++) {
        grid.push([0, 0, 0, 0]);
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.strokeRect(10 + j * 100, 10 + i * 100, 90, 90);
        }
    }
}

function drawTiles() {
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] > 0) {
                ctx.fillStyle = '#eee';
                ctx.fillRect(10 + j * 100, 10 + i * 100, 90, 90);
                ctx.fillStyle = 'black';
                ctx.fillText(grid[i][j], 55 + j * 100, 55 + i * 100);
            }
        }
    }
}

function addTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push([i, j]);
            }
        }
    }
    if (emptyCells.length === 0) return;
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    let [row, col] = emptyCells[randomIndex];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
    let arr = row.filter(val => val);
    while (arr.length < 4) arr.push(0);
    return arr;
}

function combine(row) {
    for (let i = 0; i < 3; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    return row;
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let original = [...grid[i]];
        let row = slide(grid[i]);
        row = combine(row);
        row = slide(row);
        grid[i] = row;
        if (grid[i].toString() !== original.toString()) moved = true;
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let original = [...grid[i]];
        let row = slide(grid[i].slice().reverse());
        row = combine(row);
        row = slide(row);
        grid[i] = row.reverse();
        if (grid[i].toString() !== original.toString()) moved = true;
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) col.push(grid[i][j]);
        let original = [...col];
        col = slide(col);
        col = combine(col);
        col = slide(col);
        for (let i = 0; i < 4; i++) grid[i][j] = col[i];
        if (col.toString() !== original.toString()) moved = true;
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 3; i >= 0; i--) col.push(grid[i][j]);
        let original = [...col];
        col = slide(col);
        col = combine(col);
        col = slide(col);
        for (let i = 3; i >= 0; i--) grid[i][j] = col[3 - i];
        if (col.toString() !== original.toString()) moved = true;
    }
    return moved;
}

function hasMoves() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return true;
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return true;
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return true;
        }
    }
    return false;
}

function showGameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', gameCanvas.width / 2, gameCanvas.height / 2);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 20, 390);
}

function init() {
    score = 0;
    gameOver = false;
    initGrid();
    addTile();
    addTile();
    drawGrid();
    drawTiles();
    drawScore();
}

document.addEventListener('keydown', function(event) {
    if (gameOver) return;
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    if (moved) {
        addTile();
        drawGrid();
        drawTiles();
        drawScore();
        if (!hasMoves()) {
            gameOver = true;
            showGameOver();
        }
    }
});

init();
// ...existing code...