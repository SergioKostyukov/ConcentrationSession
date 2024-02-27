const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 300/60;
const ALERT_THRESHOLD = 60/60;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

let TIME_LIMIT = 0;
let timePassed = 0;
let timeLeft = 0;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

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
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
)}</span>
</div>
`;

async function timerController() {
    const timerValue = parseInt(sessionStorage.getItem("timerValue"));

    if(parseInt(sessionStorage.getItem("disableBreaks")) == 1){
        const workTime = parseInt(localStorage.getItem("work_time"));
        const breakTime = parseInt(localStorage.getItem("break_time"));
    
        const totalStages = Math.floor(timerValue / (workTime + breakTime));
        const remainingTime = timerValue % (workTime + breakTime);
    
        for (let i = 0; i < totalStages; i++) {
            await startTimer(workTime);
            await startTimer(breakTime);
        }
    
        // Запуск останнього етапу
        if (remainingTime > 0) {
            if (remainingTime >= workTime) {
                await startTimer(workTime);
                await startTimer(remainingTime - workTime);
            } else {
                await startTimer(remainingTime);
            }
        }
    }else{
        await startTimer(timerValue);
    }

    exitTimer();
}

async function startTimer(timerValue) {
    TIME_LIMIT = timerValue;// * 60;
    timePassed = parseInt(sessionStorage.getItem("timerStatus") || 0);
    console.log(TIME_LIMIT / 60);

    document.getElementById("pauseButton").src = "images/pause.png";

    return new Promise(resolve => {
        timerInterval = setInterval(() => {
            timePassed = timePassed += 1;

            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
            setCircleDasharray();
            setRemainingPathColor(timeLeft);

            if (timeLeft === 0) {
                onTimesUp();
                resolve(); // Повідомлення про завершення таймера
            }
        }, 1000);
    });
}

function onTimesUp() {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("pauseButton").src = "images/start.png";

    updateCompleteTime();
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if ((remainingPathColor != info.color && timeLeft > warning.threshold) ||
        (remainingPathColor == alert.color && timeLeft > alert.threshold)) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(remainingPathColor);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(COLOR_CODES.info.color);

        remainingPathColor = COLOR_CODES.info.color;
    } else if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);

        remainingPathColor = COLOR_CODES.alert.color;
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);

        remainingPathColor = COLOR_CODES.warning.color;
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}

function pauseResumeTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById("pauseButton").src = "images/start.png";
    } else {
        startTimer(TIME_LIMIT / 60);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    updateCompleteTime();

    startTimer(TIME_LIMIT / 60);
}

function exitTimer(){
    clearInterval(timerInterval);
        timerInterval = null;
        sessionStorage.setItem("timerStatus", timePassed);

        // update progress value
        updateCompleteTime();
        
        // update blocks data
        SaveBlocksData();
        updateGoalBlock();

        document.getElementById("overlay").style.display = "none";
        sessionStorage.setItem("overlayActive", "false");
}