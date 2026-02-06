// --- CONFIGURATION ---
const messages = [
    "For you! 🌹",
    "You're amazing! ✨",
    "Be mine? 💖",
    "Sending Love! 💌",
    "Cutie! 😘",
    "Forever Us! ♾️"
];

const gardener = document.getElementById('gardener');
const ground = document.getElementById('ground-area');
let isRunning = false;

// --- PARALLAX EFFECT (SLOWER & SMOOTHER) ---
document.addEventListener('mousemove', (e) => {
    // Calculate mouse position as a percentage (-1 to 1)
    const x = (window.innerWidth - e.pageX * 2) / 100;

    // Multipliers are much smaller now for subtle movement
    // Back mountains move very little (0.5px per unit)
    document.querySelector('.mountains-back').style.transform = `translateX(${x * 0.5}px)`;

    // Front mountains move slightly more (1.2px per unit)
    document.querySelector('.mountains-front').style.transform = `translateX(${x * 1.2}px)`;
});


// --- PLANTING LOGIC ---
function plantRose(event) {
    if (isRunning) return;
    isRunning = true;

    const clickX = event.clientX;
    const rect = ground.getBoundingClientRect();
    const relativeX = clickX - rect.left;

    // Target the image to flip it
    const gardenerImg = gardener.querySelector('img');
    const currentLeft = gardener.offsetLeft;

    // Variable to track facing direction (1 = Right, -1 = Left)
    let facingDir = 1;

    // 1. Face the correct direction
    if (clickX < currentLeft) {
        gardenerImg.style.transform = "scaleX(-1)"; // Face Left
        facingDir = -1;
    } else {
        gardenerImg.style.transform = "scaleX(1)"; // Face Right
        facingDir = 1;
    }

    // 2. Run to the spot (Centered on mouse)
    // We subtract 60px to center her, but we save this position to use later
    const targetPos = relativeX - 60;
    gardener.style.left = `${targetPos}px`;

    // 3. Wait 2.5 seconds for the run to finish
    setTimeout(() => {

        // --- PLANT THE ROSE ---
        const rose = document.createElement('div');
        rose.classList.add('rose');
        rose.innerHTML = "🌹";
        // Plant exactly at the click X, not the character X
        rose.style.left = `${relativeX}px`;

        const msg = document.createElement('div');
        msg.classList.add('msg-bubble');
        msg.innerText = messages[Math.floor(Math.random() * messages.length)];
        rose.appendChild(msg);

        ground.appendChild(rose);

        // --- THE "STEP BACK" MOVE ---
        // If facing Right (1), step Left (-120px)
        // If facing Left (-1), step Right (+120px)
        const stepBackDistance = 120;
        const newPos = targetPos - (facingDir * stepBackDistance);

        gardener.style.left = `${newPos}px`;

        // 4. Cooldown (Wait for the step back to finish before unlocking)
        setTimeout(() => {
            isRunning = false;
        }, 1000); // 1 extra second for the step back

    }, 2500);
}