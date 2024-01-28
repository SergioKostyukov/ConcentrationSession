let timerValue = Number(localStorage.getItem('timerValue')) || 40; 
let disableBreaks = localStorage.getItem('disableBreaks') === 'true' || false;

updateTimerDisplay();

document.getElementById("increaseButton").addEventListener("click", function() {
    increaseTimer();
});

document.getElementById("decreaseButton").addEventListener("click", function() {
    decreaseTimer();
});

document.getElementById("resetButton").addEventListener("click", function() {
    resetTimer();
});

document.getElementById("settingsButton").addEventListener("click", function() {
    window.location.href = "settings.html";
});

document.getElementById("breakToggle").checked = disableBreaks;

document.getElementById("breakToggle").addEventListener("change", function() {
    disableBreaks = this.checked;
    localStorage.setItem('disableBreaks', disableBreaks);
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
    localStorage.setItem('timerValue', timerValue); 
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}



let timerInterval;
let timerValueModal;

document.getElementById("startButton").addEventListener("click", function() {
    document.getElementById("overlay").style.display = "flex";
    startTimer();
});

document.getElementById("exitButtonModal").addEventListener("click", function() {
    resetTimer();
    document.getElementById("overlay").style.display = "none";
});

document.getElementById("pauseResumeButton").addEventListener("click", function() {
    pauseResumeTimer();
});

document.getElementById("resetButtonModal").addEventListener("click", function() {
    resetTimer();
});

function startTimer() {
    timerValueModal = localStorage.getItem('timerValue') || 40;
    updateTimerDisplayModal();

    timerInterval = setInterval(function() {
        if (timerValueModal > 0) {
            timerValueModal--;
            updateTimerDisplayModal();
        } else {
            clearInterval(timerInterval);
            alert("Таймер завершено!");
            resetTimer();
        }
    }, 1000);
}

function pauseResumeTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById("pauseResumeButton").innerText = "Пуск";
    } else {
        startTimer();
        document.getElementById("pauseResumeButton").innerText = "Пауза";
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerValueModal = localStorage.getItem('timerValue') || 40;
    updateTimerDisplayModal();
    document.getElementById("pauseResumeButton").innerText = "Пауза";
}

function updateTimerDisplayModal() {
    const timerDisplay = document.getElementById("timer");
    const progress = (1 - timerValueModal / localStorage.getItem('timerValue')) * 360;

    timerDisplay.innerText = formatTime(timerValueModal);
    timerDisplay.style.backgroundImage = `conic-gradient(#4CAF50 ${progress}deg, transparent ${progress}deg 360deg)`;
    localStorage.setItem('timerValue', timerValueModal);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}