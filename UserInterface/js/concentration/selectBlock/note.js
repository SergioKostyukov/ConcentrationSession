document.addEventListener("DOMContentLoaded", function () {
    //-------------------------------- NOTE UPDATE MODE --------------------------------

    const modal_update = document.getElementById("viewNote");
    const viewNoteBlock = document.getElementById('viewNoteBlock');

    document.querySelector('.note-sets').addEventListener('click', function (event) {
        const noteBlock = event.target.closest('.note-title-block');
        if (noteBlock) {
            ShowModal(noteBlock);

            modal_update.classList.add('active');
        }
    });

    modal_update.addEventListener("click", function (event) {
        if (event.target === modal_update) {
            modal_update.classList.remove("active");
            viewNoteBlock.innerHTML = '';
        }
    });

    async function ShowModal(noteBlock) {
        var id = parseInt(noteBlock.id.replace('block', ''), 10);
        noteData = await getNoteData(id);
        // Pass data to the modal window
        fillViewModal(viewNoteBlock, id, noteData);
    }
});

// Function to fill the update note window
function noteViewTextContainer(viewNoteBlock, objectData) {
    // Add a container for the note text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    const paragraph = document.createElement('p');
    paragraph.textContent = objectData.text;
    paragraph.contentEditable = false;

    // Add doneToggleElement to textContainer
    textContainer.appendChild(paragraph);

    viewNoteBlock.appendChild(textContainer);
}

function deactivateModalNote(){
    const modal = document.getElementById("viewNote");
    const viewNoteBlock = document.getElementById('viewNoteBlock');
    modal.classList.remove("active");
    viewNoteBlock.innerHTML = '';
}

/*  ----------------------------- Requests ----------------------------- */

// Function to request the list of user notes titles
function getTitlesOfNotes() {
    fetch('https://localhost:7131/api/Notes/GetTitlesOfNotArchivedNotes', {
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
                displayObjects(data.notesList, 'note');
            } else {
                console.log("No notes available");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to request the user note by id
async function getNoteData(id) {
    try {
        const response = await fetch(`https://localhost:7131/api/Notes/GetNoteById?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
            }
        });

        if (!response.ok) {
            throw new Error(response.message + `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.note != null) {
            return data.note;
        } else {
            console.log("No notes available");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}