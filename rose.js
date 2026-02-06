// --- CONFIGURATION ---
const messages = [
    // --- Original ---
    "For you! 🌹",
    "You're amazing! ✨",
    "Be mine? 💖",
    "Sending Love! 💌",
    "Cutie! 😘",
    "Forever Us! ♾️",

    // --- Funny (20) ---
    "You’re the reason I look down at my phone and smile like an idiot! 🤳🤡",
    "Roses are red, violets are blue, I’m bad at rhyme, but I really like you! 📝",
    "Are you a Wi-Fi signal? Because I’m feeling a very strong connection! 📶",
    "You’re the person I want to annoy for the rest of my life! 😈",
    "Sorry I’m late, I was busy thinking about how cute you are! 🏃💨",
    "Let’s be weird together forever! 👽",
    "You’re the cheese to my macaroni, and I’m really hungry right now! 🧀",
    "If we were on a sinking ship, I’d share my door with you. Titanic style! 🚢",
    "My favorite hobby is making you laugh so hard you snort! 🐽",
    "You’re the only one I want to send ugly selfies to! 🤳👹",

    // --- Loving (20) ---
    "Every day with you feels like a beautiful dream come true! ☁️",
    "You’re my favorite person in every version of reality! 🌌",
    "Thank you for being the best part of my day, every single day! 🌅",
    "You make my heart feel like it’s finally home! 🏠❤️",
    "I didn't know life could be this sweet until I met you! 🍭",
    "You are the poem I never knew how to write! ✍️",
    "Falling for you was the easiest thing I've ever done! 🍂",
    "You’re not just my love; you’re my peace! 🕊️",
    "I’m so proud of the person you are and the life we're building! 🏗️💗",
    "My heart is—and always will be—yours! 🔒",
    "You make even the most ordinary moments feel extraordinary! ✨",
    "Thank you for loving me exactly as I am! 🫂",
    "The best thing about me is you! 💎",
    "You’re my sun, my moon, and all my stars! 🌙",
    "I love you more today than yesterday, but not as much as tomorrow! 📈",
    "Life is better with you by my side! 👣",
    "You are my greatest adventure! 🗺️",
    "I still get butterflies every time I see you walk into a room! 🦋",
    "You’re the piece I didn’t know was missing! 🧩",
    "I'm so lucky to do life with you! 🥂",

    // --- Cheesy (10) ---
    "If you were a flower, you’d be a 'damnnn-delion!' 🌼",
    "I’m 'thorny' without you! 🌹",
    "Our love is in full bloom! 🌸",
    "Are you a florist? Because ever since I met you, my life has been rosy! 🌷",
    "I’m not a photographer, but I can definitely picture us together forever! 📸",
    "Do you have a map? I just got lost in your eyes! 🗺️👀",
    "If being beautiful was a crime, you’d be serving a life sentence! ⚖️",
    "You’re 'berry' special to me! 🍓",
    "I rose to the occasion just to tell you how much I love you! 💐",
    "You’re the 'thistle' to my heart—I’m stuck on you! 🌵"
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