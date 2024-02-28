// Generate a unique identifier value
const generateUniqueId = () => 'toggle_' + Math.random().toString(36).substring(2, 11);

function fillContentBlock() {
    var taskId = localStorage.getItem("selected_task");
    var noteId = localStorage.getItem("selected_note");
    var habitsSelected = localStorage.getItem("selected_habits");

    if (noteId && habitsSelected) {
        fillMode(taskId, noteId, localStorage.getItem("habits_id"), 'third');
    } else if (habitsSelected) {
        fillMode(taskId, null, localStorage.getItem("habits_id"), 'second');
    } else if (noteId) {
        fillMode(taskId, noteId, null, 'second');
    } else {
        fillMode(taskId, null, null, 'first');
    }
}

async function fillMode(taskId, noteId, habitsId, mode) {
    const contentBlock = document.getElementById("contentBlock");
    contentBlock.innerHTML = '';

    await fillObjectBlock(contentBlock, taskId, mode, 'Task');
    if (noteId && habitsId) {
        await fillObjectBlock(contentBlock, noteId, 'third', 'Note');
        await fillObjectBlock(contentBlock, habitsId, 'third', 'Habits');
    } else if (noteId) {
        await fillObjectBlock(contentBlock, noteId, 'second', 'Note');
    } else if (habitsId) {
        await fillObjectBlock(contentBlock, habitsId, 'second', 'Habits');
    }
}

async function fillObjectBlock(contentBlock, objectId, blockType = 'first', objectType) {
    if (objectType == 'Note') {
        var objectData = await getNoteData(objectId);
    } else {
        var objectData = await getTaskData(objectId);
    }

    // Add type-mode block
    const objectBlock = document.createElement('div');
    objectBlock.classList.add('content-block', `${blockType}-mode`);

    // Add the object title
    const objTitle = document.createElement('h3');
    objTitle.textContent = objectData.name;
    objTitle.id = objectId;
    objTitle.contentEditable = false;
    objectBlock.appendChild(objTitle);

    // Add a container for the block text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    textContainer.id = objectType;

    if (objectData.text) {
        if (objectType == 'Note') {
            fillNoteBlock(textContainer, objectData.text);
        } else {
            fillTaskBlock(textContainer, objectData.text);
        }
    }

    objectBlock.appendChild(textContainer);

    contentBlock.appendChild(objectBlock);
}

async function fillTaskBlock(textContainer, objText) {
    // Parse the text as JSON
    const objectContentArray = JSON.parse(objText);

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

async function fillNoteBlock(textContainer, objText) {
    const paragraph = document.createElement('p');
    paragraph.textContent = objText;
    paragraph.contentEditable = true;

    // Add doneToggleElement to textContainer
    textContainer.appendChild(paragraph);
}
