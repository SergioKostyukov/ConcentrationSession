// Function to reset the template when exiting creation mode
function resetNoteBlock(modal_id) {
    const modal = document.getElementById(modal_id);

    // Reset the title value
    const noteTitle = modal.querySelector('#noteTitle');
    noteTitle.textContent = 'Node name';

    // Reset the "pin" button state
    const pinButton = modal.querySelector('#pinButton');
    if (pinButton.classList.contains('pinned')) {
        togglePin(pinButton.id);
    }

    // Reset the text value
    const textContent = modal.querySelector('.text-container p');
    textContent.textContent = 'Node body';
}

document.addEventListener("DOMContentLoaded", function () {
    //--------------------------------NEW NODE MODE--------------------------------

    const modal = document.getElementById("newNote");
    const addNoteButton = document.querySelector(".add-task-button");
    const saveNoteButton = modal.querySelector(".save-task-button");

    // Expand the template for a new task when the corresponding button is clicked
    addNoteButton.addEventListener("click", function () {
        modal.classList.add("active");
    });

    // Close the template when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.classList.remove("active");
            resetNoteBlock("newNote");
        }
    });

    // Save the object to the DB and the main menu
    saveNoteButton.addEventListener("click", function () {
        addNote("newNote");

        // Close the modal window
        modal.classList.remove("active");
        resetNoteBlock("newNote");
    });

    //--------------------------------NODE UPDATE MODE--------------------------------

    const modal_update = document.getElementById("updateNote");
    const updateNoteBlock = document.getElementById('updateNoteBlock');

    document.querySelector('.tasks-panel').addEventListener('click', function (event) {
        // Check if the click was on the "pin" button
        if (event.target.classList.contains('pin-button')) {
            return;
        }

        const noteBlock = event.target.closest('.task-block');
        if (noteBlock) {
            // Pass data to the modal window
            fillUpdateModal(updateNoteBlock, noteBlock);

            // Activate the modal window
            modal_update.classList.add('active');
        }
    });

    modal_update.addEventListener("click", function (event) {
        if (event.target === modal_update) {
            modal_update.classList.remove("active");
        }
    });
});

// Function to fill the update note window
function fillUpdateTextContainer(updateNoteBlock, objectBlock) {
    const content = objectBlock.querySelector(".text-container");

    // Add a container for the task text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    const uniqueId = generateUniqueId();
    textContainer.id = uniqueId;

    // Copy the <p> element and make it editable
    const paragraph = document.createElement('p');
    paragraph.contentEditable = true;
    paragraph.textContent = content.querySelector("p").textContent;
    textContainer.appendChild(paragraph);

    updateNoteBlock.appendChild(textContainer);
}

// Function to display tasks on the page
function fillObjectsTextContainer(objectBlock, object) {
    // Add a container for the note text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    // Check if there is note text
    if (object.text) {
        const paragraph = document.createElement('p');
        paragraph.contentEditable = false;
        paragraph.textContent = object.text;

        textContainer.appendChild(paragraph);
    }

    objectBlock.appendChild(textContainer);
}

function findHabbits() {
    return null;
}

getUserData();
