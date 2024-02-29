// ------------------------- Sending Requests -------------------------

// Function to send a request to unarchive a task
async function unArchiveTask(TaskId) {
    var requestData = {
        id: TaskId,
        status: false
    };

    try {
        await serverRequest('Tasks/ArchiveTask', 'PATCH', requestData);
    } catch (error) {
        console.error('Error unarchiving task:', error);
    }

    getArchivedTasks();
}

// Function to send a request to unarchive a note
async function unArchiveNote(TaskId) {
    var requestData = {
        id: TaskId,
        status: false
    };

    try {
        await serverRequest('Notes/ArchiveNote', 'PATCH', requestData);
    } catch (error) {
        console.error('Error unarchiving note:', error);
    }

    getArchivedNotes();
}

// Function to send a request to delete a task
async function deleteTask(TaskId) {
    var requestData = {
        id: TaskId
    };

    try {
        await serverRequest('Tasks/DeleteTask', 'DELETE', requestData);
    } catch (error) {
        console.error('Error deleting task:', error);
    }

    getArchivedTasks();
}

// Function to send a request to delete a note
async function deleteNote(TaskId) {
    var requestData = {
        id: TaskId
    };

    try {
        await serverRequest('Notes/DeleteNote', 'DELETE', requestData);
    } catch (error) {
        console.error('Error deleting note:', error);
    }

    getArchivedNotes();
}

/* ----------------------------- Requests ----------------------------- */

// Template function for sending a request (without data on return)
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

// Function to send a request to get the list of archived tasks for the user
async function getArchivedTasks() {
    // Your API request to get the list of tasks
    fetch('https://localhost:7131/api/Tasks/GetArchivedTasks', {
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
            displayTasks(data.tasksList);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to send a request to get the list of archived notes for the user
async function getArchivedNotes() {
    // Your API request to get the list of notes
    fetch('https://localhost:7131/api/Notes/GetArchivedNotes', {
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
            displayNotes(data.notesList);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}