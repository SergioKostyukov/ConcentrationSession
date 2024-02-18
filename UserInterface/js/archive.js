// Function to fill the common part of the blocks
function fillObject(object, type) {
    const objectBlock = document.createElement('div');
    objectBlock.classList.add('task-block');
    objectBlock.id = 'block' + object.id;

    // Add the task name
    const objectTitle = document.createElement('h3');
    objectTitle.textContent = object.name;
    objectBlock.appendChild(objectTitle);

    // Add the "archive" button
    const archiveButton = document.createElement('button');
    archiveButton.classList.add('action-button', 'archive-button');
    const archiveImage = document.createElement('img');
    archiveImage.src = 'images/folder.png';
    archiveImage.alt = 'archive';
    archiveButton.setAttribute('onclick', `unArchive${type}(${object.id})`);
    archiveButton.setAttribute('title', 'Unarchive');
    archiveButton.appendChild(archiveImage);
    objectBlock.appendChild(archiveButton);

    // Add the "delete" button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('action-button', 'delete-button');
    const deleteImage = document.createElement('img');
    deleteImage.src = 'images/delete.png';
    deleteImage.alt = 'delete';
    deleteButton.setAttribute('onclick', `delete${type}(${object.id})`);
    deleteButton.appendChild(deleteImage);
    objectBlock.appendChild(deleteButton);

    // Add a separator
    const divider = document.createElement('hr');
    objectBlock.appendChild(divider);

    return objectBlock;
}

// Function to display tasks on the page
function displayTasks(tasks) {
    const archivePanel = document.getElementById('tasksArchive');

    // Clear the tasks panel before adding new ones
    archivePanel.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = 'Archived Tasks';
    archivePanel.appendChild(title);

    // Iterate through each task and create the corresponding HTML block
    tasks.forEach(task => {
        const taskBlock = fillObject(task, 'Task');

        // Add a container for the task text
        const textContainer = document.createElement('div');
        textContainer.classList.add('text-container');

        if (task.text) {
            const taskContentArray = JSON.parse(task.text);

            // Iterate through the array elements and create corresponding HTML elements
            taskContentArray.forEach(taskContent => {
                const doneToggleElement = document.createElement('div');
                doneToggleElement.classList.add('done-toggle');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = taskContent.isDone;
                checkbox.disabled = true;

                const paragraph = document.createElement('p');
                paragraph.contentEditable = false;
                paragraph.textContent = taskContent.text;

                doneToggleElement.appendChild(checkbox);
                doneToggleElement.appendChild(paragraph);

                textContainer.appendChild(doneToggleElement);
            });
        }

        taskBlock.appendChild(textContainer);

        archivePanel.appendChild(taskBlock);
    });
}

// Function to display notes on the page
function displayNotes(notes) {
    const archivePanel = document.getElementById('notesArchive');

    // Clear the notes panel before adding new ones
    archivePanel.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = 'Archived Notes';
    archivePanel.appendChild(title);

    // Iterate through each note and create the corresponding HTML block
    notes.forEach(note => {
        const noteBlock = fillObject(note, 'Note');

        // Add a container for the note text
        const textContainer = document.createElement('div');
        textContainer.classList.add('text-container');

        if (note.text) {
            const paragraph = document.createElement('p');
            paragraph.contentEditable = false;
            paragraph.textContent = note.text;

            textContainer.appendChild(paragraph);
        }

        noteBlock.appendChild(textContainer);

        archivePanel.appendChild(noteBlock);
    });
}

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

getArchivedTasks();
getArchivedNotes();
