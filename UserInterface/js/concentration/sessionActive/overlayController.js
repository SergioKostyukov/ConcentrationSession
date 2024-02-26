// Generate a unique identifier value
function generateUniqueId() {
    return 'toggle_' + Math.random().toString(36).substring(2, 11);
}

//-------------------------------- SESSION MODE--------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlay");
    const modal = document.getElementById("sessionModeContent");

    const startButton = document.getElementById("startTimerButton");
    const resetButton = document.getElementById("resetTimerButton")
    const pauseButton = document.getElementById("pauseTimerButton")
    const exitButton = document.getElementById("exitTimerButton")

    window.addEventListener("load", function () {
        var overlayActive = sessionStorage.getItem("overlayActive");
        if (overlayActive === "true") {
            activateOverlay();
        }
    });

    window.addEventListener('beforeunload', function (e) {
        if (sessionStorage.getItem("overlayActive") === "true") {
            SaveBlocksData();

            // Визначаємо повідомлення, яке буде відображатися користувачу
            var confirmationMessage = 'Ви покидаєте цю сторінку. Ви впевнені?';

            // Встановлюємо текст повідомлення
            (e || window.event).returnValue = confirmationMessage; // Для браузків, які підтримують returnValue
            return confirmationMessage; // Для сучасних браузерів
        }
    });

    startButton.addEventListener("click", function () {
        if (!(localStorage.getItem("selected_task"))) {
            alert("You have to choose a task!");
            return;
        }

        sessionStorage.setItem("overlayActive", "true");
        sessionStorage.setItem("timerStatus", sessionStorage.getItem("timerValue"));

        activateOverlay();
    });

    pauseButton.addEventListener("click", function () {
        pauseResumeTimer();
    });

    resetButton.addEventListener("click", function () {
        resetTimer();

        // update progress value
        updateCompleteTime();

        timerStatus = sessionStorage.getItem('timerValue');
    });

    exitButton.addEventListener("click", function () {
        clearInterval(timerInterval);
        timerInterval = null;

        // update progress value
        updateCompleteTime();
        // unset local variables / delete unnecessary session params 
        unsetLocalVariables();
        // update blocks data
        SaveBlocksData();
        updateGoalBlock();

        document.getElementById("overlay").style.display = "none";
        sessionStorage.setItem("overlayActive", "false");
    });

    function activateOverlay() {
        overlay.style.display = "flex";

        modal.classList.add("active");

        fillContentBlock();

        document.getElementById("pauseButton").src = "images/pause.png";

        startTimer();
    }
});

/* ----------------------------- After session updates ----------------------------- */

function updateCompleteTime() {
    var currentCompleteTime = parseInt(localStorage.getItem("complete_time"));
    var simpleWorkInterval = parseInt(localStorage.getItem("work_time"));
    var lastTimeInterval = parseInt(sessionStorage.getItem("timerStatus"));

    if (!currentCompleteTime) {
        currentCompleteTime = 0;
    }

    console.log(simpleWorkInterval, lastTimeInterval, simpleWorkInterval - lastTimeInterval);
    localStorage.setItem("complete_time", currentCompleteTime + simpleWorkInterval - lastTimeInterval);
}

function unsetLocalVariables() {
    //sessionStorage.removeItem("timerStatus");
    //sessionStorage.removeItem("timerValue");
}

function SaveBlocksData() {
    //UpdateTask('Task');
    //UpdateTask('Habits');
    //UpdateNote();
}
