// Toggle pin activation/deactivation
function togglePin(pinID) {
    const pinButton = document.getElementById(pinID);
    const isPinned = pinButton.classList.toggle("pinned"); // Adds or removes the "pinned" class

    const img = pinButton.querySelector('img');
    if (isPinned) {
        img.style.opacity = 1;
    } else {
        img.style.removeProperty('opacity');
    }
}

// Send a request to update the pin state
function saveTogglePin(pinID) {
    togglePin(pinID);

    const pinButton = document.getElementById(pinID);

    updatePin(pinButton);
}

// Generate a unique identifier value
function generateUniqueId() {
    return 'toggle_' + Math.random().toString(36).substring(2, 11);
}

// Function triggered when the save button is clicked
function saveUpdate(blockName) {
    const modal = document.getElementById(blockName);

    updateData(blockName);

    modal.classList.remove("active");
}

// ------------------------- Generation of modal window elements -------------------------

// Function to fill the update modal window
function fillUpdateModal(updateObjectBlock, objectBlock) {
    // Get data about the object from the selected block
    const title = objectBlock.querySelector("h3").textContent;

    // Clear the content of the update modal window before updating
    updateObjectBlock.innerHTML = '';

    // Add the object title
    const objTitle = document.createElement('h3');
    objTitle.textContent = title;
    const obj_id = parseInt(objectBlock.id.replace('block', ''), 10);
    objTitle.id = obj_id;
    objTitle.contentEditable = true;
    updateObjectBlock.appendChild(objTitle);

    // Add the "pin" button
    const pinButton = document.createElement('button');
    pinButton.classList.add('action-button', 'pin-button');
    const existpinButton = objectBlock.querySelector(".pin-button");
    const isPinned = existpinButton.classList.contains("pinned");
    if (isPinned) {
        pinButton.classList.add('pinned');
    }
    const pinImage = document.createElement('img');
    pinImage.src = 'images/pin.png';
    pinImage.alt = 'pin';
    pinButton.id = 'updatePin' + obj_id;
    pinButton.setAttribute('onclick', `togglePin('${pinButton.id}')`);
    pinButton.appendChild(pinImage);
    updateObjectBlock.appendChild(pinButton);

    // Add a separator
    const divider = document.createElement('hr');
    updateObjectBlock.appendChild(divider);

    fillUpdateTextContainer(updateObjectBlock, objectBlock);

    if (updateObjectBlock.id == "updateNoteBlock") {
        addCopyButton(updateObjectBlock, `copyNote('updateNote')`)
        addDeleteButton(updateObjectBlock, `deleteNote('updateNote')`)
        addArchiveButton(updateObjectBlock, `archiveNote('updateNote')`)
        addSaveButton(updateObjectBlock, `saveUpdate('updateNote')`)
    } else {
        addNotificationButton(updateObjectBlock, 'updateTask')
        addCopyButton(updateObjectBlock, `copyTask('updateTask')`)
        addDeleteButton(updateObjectBlock, `deleteTask('updateTask')`)
        addArchiveButton(updateObjectBlock, `archiveTask('updateTask')`)
        addSaveButton(updateObjectBlock, `saveUpdate('updateTask')`)
    }
}

// Add the "notification" button
function addNotificationButton(updateObjectBlock, command) {
    const notificationButton = document.createElement('button');
    notificationButton.classList.add('action-button', 'fourth-button');
    const notificationImage = document.createElement('img');
    notificationImage.src = 'images/notification.png';
    notificationImage.alt = 'notification';
    notificationButton.setAttribute('onclick', command);
    notificationButton.appendChild(notificationImage);
    updateObjectBlock.appendChild(notificationButton);
}

// Add the "copy" button
function addCopyButton(updateObjectBlock, command) {
    const copyButton = document.createElement('button');
    copyButton.classList.add('action-button', 'first-button');
    const copyImage = document.createElement('img');
    copyImage.src = 'images/copy.png';
    copyImage.alt = 'copy';
    copyButton.setAttribute('onclick', command);
    copyButton.appendChild(copyImage);
    updateObjectBlock.appendChild(copyButton);
}

// Add the "delete" button
function addDeleteButton(updateObjectBlock, command) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('action-button', 'third-button');
    const deleteImage = document.createElement('img');
    deleteImage.src = 'images/delete.png';
    deleteImage.alt = 'delete';
    deleteButton.setAttribute('onclick', command);
    deleteButton.appendChild(deleteImage);
    updateObjectBlock.appendChild(deleteButton);
}

// Add the "archive" button
function addArchiveButton(updateObjectBlock, command) {
    const archiveButton = document.createElement('button');
    archiveButton.classList.add('action-button', 'second-button');
    const archiveImage = document.createElement('img');
    archiveImage.src = 'images/folder.png';
    archiveImage.alt = 'archive';
    archiveButton.setAttribute('onclick', command);
    archiveButton.appendChild(archiveImage);
    updateObjectBlock.appendChild(archiveButton);
}

// Add the "Save Changes" button
function addSaveButton(updateObjectBlock, command) {
    const saveChangesButton = document.createElement('button');
    saveChangesButton.classList.add('save-task-button');
    saveChangesButton.setAttribute('onclick', command);
    saveChangesButton.textContent = 'Save Changes';
    updateObjectBlock.appendChild(saveChangesButton);
}

// ------------------------- Generation of .task-panel window elements -------------------------

function displayObjects(objects){
    const objectsPanel = document.querySelector('.tasks-panel');
    const pinnedObjects = [];
    const otherObjects = [];

    // Clear the objects panel before adding new ones
    objectsPanel.innerHTML = '';

    // Iterate over each object and create the corresponding HTML block
    objects.forEach(object => {
        const objectBlock = document.createElement('div');
        objectBlock.classList.add('task-block');
        objectBlock.id = 'block' + object.id;

        // Add the object title
        const objectTitle = document.createElement('h3');
        objectTitle.textContent = object.name;
        objectBlock.appendChild(objectTitle);

        // Add a separator
        const divider = document.createElement('hr');
        objectBlock.appendChild(divider);

        // Add the "pin" button
        const pinButton = document.createElement('button');
        pinButton.classList.add('action-button', 'pin-button');
        if (object.is_pin) {
            pinButton.classList.add('pinned');
            pinnedObjects.push(objectBlock);
        } else {
            otherObjects.push(objectBlock);
        }
        const pinImage = document.createElement('img');
        pinImage.src = 'images/pin.png';
        pinImage.alt = 'pin';
        pinButton.id = 'pin' + object.id;
        pinButton.setAttribute('onclick', `saveTogglePin('${pinButton.id}')`);
        pinButton.appendChild(pinImage);
        objectBlock.appendChild(pinButton);

        fillObjectsTextContainer(objectBlock, object);

        // Insert pinned objects
        pinnedObjects.forEach(objectBlock => {
            objectsPanel.appendChild(objectBlock);
        });

        // Insert other objects
        otherObjects.forEach(objectBlock => {
            objectsPanel.appendChild(objectBlock);
        });
    });
}

// ------------------------- Sending Requests -------------------------

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
        getUserData();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}
