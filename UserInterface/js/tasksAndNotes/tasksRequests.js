/* ----------------------------- Requests ----------------------------- */

// Function to request the user habits
async function getHabitsData() {
    try {
        const response = await fetch('https://localhost:7131/api/Tasks/GetHabits', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
            },
        });
        
        if (!response.ok) {
            throw new Error(response.statusText + `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.habits;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Function to request the list of user tasks
function getUserData() {
    fetch('https://localhost:7131/api/Tasks/GetNotArchivedTasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.message + `HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.tasksList != null) {
                displayObjects(data.tasksList);
            } else {
                console.log("No tasks available");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to request adding a task to the DB
async function addTask(blockName) {
    const taskBlock = document.getElementById(blockName);
    if(taskBlock.querySelector("#taskTitle").textContent == "Habits"){
        console.log("Can`t save task with title like this");
        alert("Incorrect title, please change it");
        return false;
    }

    const pinButton = document.getElementById("pinButton");

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

    var taskData = {
        user_id: getUserId("jwtToken"),
        name: taskBlock.querySelector("#taskTitle").textContent,
        text: JSON.stringify(taskContentArray),
        is_archive: false,
        notification_time: new Date().toISOString(),
        is_pin: pinButton.classList.contains("pinned")
    };

    try {
        await serverRequest('Tasks/AddTask', 'POST', taskData);
    } catch (error) {
        console.error('Error adding task:', error);
    }

    return true;
}

// Function to request updating a task
async function updateData(blockName) {
    const taskBlock = document.getElementById(blockName);
    const tasktitle = taskBlock.querySelector("h3");
    if(tasktitle.textContent == "Habits" && tasktitle.id != localStorage.getItem('habits_id')){
        console.log("Can`t save task with title like this");
        alert("Incorrect title, please change it");
        return false;
    }
    const pinButton = taskBlock.querySelector(".pin-button");

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
        id: parseInt(taskBlock.querySelector("h3").id),
        name: taskBlock.querySelector("h3").textContent,
        text: JSON.stringify(taskContentArray),
        is_archive: false,
        notification_time: new Date().toISOString(),
        is_pin: pinButton.classList.contains("pinned")
    };

    try {
        await serverRequest('Tasks/UpdateTask', 'PATCH', userData);
    } catch (error) {
        console.error('Error updating task:', error);
    }

    return true;
}

// Function to request updating the pinned status of a task
async function updatePin(pin) {
    var requestData = {
        id: parseInt(pin.id.replace('pin', ''), 10),
        status: pin.classList.contains("pinned")
    };

    try {
        await serverRequest('Tasks/UpdateTaskPin', 'PATCH', requestData);
    } catch (error) {
        console.error('Error updating task pin:', error);
    }
}

// Function to request copying a task
async function copyTask(TaskName){
    const taskBlock = document.getElementById(TaskName);
    var requestData = {
        id: parseInt(taskBlock.querySelector('h3').id),
    };

    try {
        await serverRequest('Tasks/CopyTask', 'POST', requestData);
    } catch (error) {
        console.error('Task copy error:', error);
    }
}

// Function to request deleting a task
async function deleteTask(TaskName){
    const taskBlock = document.getElementById(TaskName);
    var requestData = {
        id: parseInt(taskBlock.querySelector('h3').id),
    };

    // check if this block selected
    var selectedTask = localStorage.getItem('selected_task');
    if (selectedTask == parseInt(taskBlock.querySelector('h3').id)) {
        localStorage.removeItem('selected_task');
    }

    try {
        await serverRequest('Tasks/DeleteTask', 'DELETE', requestData);
    } catch (error) {
        console.error('Error deleting task:', error);
    }
    taskBlock.classList.remove("active");
}

// Function to request archiving a task
async function archiveTask(TaskName){
    const taskBlock = document.getElementById(TaskName);
    var requestData = {
        id: parseInt(taskBlock.querySelector('h3').id),
        status: true
    };

     // check if this block selected
     var selectedTask = localStorage.getItem('selected_task');
     if (selectedTask == parseInt(taskBlock.querySelector('h3').id)) {
         localStorage.removeItem('selected_task');
     }

    try {
        await serverRequest('Tasks/ArchiveTask', 'PATCH', requestData);
    } catch (error) {
        console.error('Error archiving task:', error);
    }
    taskBlock.classList.remove("active");
}

// Function for task notification
function notificationTask(TaskName){
}
