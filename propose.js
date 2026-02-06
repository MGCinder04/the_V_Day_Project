// 1. The "Run Away" Logic
function moveButton() {
    const noBtn = document.getElementById('noBtn');

    // Get window size (boundaries)
    const maxWidth = window.innerWidth - noBtn.offsetWidth;
    const maxHeight = window.innerHeight - noBtn.offsetHeight;

    // Generate random position
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    // Apply new position
    noBtn.style.position = 'fixed'; // Make it break out of the flex container
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';

    // Optional: Make Yes button grow slightly every time she tries to click No
    const yesBtn = document.querySelector('.yes-btn');
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = (currentSize * 1.1) + 'px';
}

// 2. The "Success" Logic
function acceptProposal() {
    // Hide the question card
    document.querySelector('.proposal-container').style.display = 'none';

    // Show the success message
    document.getElementById('success-message').classList.remove('hidden');

    // Launch Confetti!
    startConfetti();
}

// 3. Simple Confetti Effect (No external library needed)
function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff4d6d', '#ff8fa3', '#fff0f3', '#ffd700', '#2ecc71'];

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

            // Reset if it falls off screen
            if (p.y > canvas.height) p.y = -20;
        });
        requestAnimationFrame(animate);
    }
    animate();
}