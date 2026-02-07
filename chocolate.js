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
const totalMines = 3;

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

    // 1. Create Game Array
    const minesArray = Array(totalMines).fill('mine');
    const emptyArray = Array(rows * cols - totalMines).fill('valid');
    const gameArray = emptyArray.concat(minesArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    // 2. Build Grid
    for (let i = 0; i < rows * cols; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add('cell');
        square.setAttribute('data-type', shuffledArray[i]);

        square.addEventListener('click', function (e) {
            click(square);
        });

        square.oncontextmenu = function (e) {
            e.preventDefault();
            addFlag(square);
        }

        grid.appendChild(square);
        squares.push(square);
    }

    // 3. Calculate Numbers
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % cols === 0);
        const isRightEdge = (i % cols === cols - 1);

        if (squares[i].getAttribute('data-type') === 'valid') {
            if (i > 0 && !isLeftEdge && squares[i - 1].getAttribute('data-type') === 'mine') total++;
            if (i > 9 && !isRightEdge && squares[i + 1 - cols].getAttribute('data-type') === 'mine') total++;
            if (i > 9 && squares[i - cols].getAttribute('data-type') === 'mine') total++;
            if (i > 9 && !isLeftEdge && squares[i - 1 - cols].getAttribute('data-type') === 'mine') total++;
            if (i < 24 && !isRightEdge && squares[i + 1].getAttribute('data-type') === 'mine') total++;
            if (i < 15 && !isLeftEdge && squares[i - 1 + cols].getAttribute('data-type') === 'mine') total++;
            if (i < 15 && !isRightEdge && squares[i + 1 + cols].getAttribute('data-type') === 'mine') total++;
            if (i < 15 && squares[i + cols].getAttribute('data-type') === 'mine') total++;
            squares[i].setAttribute('data-total', total);
        }
    }
}

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

    if (square.getAttribute('data-type') === 'mine') {
        gameOver(square);
    } else {
        let total = square.getAttribute('data-total');

        if (total != 0) {
            square.classList.add('revealed');
            square.classList.add('checked');
            square.innerHTML = total; // Show Number
            return;
        }

        // RECURSION FOR EMPTY SPOTS
        checkSquare(square, currentId);
    }
    square.classList.add('revealed');
}

function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % cols === 0);
    const isRightEdge = (currentId % cols === cols - 1);

    setTimeout(() => {
        if (square.classList.contains('checked')) return;

        square.classList.add('revealed');
        square.classList.add('checked');

        // --- CHANGE: SHOW CHOCOLATE IF EMPTY ---
        square.classList.add('chocolate'); // Add special style
        square.innerHTML = '🍫';           // Add the emoji

        let neighbors = [];
        if (currentId > 0 && !isLeftEdge) neighbors.push(parseInt(currentId) - 1);
        if (currentId > 9 && !isRightEdge) neighbors.push(parseInt(currentId) + 1 - cols);
        if (currentId > 9) neighbors.push(parseInt(currentId) - cols);
        if (currentId > 9 && !isLeftEdge) neighbors.push(parseInt(currentId) - 1 - cols);
        if (currentId < 24 && !isRightEdge) neighbors.push(parseInt(currentId) + 1);
        if (currentId < 15 && !isLeftEdge) neighbors.push(parseInt(currentId) - 1 + cols);
        if (currentId < 15 && !isRightEdge) neighbors.push(parseInt(currentId) + 1 + cols);
        if (currentId < 15) neighbors.push(parseInt(currentId) + cols);

        neighbors.forEach(neighborId => {
            const newSquare = document.getElementById(neighborId);
            const newTotal = newSquare.getAttribute('data-total');

            if (!newSquare.classList.contains('checked')) {
                // If neighbor is a Number (1,2,3), reveal it but stop recursion
                if (newTotal != 0) {
                    newSquare.classList.add('revealed');
                    newSquare.classList.add('checked');
                    newSquare.innerHTML = newTotal;
                } else {
                    // If neighbor is also 0, keep recursing!
                    checkSquare(newSquare, neighborId);
                }
            }
        });

        // Check win after recursion finishes
        checkForWin();

    }, 10);
}

function gameOver(square) {
    isGameOver = true;
    squares.forEach(sq => {
        if (sq.getAttribute('data-type') === 'mine') {
            sq.innerHTML = '🥦';
            sq.classList.add('mine');
            // Force remove 'cell' transparency issue by adding 'mine' class
            // CSS handles visibility now
        }
    });
    restartBtn.style.display = 'inline-block';
}

function checkForWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('checked') && squares[i].getAttribute('data-type') === 'valid') {
            matches++;
        }
    }
    chocoCountDisplay.innerText = ((rows * cols) - totalMines) - matches;
    if (matches === (rows * cols) - totalMines) {
        isGameOver = true;
        winModal.classList.remove('hidden');
        startConfetti();
    }
}

// ... Keep your existing Confetti code below ...
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