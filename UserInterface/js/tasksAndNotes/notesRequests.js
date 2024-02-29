/* ----------------------------- Requests ----------------------------- */

// Function to request the list of user notes
function getUserData() {
    fetch('https://localhost:7131/api/Notes/GetNotArchivedNotes', {
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
            if (data.notesList != null) {
                displayObjects(data.notesList);
            } else {
                console.log("No notes available");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to request adding a note to the DB
async function addNote(blockName) {
    const noteBlock = document.getElementById(blockName);
    const doneToggleElement = noteBlock.querySelector(".text-container");
    const pinButton = document.getElementById("pinButton");

    var noteData = {
        user_id: getUserId("jwtToken"),
        name: noteBlock.querySelector("#noteTitle").textContent,
        text: doneToggleElement.querySelector("p").textContent,
        is_archive: false,
        is_pin: pinButton.classList.contains("pinned")
    };

    try {
        await serverRequest('Notes/AddNote', 'POST', noteData);
    } catch (error) {
        console.error('Error adding note:', error);
    }
}

// Function to request updating a note
async function updateData(blockName) {
    const noteBlock = document.getElementById(blockName);
    const doneToggleElement = noteBlock.querySelector(".text-container");
    const pinButton = noteBlock.querySelector(".pin-button");

    var userData = {
        id: parseInt(noteBlock.querySelector("h3").id),
        name: noteBlock.querySelector("h3").textContent,
        text: doneToggleElement.querySelector("p").textContent,
        is_archive: false,
        is_pin: pinButton.classList.contains("pinned")
    };

    try {
        await serverRequest('Notes/UpdateNote', 'PATCH', userData);
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

// Function to request updating the pinned status of a note
async function updatePin(pin) {
    var requestData = {
        id: parseInt(pin.id.replace('pin', ''), 10),
        status: pin.classList.contains("pinned")
    };

    try {
        await serverRequest('Notes/UpdateNotePin', 'PATCH', requestData);
    } catch (error) {
        console.error('Error updating note pin:', error);
    }
}

// Function to request copying a note
async function copyNote(NoteName) {
    const noteBlock = document.getElementById(NoteName);
    var requestData = {
        id: parseInt(noteBlock.querySelector('h3').id),
    };

    try {
        await serverRequest('Notes/CopyNote', 'POST', requestData);
    } catch (error) {
        console.error('Note copy error:', error);
    }
}

// Function to request deleting a note
async function deleteNote(NoteName) {
    const noteBlock = document.getElementById(NoteName);
    var requestData = {
        id: parseInt(noteBlock.querySelector('h3').id),
    };

    // check if this block selected
    var selectedNote = localStorage.getItem('selected_note');
    if (selectedNote == parseInt(noteBlock.querySelector('h3').id)) {
        localStorage.removeItem('selected_note');
    }

    try {
        await serverRequest('Notes/DeleteNote', 'DELETE', requestData);
    } catch (error) {
        console.error('Error deleting note:', error);
    }
    noteBlock.classList.remove("active");
}

// Function to request archiving a note
async function archiveNote(NoteName) {
    const noteBlock = document.getElementById(NoteName);
    var requestData = {
        id: parseInt(noteBlock.querySelector('h3').id),
        status: true
    };

    // check if this block selected
    var selectedNote = localStorage.getItem('selected_note');
    if (selectedNote == parseInt(noteBlock.querySelector('h3').id)) {
        localStorage.removeItem('selected_note');
    }

    try {
        await serverRequest('Notes/ArchiveNote', 'PATCH', requestData);
    } catch (error) {
        console.error('Error archiving note:', error);
    }
    noteBlock.classList.remove("active");
}
