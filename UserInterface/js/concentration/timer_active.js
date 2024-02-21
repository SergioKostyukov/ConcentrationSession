let timerInterval;
let timerValueModal;

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
        var overlayActive = localStorage.getItem("overlayActive");
        if (overlayActive === "true") {
            overlay.style.display = "flex";
            modal.classList.add("active");
        }
    });

    startButton.addEventListener("click", function () {
        if (!(localStorage.getItem("selected_task"))) {
            alert("You have to choose a task!");
            return;
        }

        localStorage.setItem("overlayActive", "true");
        document.getElementById("overlay").style.display = "flex";

        const modal = document.getElementById("sessionModeContent");
        modal.classList.add("active");

        fillContentBlock();

        startTimer();
    });

    exitButton.addEventListener("click", function () {
        resetTimerModal();
        document.getElementById("overlay").style.display = "none";
        localStorage.setItem("overlayActive", "false");
    });

    pauseButton.addEventListener("click", function () {
        pauseResumeTimer();
    });

    resetButton.addEventListener("click", function () {
        resetTimerModal();
    });
});

function fillContentBlock() {
    var taskID = localStorage.getItem("selected_task");
    var noteID = localStorage.getItem("selected_note");
    var habitsSelected = localStorage.getItem("selected_habits");

    if (noteID) {
        if (habitsSelected) {
            var habitsID = localStorage.getItem("habits_id");
            fillThirdMode(taskID, noteID, habitsID);
        } else {
            fillSecondMode(taskID, noteID, null);
        }
    } else if (habitsSelected) {
        var habitsID = localStorage.getItem("habits_id");
        fillSecondMode(taskID, null, habitsID);
    } else {
        fillFirstMode(taskID);
    }
}

/* ----------------------------- FILL CONTENT FUNCTIONS ----------------------------- */

function fillFirstMode(taskID) {
    const contentBlock = document.getElementById("contentBlock");

    contentBlock.innerHTML = '';

    fillTaskBlock(contentBlock, taskID);
}

function fillSecondMode(taskID, nodeID, habitsID) {
    const contentBlock = document.getElementById("contentBlock");

    contentBlock.innerHTML = '';

    fillTaskBlock(contentBlock, taskID, 'second');
    if (nodeID) {
        fillNoteBlock(contentBlock, nodeID);
    } else {
        fillHabitsBlock(contentBlock, habitsID);
    }
}

function fillThirdMode(taskID, nodeID, habitsID) {
    const contentBlock = document.getElementById("contentBlock");

    contentBlock.innerHTML = '';

    fillTaskBlock(contentBlock, taskID, 'third');
    fillNoteBlock(contentBlock, nodeID, 'third');
    fillHabitsBlock(contentBlock, habitsID, 'third');
}

async function fillTaskBlock(contentBlock, taskID, type = 'first') {
    var taskData = await getTaskData(taskID);

    // Add first-mode clock
    const taskBlock = document.createElement('div');
    taskBlock.classList.add('content-block', `${type}-mode`);

    // Add the object title
    const objTitle = document.createElement('h3');
    objTitle.textContent = taskData.name;
    objTitle.id = taskID;
    objTitle.contentEditable = false;
    taskBlock.appendChild(objTitle);

    // Add a container for the habits text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    // Check if there is task text
    if (taskData.text) {
        // Parse the text as JSON
        const objectContentArray = JSON.parse(taskData.text);

        // Iterate through the array elements and create corresponding HTML elements
        objectContentArray.forEach(objectContent => {
            const doneToggleElement = document.createElement('div');
            doneToggleElement.classList.add('done-toggle');
            const uniqueId = generateUniqueId();
            doneToggleElement.id = uniqueId;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'breakToggle';
            checkbox.checked = objectContent.isDone;
            doneToggleElement.appendChild(checkbox);

            checkbox.addEventListener("change", function () {
                if (this.checked) {
                    paragraph.classList.add("line-through");
                } else {
                    paragraph.classList.remove("line-through");
                }
            });

            const paragraph = document.createElement('p');
            paragraph.textContent = objectContent.text;
            paragraph.contentEditable = true;
            if (checkbox.checked) {
                paragraph.classList.add("line-through");
            }
            doneToggleElement.appendChild(paragraph);

            // Add doneToggleElement to textContainer
            textContainer.appendChild(doneToggleElement);
        });
    }

    taskBlock.appendChild(textContainer);

    contentBlock.appendChild(taskBlock);
}

