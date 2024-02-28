const FULL_DASH_ARRAY = 283;
const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: 300
    },
    alert: {
        color: "red",
        threshold: 60
    }
};

// Variables to manage the timer
let TIME_LIMIT = 0;
let timePassed = 0;
let timeLeft = 0;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
let timerStoped = false; // Flag to track if the timer is stopped

// Function to initialize timer UI
function initializeTimerUI() {
    document.getElementById("timer").innerHTML = `
        <div class="base-timer">
            <svg class="base-timer__svg" viewBox="0 0 100 100">
                <g class="base-timer__circle">
                    <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                        <path
                            id="base-timer-path-remaining"
                            stroke-dasharray="283"
                            class="base-timer__path-remaining ${remainingPathColor}"
                            d="
                                M 50, 50
                                m -45, 0
                                a 45,45 0 1,0 90,0
                                a 45,45 0 1,0 -90,0
                                "
                        ></path>
                </g>
            </svg>
            <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
        </div>
        <p id="nextStage">Next: Break</p>`;
}

// Function to control the timer flow based on session and local storage values
async function timerController() {
    const timerValue = parseInt(sessionStorage.getItem("timerValue"));
    const disableBreaks = sessionStorage.getItem("disableBreaks") === "true";
    const doneValue = parseInt(sessionStorage.getItem("doneValue")) || 0;
    const workTime = parseInt(localStorage.getItem("work_time"));
    const breakTime = parseInt(localStorage.getItem("break_time"));

    if (!disableBreaks) {
        timeLeft = timerValue - doneValue;
        if (sessionStorage.getItem("stageType") === "Break") {
            await startTimer(Math.min(timeLeft, breakTime), "Break");
        }

        timeLeft = timerValue - parseInt(sessionStorage.getItem("doneValue"));
        if (timeLeft != 0) {
            const totalStages = Math.floor(timeLeft / (workTime + breakTime));
            const remainingTime = timeLeft % (workTime + breakTime);

            for (let i = 0; i < totalStages; i++) {
                await startTimer(workTime, "Work");
                await startTimer(breakTime, "Break");
            }

            // Start last stage
            if (remainingTime > 0) {
                if (remainingTime >= workTime) {
                    await startTimer(workTime, "Work");
                    await startTimer(remainingTime - workTime, "Break");
                } else {
                    await startTimer(remainingTime, "Work");
                }
            }
        }
    } else {
        await startTimer(timerValue, "Work");
    }

    exitTimer();
}

// Function to update the text indicating the next stage of the timer
function updateNextStage(stageValue, stage) {
    const workTime = parseInt(localStorage.getItem("work_time"));
    const breakTime = parseInt(localStorage.getItem("break_time"));

    const leftTime = parseInt(sessionStorage.getItem("timerValue")) - parseInt(sessionStorage.getItem("doneValue"));

    let nextStageText;
    if (sessionStorage.getItem("disableBreaks") === "true") {
        nextStageText = "";
    } else if (leftTime - stageValue === 0) {
        nextStageText = "The last one";
    } else if (stage === "Work") {
        nextStageText = `Next: ${leftTime - stageValue <= breakTime ? leftTime - stageValue + " break" : breakTime + " break"}`;
    } else {
        nextStageText = `Next: ${leftTime - stageValue <= workTime ? leftTime - stageValue + " work" : workTime + " work"}`;
    }

    document.getElementById("nextStage").innerText = nextStageText;
}

// Function to start the timer for a given duration and stage type
async function startTimer(timerValue, stageType) {
    COLOR_CODES.warning.threshold = timerValue * 60 * 0.25;
    COLOR_CODES.alert.threshold = timerValue * 60 * 0.1;

    updateNextStage(timerValue, stageType);
    sessionStorage.setItem("stageType", stageType);

    document.getElementById("pauseButton").src = "images/pause.png";

    TIME_LIMIT = timerValue * 60;
    timePassed = parseInt(sessionStorage.getItem("timerStatus") || 0);

    return new Promise(resolve => {
        timerInterval = setInterval(() => {
            if (!timerStoped) {
                timePassed++;

                timeLeft = TIME_LIMIT - timePassed;
                document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
                setCircleDasharray();
                setRemainingPathColor(timeLeft);

                if (timeLeft === 0) {
                    onTimesUp();
                    resolve();
                }
            }
        }, 1000);
    });
}

// Function called when the timer reaches zero
function onTimesUp() {
    sessionStorage.setItem("doneValue", parseInt(sessionStorage.getItem("doneValue")) + TIME_LIMIT / 60);

    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("pauseButton").src = "images/start.png";

    UpdateCompleteTime();
}

// Function to format time into minutes and seconds
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

// Function to set the remaining path color of the timer based on time left
function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    const remainingPath = document.getElementById("base-timer-path-remaining");

    if (timeLeft <= alert.threshold) {
        updatePathColor(alert.color);
    } else if (timeLeft <= warning.threshold) {
        updatePathColor(warning.color);
    } else {
        updatePathColor(info.color);
    }

    function updatePathColor(color) {
        remainingPath.classList.remove(alert.color, warning.color, info.color);
        remainingPath.classList.add(color);
        remainingPathColor = color;
    }
}

// Function to calculate the time fraction elapsed for the timer
function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

// Function to set the dash array of the timer circle based on elapsed time
function setCircleDasharray() {
    const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}

// Function to pause or resume the timer
function pauseResumeTimer() {
    document.getElementById("pauseButton").src =
        timerStoped ? "images/pause.png" : "images/start.png";

    timerStoped = !timerStoped;
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStoped = false;
    sessionStorage.setItem("stageType", "Work");
    sessionStorage.setItem("doneValue", 0);

    UpdateCompleteTime();
    timerController();
}

// Function to exit the timer mode
function exitTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStoped = false
    sessionStorage.setItem("timerStatus", timePassed);
    sessionStorage.setItem("doneValue", 0);
    sessionStorage.setItem("stageType", "Work");

    // update progress value
    UpdateCompleteTime();
    SaveBlocksData();
    updateGoalBlock();

    document.getElementById("overlay").style.display = "none";
    sessionStorage.setItem("overlayActive", "false");
}