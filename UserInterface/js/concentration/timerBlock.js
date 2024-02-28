let timerValue = Number(sessionStorage.getItem('timerValue')) || 40;
let disableBreaks = sessionStorage.getItem('disableBreaks') === 'true' || false;

const timerDisplay = document.getElementById("timerDisplay");
const numberBreksElement = document.getElementById('numberBreks');
const breakToggle = document.getElementById("breakToggle");

breakToggle.checked = disableBreaks;

document.getElementById("increaseButton").addEventListener("click", increaseTimer);
document.getElementById("decreaseButton").addEventListener("click", decreaseTimer);
document.getElementById("resetButton").addEventListener("click", resetTimerValue);
breakToggle.addEventListener("change", handleBreakToggle);

function updateTimerDisplay() {
    timerDisplay.innerText = formatTime(timerValue);
    sessionStorage.setItem('timerValue', timerValue);
    updateBreaksNumber();
}

function updateBreaksNumber(){
    if(!disableBreaks){
        let work_time = parseFloat(localStorage.getItem('work_time'));
        let break_time = parseFloat(localStorage.getItem('break_time'));
        numberBreksElement.textContent = "Number of breaks: " + Math.floor(timerValue / (work_time + break_time));
    }else{
        numberBreksElement.textContent = "You will have no breaks";
    }
}

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

function resetTimerValue() {
    timerValue = 40;
    updateTimerDisplay();
}

function handleBreakToggle() {
    disableBreaks = this.checked;
    sessionStorage.setItem('disableBreaks', disableBreaks);
    updateBreaksNumber();
}

// Function to format time into minutes and seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
