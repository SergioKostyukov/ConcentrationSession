//-------------------------------- SESSION MODE--------------------------------
// Event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlay");
    const modal = document.getElementById("sessionModeContent");

    // Buttons for controlling the timer
    const startButton = document.getElementById("startTimerButton");
    const resetButton = document.getElementById("resetTimerButton")
    const pauseButton = document.getElementById("pauseTimerButton")
    const exitButton = document.getElementById("exitTimerButton")

    // Event listener to check if overlay was active on previous session
    window.addEventListener("load", function () {
        if (sessionStorage.getItem("overlayActive") === "true") {
            ActivateOverlay();
        }
    });

    // Event listener to prompt user before leaving the page if overlay is active
    window.addEventListener('beforeunload', function (e) {
        if (sessionStorage.getItem("overlayActive") === "true") {
            SaveBlocksData();
            sessionStorage.setItem("timerStatus", timePassed);

            const confirmationMessage = 'You are leaving this page. Are you sure?';

            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });

    // Event listener for starting the timer
    startButton.addEventListener("click", function () {
        // Check if a task and a time duration are selected
        if (!(localStorage.getItem("selected_task"))) {
            alert("You have to choose a task!");
            return;
        }

        if (sessionStorage.getItem("timerValue") == 0) {
            alert("You have to choose a time!");
            return;
        }

        // Set overlay as active and start the timer
        sessionStorage.setItem("overlayActive", "true");
        sessionStorage.setItem("stageType", "Work");

        ActivateOverlay();
    });

    // Event listeners for controlling the timer (pause, reset, exit)
    pauseButton.addEventListener("click", PauseResumeTimer);
    resetButton.addEventListener("click", ResetTimer);
    exitButton.addEventListener("click", ExitTimer);

    // Function to activate the overlay and start the timer
    const ActivateOverlay = async () => {
        overlay.style.display = "flex";
        modal.classList.add("active");
        fillContentBlock();
        InitializeTimerUI();
        await TimerController();
    };
});

/* ----------------------------- After session updates ----------------------------- */

// Function to update the complete time spent on tasks
function UpdateCompleteTime() {
    var currentCompleteTime = parseInt(localStorage.getItem("complete_time")) || 0;
    var lastcompleteTimeInterval = parseInt(sessionStorage.getItem("timerStatus"));

    localStorage.setItem("complete_time", currentCompleteTime + lastcompleteTimeInterval);
    sessionStorage.setItem("timerStatus", 0);
}

// Function to save task and habit data after a session
async function SaveBlocksData() {
    await UpdateTask();
    if (localStorage.getItem("selected_note")) {
        UpdateNote();
    }
    if (localStorage.getItem("selected_habits")) {
        await UpdateTask('Habits');
        getHabitsData();
    }
}
