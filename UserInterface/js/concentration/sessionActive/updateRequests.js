
/* ----------------------------- Requests ----------------------------- */

async function UpdateTask(type = 'Task') {
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

    var taskId;
    if(type == 'Task'){
        taskId = localStorage.getItem('selected_task')
    } else{
        taskId = localStorage.getItem('habits_id')
    }

    var userData = {
        id: taskId,
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