async function fillNoteBlock(contentBlock, nodeID, type = 'second') {
    var noteData = await getNoteData(nodeID);

    // Add first-mode clock
    const noteBlock = document.createElement('div');
    noteBlock.classList.add('content-block', `${type}-mode`);

    // Add the object title
    const objTitle = document.createElement('h3');
    objTitle.textContent = noteData.name;
    objTitle.id = nodeID;
    objTitle.contentEditable = false;
    noteBlock.appendChild(objTitle);

    // Add a container for the habits text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    const paragraph = document.createElement('p');
    paragraph.textContent = noteData.text;
    paragraph.contentEditable = true;

    // Add doneToggleElement to textContainer
    textContainer.appendChild(paragraph);

    noteBlock.appendChild(textContainer);

    contentBlock.appendChild(noteBlock);
}

async function fillHabitsBlock(contentBlock, habitsID, type = 'second') {
    var taskData = await getTaskData(habitsID);

    // Add first-mode clock
    const taskBlock = document.createElement('div');
    taskBlock.classList.add('content-block', `${type}-mode`);

    // Add the object title
    const objTitle = document.createElement('h3');
    objTitle.textContent = taskData.name;
    objTitle.id = habitsID;
    objTitle.contentEditable = false;
    taskBlock.appendChild(objTitle);

    // Add a container for the habits text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    // Check if there is task text
    if (taskData.text) {
        // Parse the text as JSON
        const objectContentArray = JSON.parse(taskData.text);

        // Iterate through the array elements and create corresponding HTML elements
        objectContentArray.forEach(objectContent => {
            const doneToggleElement = document.createElement('div');
            doneToggleElement.classList.add('done-toggle');
            const uniqueId = generateUniqueId();
            doneToggleElement.id = uniqueId;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'breakToggle';
            checkbox.checked = objectContent.isDone;
            doneToggleElement.appendChild(checkbox);

            checkbox.addEventListener("change", function () {
                if (this.checked) {
                    paragraph.classList.add("line-through");
                } else {
                    paragraph.classList.remove("line-through");
                }
            });

            const paragraph = document.createElement('p');
            paragraph.textContent = objectContent.text;
            paragraph.contentEditable = true;
            if (checkbox.checked) {
                paragraph.classList.add("line-through");
            }
            doneToggleElement.appendChild(paragraph);

            // Add doneToggleElement to textContainer
            textContainer.appendChild(doneToggleElement);
        });
    }

    taskBlock.appendChild(textContainer);

    contentBlock.appendChild(taskBlock);
}

/* ----------------------------- TIMER FUNCTIONS ----------------------------- */

function startTimer() {
    timerValueModal = sessionStorage.getItem('timerValue') || 40;
    updateTimerDisplayModal();

    timerInterval = setInterval(function () {
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
        document.getElementById("pauseButton").src = "images/start.png";
    } else {
        startTimer();
        document.getElementById("pauseButton").src = "images/pause.png";
    }
}

function resetTimerModal() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerValueModal = sessionStorage.getItem('timerValue') || 40;
    updateTimerDisplayModal();
    document.getElementById("pauseButton").src = "images/start.png";
}

function updateTimerDisplayModal() {
    const timerDisplay = document.getElementById("timer");
    const progress = (1 - timerValueModal / sessionStorage.getItem('timerValue')) * 360;

    timerDisplay.innerText = formatTime(timerValueModal);
    timerDisplay.style.backgroundImage = `conic-gradient(#4CAF50 ${progress}deg, transparent ${progress}deg 360deg)`;
    sessionStorage.setItem('timerValue', timerValueModal);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

/* ----------------------------- Requests ----------------------------- */
