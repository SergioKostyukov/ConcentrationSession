// Creating a new text element
function addNewContent(modal_id) {
    const modal = document.getElementById(modal_id);
    const newContentElement = document.createElement('div');
    newContentElement.classList.add('done-toggle');
    const uniqueId = generateUniqueId();
    newContentElement.id = uniqueId;

    newContentElement.innerHTML = `
            <input type="checkbox" id="breakToggle" />
            <p contenteditable="true"></p>
            <button class="delete-toggle-button" onclick="deleteToggle('${uniqueId}')">✖</button>
    `;

    // Find all elements with the class "done-toggle"
    const doneToggleElements = modal.querySelectorAll('.done-toggle');

    if (doneToggleElements.length > 0) {
        // Get the last element with the class "done-toggle"
        const lastDoneToggleElement = doneToggleElements[doneToggleElements.length - 1];

        lastDoneToggleElement.insertAdjacentElement('afterend', newContentElement);
    } else {
        // Add new content to the container
        const taskContentContainer = modal.querySelector("hr");
        taskContentContainer.insertAdjacentElement('afterend', newContentElement);
    }

    // Modified the next three lines to move focus
    const newParagraph = newContentElement.querySelector('p');
    newParagraph.contentEditable = true;
    newParagraph.focus();
}

function addNewContentAfter(activeElement) {
    const newContentElement = document.createElement('div');
    newContentElement.classList.add('done-toggle');
    const uniqueId = generateUniqueId();
    newContentElement.id = uniqueId;

    newContentElement.innerHTML = `
            <input type="checkbox" id="breakToggle" />
            <p contenteditable="true"></p>
            <button class="delete-toggle-button" onclick="deleteToggle('${uniqueId}')">✖</button>
    `;

    // Insert the new content element after the focused element
    activeElement.parentNode.insertAdjacentElement('afterend', newContentElement);

    // Set focus to the new paragraph
    const newParagraph = newContentElement.querySelector('p');
    newParagraph.contentEditable = true;
    newParagraph.focus();
}

// Deleting a text element
function deleteToggle(toggleId) {
    const toggleToDelete = document.getElementById(toggleId);
    if (toggleToDelete) {
        toggleToDelete.remove();
    }
}

// Function to reset the template when exiting creation mode
function resetTaskBlock(modal_id) {
    const modal = document.getElementById(modal_id);

    // Reset the title value
    const taskTitle = modal.querySelector('#taskTitle');
    taskTitle.textContent = 'Task name';

    // Reset the "pin" button state
    const pinButton = modal.querySelector('#pinButton');
    if (pinButton.classList.contains('pinned')) {
        togglePin(pinButton.id);
    }

    // Keep only one done-toggle
    const contentElements = modal.querySelectorAll('.done-toggle:not(:first-child)');
    contentElements.forEach(element => {
        element.remove();
    });

    // Uncheck the checkbox in the first element
    const Checkbox = modal.querySelector('.done-toggle input[type="checkbox"]');
    Checkbox.checked = false;

    // Reset the values in all paragraph elements except the first one
    const textContent = modal.querySelector('.done-toggle p');
    textContent.textContent = 'Task body';
}

document.addEventListener("DOMContentLoaded", function () {
    //--------------------------------NEW TASK MODE--------------------------------

    const modal = document.getElementById("newTask");
    const addTaskButton = document.querySelector(".add-task-button");
    const addContentButton = modal.querySelector('.add-content-button');
    const saveTaskButton = modal.querySelector(".save-task-button");

    // Expand the template for a new task when the corresponding button is clicked
    addTaskButton.addEventListener("click", function () {
        modal.classList.add("active");
    });

    // Close the template when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.classList.remove("active");
            resetTaskBlock("newTask");
        }
    });

    // Add a new content row to the task
    addContentButton.addEventListener('click', function () {
        addNewContent("newTask");
    });

    // Save the object to the DB and the main menu
    saveTaskButton.addEventListener("click", function () {
        if (addTask("newTask")) {
            // Close the modal window
            modal.classList.remove("active");
            resetTaskBlock("newTask");
        }
    });

    // Event handler for the Enter key in <p> blocks
    modal.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;

            // Check if the active element is an editable <p> block
            if (activeElement.tagName === 'P' && activeElement.isContentEditable) {
                // Trigger the function to add a new block
                event.preventDefault();
                addNewContentAfter(activeElement);
            }
        }
    });

    //--------------------------------TASK UPDATE MODE--------------------------------

    const modal_update = document.getElementById("updateTask");
    const updateTaskBlock = document.getElementById('updateTaskBlock');

    document.querySelector('.tasks-panel').addEventListener('click', function (event) {
        // Check if the click was on the "pin" button
        if (event.target.classList.contains('pin-button')) {
            return;
        }

        const taskBlock = event.target.closest('.task-block');
        if (taskBlock) {
            // Pass data to the modal window
            fillUpdateModal(updateTaskBlock, taskBlock);

            // Activate the modal window
            modal_update.classList.add('active');
        }
    });

    modal_update.addEventListener("click", function (event) {
        if (event.target === modal_update) {
            modal_update.classList.remove("active");
        }
    });

    // Event handler for the Enter key in <p> blocks
    modal_update.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;

            // Check if the active element is an editable <p> block
            if (activeElement.tagName === 'P' && activeElement.isContentEditable) {
                // Trigger the function to add a new block
                event.preventDefault();
                addNewContentAfter(activeElement);
            }
        }
    });
});

