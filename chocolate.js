document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

const grid = document.getElementById('grid');
const chocoCountDisplay = document.getElementById('choco-count');
const restartBtn = document.getElementById('restart-btn');
const winModal = document.getElementById('win-modal');

// Sounds
const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

// Close Modal Logic
document.querySelector('.close-modal').addEventListener('click', closeModal);

window.onclick = function (event) {
    if (event.target == winModal) {
        closeModal();
    }
}

function closeModal() {
    winModal.classList.add('hidden');
}

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

    // Reset Sound
    clickSound.volume = 0.5;
    winSound.volume = 0.5;

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

    // 3. Calculate Numbers (FIXED LOGIC)
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % cols === 0);
        const isRightEdge = (i % cols === cols - 1);

        if (squares[i].getAttribute('data-type') === 'valid') {
            // Check all 8 directions with CORRECT boundaries

            // West
            if (i > 0 && !isLeftEdge && squares[i - 1].getAttribute('data-type') === 'mine') total++;

            // East
            if (i < (rows * cols) - 1 && !isRightEdge && squares[i + 1].getAttribute('data-type') === 'mine') total++;

            // North
            if (i >= cols && squares[i - cols].getAttribute('data-type') === 'mine') total++;

            // South
            if (i < (rows * cols) - cols && squares[i + cols].getAttribute('data-type') === 'mine') total++;

            // North West
            if (i >= cols && !isLeftEdge && squares[i - cols - 1].getAttribute('data-type') === 'mine') total++;

            // North East
            if (i >= cols && !isRightEdge && squares[i - cols + 1].getAttribute('data-type') === 'mine') total++;

            // South West
            if (i < (rows * cols) - cols && !isLeftEdge && squares[i + cols - 1].getAttribute('data-type') === 'mine') total++;

            // South East
            if (i < (rows * cols) - cols && !isRightEdge && squares[i + cols + 1].getAttribute('data-type') === 'mine') total++;

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
            clickSound.currentTime = 0;
            clickSound.play();
        } else {
            square.classList.remove('flag');
            square.innerHTML = '';
        }
    }
}

function click(square) {
    if (isGameOver) return;
    if (square.classList.contains('revealed') || square.classList.contains('flag')) return;

    clickSound.currentTime = 0;
    clickSound.play();

    if (square.getAttribute('data-type') === 'mine') {
        gameOver(square);
    } else {
        let total = square.getAttribute('data-total');
        if (total != 0) {
            square.classList.add('revealed');
            square.classList.add('checked');
            square.innerHTML = total;
            checkForWin();
            return;
        }
        checkSquare(square, parseInt(square.id));
    }
    square.classList.add('revealed');
}

// RECURSIVE FLOOD FILL (Fixed Logic)
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % cols === 0);
    const isRightEdge = (currentId % cols === cols - 1);

    setTimeout(() => {
        if (square.classList.contains('checked')) return;

        square.classList.add('revealed');
        square.classList.add('checked');

        // Show Chocolate
        square.classList.add('chocolate');
        square.innerHTML = '🍫';

        let neighbors = [];

        // West
        if (currentId > 0 && !isLeftEdge) neighbors.push(currentId - 1);
        // East
        if (currentId < (rows * cols) - 1 && !isRightEdge) neighbors.push(currentId + 1);
        // North
        if (currentId >= cols) neighbors.push(currentId - cols);
        // South
        if (currentId < (rows * cols) - cols) neighbors.push(currentId + cols);
        // North West
        if (currentId >= cols && !isLeftEdge) neighbors.push(currentId - cols - 1);
        // North East
        if (currentId >= cols && !isRightEdge) neighbors.push(currentId - cols + 1);
        // South West
        if (currentId < (rows * cols) - cols && !isLeftEdge) neighbors.push(currentId + cols - 1);
        // South East
        if (currentId < (rows * cols) - cols && !isRightEdge) neighbors.push(currentId + cols + 1);

        neighbors.forEach(neighborId => {
            const newSquare = document.getElementById(neighborId);
            const newTotal = newSquare.getAttribute('data-total');
            if (!newSquare.classList.contains('checked')) {
                if (newTotal != 0) {
                    newSquare.classList.add('revealed');
                    newSquare.classList.add('checked');
                    newSquare.innerHTML = newTotal;
                } else {
                    checkSquare(newSquare, neighborId);
                }
            }
        });

        checkForWin();

    }, 10);
}

function gameOver(square) {
    isGameOver = true;
    loseSound.currentTime = 0;
    loseSound.play();

    squares.forEach(sq => {
        if (sq.getAttribute('data-type') === 'mine') {
            sq.innerHTML = '🥦';
            sq.classList.add('mine');
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
        if (!isGameOver) {
            isGameOver = true;
            winSound.currentTime = 0;
            winSound.play();
            winModal.classList.remove('hidden');
            startConfetti();
        }
    }
}

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