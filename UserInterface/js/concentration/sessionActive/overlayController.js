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
            sessionStorage.setItem("timerStatus", timePassed);

            var confirmationMessage = 'You are leaving this page. Are you sure?';

            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage; 
        }
    });

    startButton.addEventListener("click", function () {
        if (!(localStorage.getItem("selected_task"))) {
            alert("You have to choose a task!");
            return;
        }

        if(sessionStorage.getItem("timerValue") == 0){
            alert("You have to choose a time!");
            return;
        }

        sessionStorage.setItem("overlayActive", "true");

        activateOverlay();
    });

    pauseButton.addEventListener("click", function () {
        pauseResumeTimer();
    });

    resetButton.addEventListener("click", function () {
        resetTimer();
    });

    exitButton.addEventListener("click", function () {
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
    });

    function activateOverlay() {
        overlay.style.display = "flex";

        modal.classList.add("active");

        fillContentBlock();

        startTimer();
    }
});

/* ----------------------------- After session updates ----------------------------- */

function updateCompleteTime() {
    var currentCompleteTime = parseInt(localStorage.getItem("complete_time"));
    var lastcompleteTimeInterval = parseInt(sessionStorage.getItem("timerStatus"));

    if (!currentCompleteTime) {
        currentCompleteTime = 0;
    }

    localStorage.setItem("complete_time", currentCompleteTime + lastcompleteTimeInterval);
    sessionStorage.setItem("timerStatus", 0);
}

async function SaveBlocksData() {
    UpdateTask();
    if(localStorage.getItem("selected_note")){
        UpdateNote();
    }
    if(localStorage.getItem("selected_habits")){
        await UpdateTask('Habits');
        getHabitsData();
    }
}
