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
    if (isRunning) return; // Busy running
    isRunning = true;

    // 1. Get Click Position
    const clickX = event.clientX;
    const rect = ground.getBoundingClientRect();

    // Calculate position relative to the container
    const relativeX = clickX - rect.left;

    // 2. Face the right direction
    const currentLeft = gardener.offsetLeft;
    if (clickX < currentLeft) {
        gardener.style.transform = "scaleX(-1)"; // Face Left
    } else {
        gardener.style.transform = "scaleX(1)"; // Face Right
    }

    // 3. Run to the click spot
    // Subtract 30px to center the cat on the mouse cursor
    gardener.style.left = `${relativeX - 30}px`;

    // 4. Wait for run to finish (1 second approx)
    setTimeout(() => {

        // Plant the rose at that exact spot
        const rose = document.createElement('div');
        rose.classList.add('rose');
        rose.innerHTML = "🌹";
        rose.style.left = `${relativeX}px`; // Plant exactly where clicked

        // Add Message
        const msg = document.createElement('div');
        msg.classList.add('msg-bubble');
        msg.innerText = messages[Math.floor(Math.random() * messages.length)];
        rose.appendChild(msg);

        ground.appendChild(rose);

        // 5. Cooldown before next run
        setTimeout(() => {
            isRunning = false;
        }, 500);

    }, 1000); // 1s running time
}