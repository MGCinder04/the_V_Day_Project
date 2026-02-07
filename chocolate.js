document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

const grid = document.getElementById('grid');
const chocoCountDisplay = document.getElementById('choco-count');
const restartBtn = document.getElementById('restart-btn');
const winModal = document.getElementById('win-modal');

// Game Config
const rows = 5;
const cols = 5;
const totalMines = 3; // 3 Broccolis

let squares = [];
let isGameOver = false;

function initGame() {
    grid.innerHTML = "";
    restartBtn.style.display = 'none';
    winModal.classList.add('hidden');
    isGameOver = false;
    squares = [];

    // Update Display
    chocoCountDisplay.innerText = (rows * cols) - totalMines;

    // 1. Create the scrambled game array
    // Create 'totalMines' of "mine" and the rest "valid"
    const minesArray = Array(totalMines).fill('mine');
    const emptyArray = Array(rows * cols - totalMines).fill('valid');
    const gameArray = emptyArray.concat(minesArray);

    // Shuffle
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    // 2. Build the Grid
    for (let i = 0; i < rows * cols; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add('cell');

        // Add data
        square.setAttribute('data-type', shuffledArray[i]);

        // Click Listeners
        square.addEventListener('click', function (e) {
            click(square);
        });

        // Right click to flag (optional visual cue)
        square.oncontextmenu = function (e) {
            e.preventDefault();
            addFlag(square);
        }

        grid.appendChild(square);
        squares.push(square);
    }

    // 3. Add Numbers (Calculate neighbors)
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % cols === 0);
        const isRightEdge = (i % cols === cols - 1);

        if (squares[i].getAttribute('data-type') === 'valid') {
            // Check neighbors (Left, Right, Top, Bottom, Diagonals)

            // West
            if (i > 0 && !isLeftEdge && squares[i - 1].getAttribute('data-type') === 'mine') total++;
            // North East
            if (i > 9 && !isRightEdge && squares[i + 1 - cols].getAttribute('data-type') === 'mine') total++;
            // North
            if (i > 9 && squares[i - cols].getAttribute('data-type') === 'mine') total++;
            // North West
            if (i > 9 && !isLeftEdge && squares[i - 1 - cols].getAttribute('data-type') === 'mine') total++;
            // East
            if (i < 24 && !isRightEdge && squares[i + 1].getAttribute('data-type') === 'mine') total++;
            // South West
            if (i < 15 && !isLeftEdge && squares[i - 1 + cols].getAttribute('data-type') === 'mine') total++;
            // South East
            if (i < 15 && !isRightEdge && squares[i + 1 + cols].getAttribute('data-type') === 'mine') total++;
            // South
            if (i < 15 && squares[i + cols].getAttribute('data-type') === 'mine') total++;

            squares[i].setAttribute('data-total', total);
        }
    }
}

// --- CORE LOGIC ---

function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('revealed')) {
        if (!square.classList.contains('flag')) {
            square.classList.add('flag');
            square.innerHTML = '🚩';
        } else {
            square.classList.remove('flag');
            square.innerHTML = '';
        }
    }
}

function click(square) {
    let currentId = square.id;

    if (isGameOver) return;
    if (square.classList.contains('revealed') || square.classList.contains('flag')) return;

    // HIT A MINE (BROCCOLI)
    if (square.getAttribute('data-type') === 'mine') {
        gameOver(square);
    } else {
        // SAFE (CHOCOLATE)
        let total = square.getAttribute('data-total');

        if (total != 0) {
            // It has a number (danger nearby) -> Reveal just this one
            square.classList.add('revealed');
            square.innerHTML = total;
            square.classList.add('checked'); // Adds styling for numbers
            // Color code numbers
            if (total == 1) square.style.color = '#blue';
            if (total == 2) square.style.color = '#green';
            if (total == 3) square.style.color = '#red';
            checkForWin();
            return;
        }

        // It is 0 (Safe Zone) -> RECURSIVE REVEAL
        checkSquare(square, currentId);
    }
    square.classList.add('revealed');
    checkForWin();
}

// --- THE FLOOD FILL ALGORITHM ---
// This reveals huge areas if they are empty
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % cols === 0);
    const isRightEdge = (currentId % cols === cols - 1);

    setTimeout(() => {
        if (square.classList.contains('checked')) return; // Stop if already checked

        // Reveal this square
        square.classList.add('revealed');
        square.classList.add('checked');
        square.innerHTML = ''; // Empty squares stay empty

        // Recursively check neighbors
        let neighbors = [];

        // Logic to grab valid neighbor IDs
        if (currentId > 0 && !isLeftEdge) neighbors.push(parseInt(currentId) - 1);
        if (currentId > 9 && !isRightEdge) neighbors.push(parseInt(currentId) + 1 - cols);
        if (currentId > 9) neighbors.push(parseInt(currentId) - cols);
        if (currentId > 9 && !isLeftEdge) neighbors.push(parseInt(currentId) - 1 - cols);
        if (currentId < 24 && !isRightEdge) neighbors.push(parseInt(currentId) + 1);
        if (currentId < 15 && !isLeftEdge) neighbors.push(parseInt(currentId) - 1 + cols);
        if (currentId < 15 && !isRightEdge) neighbors.push(parseInt(currentId) + 1 + cols);
        if (currentId < 15) neighbors.push(parseInt(currentId) + cols);

        // Process neighbors
        neighbors.forEach(neighborId => {
            const newSquare = document.getElementById(neighborId);
            const newTotal = newSquare.getAttribute('data-total');

            // If neighbor is NOT a mine and NOT revealed
            if (!newSquare.classList.contains('checked')) {
                if (newTotal != 0) {
                    // Stop recursion here, but reveal this number
                    newSquare.classList.add('revealed');
                    newSquare.classList.add('checked');
                    newSquare.innerHTML = newTotal;
                } else {
                    // Keep spreading!
                    checkSquare(newSquare, neighborId);
                }
            }
        });

    }, 10);
}

function gameOver(square) {
    isGameOver = true;

    // Show all Broccolis
    squares.forEach(sq => {
        if (sq.getAttribute('data-type') === 'mine') {
            sq.innerHTML = '🥦';
            sq.classList.add('mine');
            sq.classList.remove('cell'); // Remove bevel
        }
    });

    restartBtn.style.display = 'inline-block';
}

function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
        // Count how many SAFE squares are revealed
        if (squares[i].classList.contains('checked') && squares[i].getAttribute('data-type') === 'valid') {
            matches++;
        }
    }

    // Update counter
    chocoCountDisplay.innerText = ((rows * cols) - totalMines) - matches;

    // Did we find all safe squares?
    if (matches === (rows * cols) - totalMines) {
        isGameOver = true;
        winModal.classList.remove('hidden');
        startConfetti();
    }
}

// ... Keep your existing Confetti code here ...
function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ffd700', '#8d6e63', '#4e342e', '#ffecb3', '#fff'];

    for (let i = 0; i < 300; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            speed: Math.random() * 5 + 2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            p.y += p.speed;
            if (p.y > canvas.height) p.y = -20;
        });
        if (!winModal.classList.contains('hidden')) {
            requestAnimationFrame(animate);
        }
    }
    animate();
}