// Function to fill the update task window
function fillUpdateTextContainer(updateTaskBlock, objectBlock) {
    const contents = objectBlock.querySelectorAll(".done-toggle");

    // Add a container for the task text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    // Add task content
    contents.forEach(content => {
        const doneToggleElement = document.createElement('div');
        doneToggleElement.classList.add('done-toggle');
        const uniqueId = generateUniqueId();
        doneToggleElement.id = uniqueId;

        // Copy the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'breakToggle';
        checkbox.checked = content.querySelector("#breakToggle").checked;
        doneToggleElement.appendChild(checkbox);

        checkbox.addEventListener("change", function () {
            if (this.checked) {
                paragraph.classList.add("line-through");
            } else {
                paragraph.classList.remove("line-through");
            }
        });

        // Copy the <p> element and make it editable
        const paragraph = document.createElement('p');
        paragraph.contentEditable = true;
        paragraph.textContent = content.querySelector("p").textContent;
        if (checkbox.checked) {
            paragraph.classList.add("line-through");
        }
        doneToggleElement.appendChild(paragraph);

        // Add the delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-toggle-button');
        deleteButton.textContent = '✖';
        deleteButton.setAttribute('onclick', `deleteToggle('${uniqueId}')`);
        doneToggleElement.appendChild(deleteButton);

        // Add doneToggleElement to the modal window
        textContainer.appendChild(doneToggleElement);
    });

    // Add the "Add line" button
    const addContentButton = document.createElement('button');
    addContentButton.classList.add('add-content-button');
    addContentButton.setAttribute('onclick', `addNewContent('updateTask')`);
    addContentButton.textContent = 'Add line';
    textContainer.appendChild(addContentButton);

    updateTaskBlock.appendChild(textContainer);
}

// Function to fill the task content on the page
function fillObjectsTextContainer(objectBlock, object) {
    // Add a container for the task text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    // Check if there is task text
    if (object.text) {
        // Parse the text as JSON
        const objectContentArray = JSON.parse(object.text);

        // Iterate through the array elements and create corresponding HTML elements
        objectContentArray.forEach(objectContent => {
            const doneToggleElement = document.createElement('div');
            doneToggleElement.classList.add('done-toggle');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'breakToggle';
            checkbox.checked = objectContent.isDone;
            checkbox.disabled = true;

            const paragraph = document.createElement('p');
            paragraph.contentEditable = false;
            if (checkbox.checked) {
                paragraph.classList.add("line-through");
            }
            paragraph.textContent = objectContent.text;

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-toggle-button');
            deleteButton.textContent = 'U+00d7';
            deleteButton.style.visibility = 'hidden';

            // Add the created elements to doneToggleElement
            doneToggleElement.appendChild(checkbox);
            doneToggleElement.appendChild(paragraph);
            doneToggleElement.appendChild(deleteButton);

            // Add doneToggleElement to textContainer
            textContainer.appendChild(doneToggleElement);
        });
    }

    objectBlock.appendChild(textContainer);
}

// Function to reset Checkbox value
function resetCheckboxValues(blockName){
    const taskBlock = document.getElementById(blockName);

    // Get the content of "done-toggle" elements
    const doneToggleElements = taskBlock.querySelectorAll(".done-toggle");

    // Iterate over "done-toggle" elements and reset checkbox
    doneToggleElements.forEach(doneToggleElement => {
        doneToggleElement.querySelector("#breakToggle").checked = false;
        doneToggleElement.querySelector("p").classList.remove("line-through");
    });
}

async function findHabbits() {
    const habits = await getHabitsData();

    if (habits == null) {
        console.log("No habits available");
    }
    return habits;
}

getUserData();
