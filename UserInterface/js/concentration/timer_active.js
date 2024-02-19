let timerInterval;
let timerValueModal;

document.getElementById("startButton").addEventListener("click", function() {
    // Зберегти інформацію про стан вікна активності у localStorage
    localStorage.setItem("overlayActive", "true");

    document.getElementById("overlay").style.display = "flex";
    
    startTimer();
});

window.addEventListener("load", function() {
    // Перевірити, чи вікно активності було активоване перед оновленням сторінки
    var overlayActive = localStorage.getItem("overlayActive");
    if (overlayActive === "true") {
        // Відобразити вікно активності
        document.getElementById("overlay").style.display = "flex";
    }
});

document.getElementById("exitButtonModal").addEventListener("click", function() {
    resetTimerModal();
    document.getElementById("overlay").style.display = "none";
});

document.getElementById("pauseResumeButton").addEventListener("click", function() {
    pauseResumeTimer();
});

document.getElementById("resetButtonModal").addEventListener("click", function() {
    resetTimerModal();
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
            resetTimerModal();
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

function resetTimerModal() {
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