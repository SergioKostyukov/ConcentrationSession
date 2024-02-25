let timerInterval;

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

async function fillSecondMode(taskID, nodeID, habitsID) {
    const contentBlock = document.getElementById("contentBlock");

    contentBlock.innerHTML = '';

    await fillTaskBlock(contentBlock, taskID, 'second');
    if (nodeID) {
        await fillNoteBlock(contentBlock, nodeID);
    } else {
        await fillHabitsBlock(contentBlock, habitsID);
    }
}

async function fillThirdMode(taskID, nodeID, habitsID) {
    const contentBlock = document.getElementById("contentBlock");

    contentBlock.innerHTML = '';

    await fillTaskBlock(contentBlock, taskID, 'third');
    await fillNoteBlock(contentBlock, nodeID, 'third');
    await fillHabitsBlock(contentBlock, habitsID, 'third');
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
    textContainer.id = 'Task';

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
    textContainer.id = 'Note';

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
    textContainer.id = 'Habits';

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
    timerStatus = sessionStorage.getItem('timerStatus');
    updateTimerDisplayModal();

    timerInterval = setInterval(function () {
        if (timerStatus > 0) {
            timerStatus--;
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
        document.getElementById("pauseButton").src = "images/start.png";
    } else {
        startTimer();
        document.getElementById("pauseButton").src = "images/pause.png";
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    updateTimerDisplayModal();
    document.getElementById("pauseButton").src = "images/start.png";
}

function updateTimerDisplayModal() {
    const timerDisplay = document.getElementById("timer");

    timerDisplay.innerText = formatTime(timerStatus);

    sessionStorage.setItem('timerStatus', timerStatus);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

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

function unsetLocalVariables(){
    //sessionStorage.removeItem("timerStatus");
    //sessionStorage.removeItem("timerValue");
}

function SaveBlocksData(){
    //UpdateTask('Task');
    //UpdateTask('Habits');
    //UpdateNote();
}

/* ----------------------------- Requests ----------------------------- */
async function UpdateTask(type){
    const taskBlock = document.getElementById(type);

    // Get the content of "done-toggle" elements
    const doneToggleElements = taskBlock.querySelectorAll(".done-toggle");

    // Create an array to store text and status
    const taskContentArray = [];

    // Iterate over "done-toggle" elements and gather text and status
    doneToggleElements.forEach(doneToggleElement => {
        const text = doneToggleElement.querySelector("p").textContent;
        const isDone = doneToggleElement.querySelector("#breakToggle").checked;
        taskContentArray.push({ text, isDone });
    });

    var userData = {
        id: localStorage.getItem('selected_task'),
        text: JSON.stringify(taskContentArray)
    };

    try {
        await serverRequest('Tasks/UpdateTaskText', 'PATCH', userData);
    } catch (error) {
        console.error('Error updating task:', error);
    }

    return true;
}

// Function to request updating a note
async function UpdateNote() {
    const noteBlock = document.getElementById('Note');

    var userData = {
        id: localStorage.getItem('selected_note'),
        text: noteBlock.querySelector("p").textContent
    };

    try {
        await serverRequest('Notes/UpdateNoteText', 'PATCH', userData);
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

// Template function for sending a request (without data returned)
async function serverRequest(path, type, requestObject) {
    try {
        const response = await fetch('https://localhost:7131/api/' + path, {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
            },
            body: JSON.stringify(requestObject)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}