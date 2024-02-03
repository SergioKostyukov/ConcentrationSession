let timerValue = Number(sessionStorage.getItem('timerValue')) || 40;
let disableBreaks = sessionStorage.getItem('disableBreaks') === 'true' || false;

document.getElementById("increaseButton").addEventListener("click", function () {
    increaseTimer();
});

document.getElementById("decreaseButton").addEventListener("click", function () {
    decreaseTimer();
});

document.getElementById("resetButton").addEventListener("click", function () {
    resetTimer();
});

document.getElementById("settingsButton").addEventListener("click", function () {
    window.location.href = "settings.html";
});

document.getElementById("breakToggle").checked = disableBreaks;

document.getElementById("breakToggle").addEventListener("change", function () {
    disableBreaks = this.checked;
    sessionStorage.setItem('disableBreaks', disableBreaks);
});

function increaseTimer() {
    timerValue += 5;
    updateTimerDisplay();
}

function decreaseTimer() {
    timerValue -= 5;
    if (timerValue < 0) {
        timerValue = 0;
    }
    updateTimerDisplay();
}

function resetTimer() {
    timerValue = 40;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    document.getElementById("timerDisplay").innerText = formatTime(timerValue);
    sessionStorage.setItem('timerValue', timerValue);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
