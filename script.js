// script.js

// This function runs every second to update the countdowns
function updateTimers() {
    const now = new Date();
    const cards = document.querySelectorAll('.day-card');

    cards.forEach(card => {
        // Get the target date from the HTML attribute
        const targetDateStr = card.getAttribute('data-date');
        const targetDate = new Date(targetDateStr + "T00:00:00"); // Midnight local time

        const timerElement = card.querySelector('.timer');
        const statusElement = card.querySelector('.status');

        // Calculate difference in milliseconds
        const diff = targetDate - now;

        if (diff <= 0) {
            // It is time! Unlock the card
            card.classList.remove('locked');
            card.classList.add('unlocked');
            timerElement.innerText = "Click to Open!";
            statusElement.innerText = "🔓";
            timerElement.style.color = "#ff4d6d";
            timerElement.style.background = "#fff0f3";
        } else {
            // Still locked
            card.classList.add('locked');

            // Prevent clicking
            card.onclick = (e) => {
                e.preventDefault();
                alert("Patience is a virtue! Wait for the countdown! 😜");
            };

            // Calculate days, hours, minutes, seconds
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            timerElement.innerText = `Opens in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    });
}

// Start the timer immediately
setInterval(updateTimers, 1000);
updateTimers(); // Run once on load to avoid 1-second delay