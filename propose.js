// --- CONFIGURATION ---
const OFFSET = 100;
const RUN_DIST = 300;

const noBtn = document.getElementById('noBtn');
// We don't need yesBtn for positioning anymore!

// NOTE: centerNoButton function REMOVED. CSS handles the alignment now.

// 2. THE INTELLIGENT RUNNER
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const buttonRect = noBtn.getBoundingClientRect();

    const btnX = buttonRect.left + buttonRect.width / 2;
    const btnY = buttonRect.top + buttonRect.height / 2;

    const dist = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2));

    // If mouse is too close, trigger the escape
    if (dist < OFFSET) {

        // --- KEY FIX: DETACHMENT LOGIC ---
        // If the button is still sitting in the layout (relative),
        // we lock its current coordinates and switch to fixed mode
        // so it can fly freely without jumping.
        if (noBtn.style.position !== 'fixed') {
            const rect = noBtn.getBoundingClientRect();
            noBtn.style.left = rect.left + 'px';
            noBtn.style.top = rect.top + 'px';
            noBtn.style.position = 'fixed';
        }

        runAway(x, y, btnX, btnY);
    }
});

function runAway(mouseX, mouseY, btnX, btnY) {
    const deltaX = btnX - mouseX;
    const deltaY = btnY - mouseY;
    const angle = Math.atan2(deltaY, deltaX);

    const randomAngle = angle + (Math.random() - 0.5);

    let newX = btnX + Math.cos(randomAngle) * RUN_DIST;
    let newY = btnY + Math.sin(randomAngle) * RUN_DIST;

    // PAC-MAN WRAPPING LOGIC
    const width = window.innerWidth;
    const height = window.innerHeight;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;

    if (newX < 0) {
        newX = width - btnW - 20;
        teleportTo(width, newY);
    } else if (newX > width - btnW) {
        newX = 20;
        teleportTo(-btnW, newY);
    }

    if (newY < 0) {
        newY = height - btnH - 20;
        teleportTo(newX, height);
    } else if (newY > height - btnH) {
        newY = 20;
        teleportTo(newX, -btnH);
    }

    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
}

function teleportTo(x, y) {
    noBtn.classList.add('teleport');
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
    void noBtn.offsetWidth;
    noBtn.classList.remove('teleport');
}

function acceptProposal() {
    document.querySelector('.proposal-container').style.display = 'none';
    document.getElementById('success-message').classList.remove('hidden');
    startConfetti();
}

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
            if (p.y > canvas.height) p.y = -20;
        });
        requestAnimationFrame(animate);
    }
    animate();
}