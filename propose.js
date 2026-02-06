// --- CONFIGURATION ---
const OFFSET = 100; // The "Danger Zone" radius (pixels)
const RUN_DIST = 100; // How far it runs per jump

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');

// 1. INITIAL SETUP: Place 'No' next to 'Yes'
function centerNoButton() {
    const yesRect = yesBtn.getBoundingClientRect();
    noBtn.style.left = (yesRect.right + 20) + 'px';
    noBtn.style.top = yesRect.top + 'px';
}
window.onload = centerNoButton;
window.onresize = centerNoButton;

// 2. THE INTELLIGENT RUNNER
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const buttonRect = noBtn.getBoundingClientRect();

    // Get center of button
    const btnX = buttonRect.left + buttonRect.width / 2;
    const btnY = buttonRect.top + buttonRect.height / 2;

    // Calculate distance
    const dist = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2));

    // If mouse is too close, trigger the escape
    if (dist < OFFSET) {
        runAway(x, y, btnX, btnY);
    }
});

function runAway(mouseX, mouseY, btnX, btnY) {
    // 1. Calculate the angle AWAY from the mouse
    // (Button Center - Mouse Position) gives us the direction vector
    const deltaX = btnX - mouseX;
    const deltaY = btnY - mouseY;
    const angle = Math.atan2(deltaY, deltaX);

    // 2. Calculate new position based on that angle
    // We add randomness (-0.5 to +0.5 radians) so it's not a perfectly straight line every time
    const randomAngle = angle + (Math.random() - 0.5);

    let newX = btnX + Math.cos(randomAngle) * RUN_DIST;
    let newY = btnY + Math.sin(randomAngle) * RUN_DIST;

    // 3. PAC-MAN WRAPPING LOGIC (The "Teleport")
    // Get screen dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;

    // Check Horizontal Bounds
    if (newX < 0) {
        // If it went too far Left -> Teleport to Right Edge
        newX = width - btnW - 20;
        teleportTo(width, newY); // Visual Trick
    } else if (newX > width - btnW) {
        // If it went too far Right -> Teleport to Left Edge
        newX = 20;
        teleportTo(-btnW, newY); // Visual Trick
    }

    // Check Vertical Bounds
    if (newY < 0) {
        newY = height - btnH - 20;
        teleportTo(newX, height);
    } else if (newY > height - btnH) {
        newY = 20;
        teleportTo(newX, -btnH);
    }

    // 4. Apply the final smooth move
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
}

// Helper to handle the instant warp
function teleportTo(x, y) {
    // Disable transition
    noBtn.classList.add('teleport');

    // Move instantly to the "other side"
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';

    // Force browser to realize we moved (Reflow)
    void noBtn.offsetWidth;

    // Re-enable transition for the next move
    noBtn.classList.remove('teleport');
}

// 5. Success Interaction
function acceptProposal() {
    document.querySelector('.proposal-container').style.display = 'none';
    document.getElementById('success-message').classList.remove('hidden');
    startConfetti();
}

// ... Confetti Code (Keep your existing startConfetti function here) ...
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