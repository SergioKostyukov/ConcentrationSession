let timerValue = Number(sessionStorage.getItem('timerValue')) || 40;
let disableBreaks = sessionStorage.getItem('disableBreaks') === 'true' || false;

document.getElementById("breakToggle").checked = disableBreaks;

function updateTimerDisplay() {
    document.getElementById("timerDisplay").innerText = formatTime(timerValue);
    sessionStorage.setItem('timerValue', timerValue);
    updateBreaksNumber();
}

function updateBreaksNumber(){
    var numberBreksElement = document.getElementById('numberBreks');

    if(!disableBreaks){
        let work_time = parseFloat(localStorage.getItem('work_time'));
        let break_time = parseFloat(localStorage.getItem('break_time'));
        numberBreksElement.textContent = "Number of breaks: " + Math.floor(timerValue / (work_time + break_time));
    }else{
        numberBreksElement.textContent = "You will have no breaks";
    }
}

document.getElementById("increaseButton").addEventListener("click", function () {
    increaseTimer();
});

document.getElementById("decreaseButton").addEventListener("click", function () {
    decreaseTimer();
});

document.getElementById("resetButton").addEventListener("click", function () {
    resetTimer();
});

document.getElementById("breakToggle").addEventListener("change", function () {
    disableBreaks = this.checked;
    sessionStorage.setItem('disableBreaks', disableBreaks);
    updateBreaksNumber();
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

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
