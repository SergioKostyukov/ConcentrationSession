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

// Function to fill the update modal window
function fillViewModal(viewObjectBlock, id, objectData) {
    // Clear the content of the update modal window before updating
    viewObjectBlock.innerHTML = '';

    // Add the object title
    const objTitle = document.createElement('h3');
    objTitle.textContent = objectData.name;
    objTitle.id = id;
    objTitle.contentEditable = false;
    viewObjectBlock.appendChild(objTitle);

    // Add a separator
    const divider = document.createElement('hr');
    viewObjectBlock.appendChild(divider);

    
    if(viewObjectBlock.id == "viewTaskBlock"){
        taskViewTextContainer(viewObjectBlock, objectData);
        addSelectButton(viewObjectBlock, "selectTask('viewTask')")
    }else{
        noteViewTextContainer(viewObjectBlock, objectData);
        addSelectButton(viewObjectBlock, "selectNote('viewNote')")
    }
}

// Add the "select" button
function addSelectButton(viewObjectBlock, command) {
    const copyButton = document.createElement('button');
    copyButton.classList.add('action-button');
    const copyImage = document.createElement('img');
    copyImage.src = 'images/add.png';
    copyImage.alt = 'copy';
    copyButton.setAttribute('onclick', command);
    copyButton.appendChild(copyImage);
    viewObjectBlock.appendChild(copyButton);
}

function displayObjects(objects, name){
    const objectsPanel = document.querySelector(`.${name}-sets`);

    // Clear the objects panel before adding new ones
    objectsPanel.innerHTML = '';

    // const title = document.createElement('h2');
    // title.textContent = 'Task sets';
    // objectsPanel.appendChild(title);
    // Iterate over each object and create the corresponding HTML block
    objects.forEach(object => {
        const objectData = document.createElement('div');
        objectData.classList.add(`${name}-title-block`);
        objectData.id = 'block' + object.id;

        // Add the object title
        const objectTitle = document.createElement('h3');
        objectTitle.textContent = object.name;
        objectData.appendChild(objectTitle);

        objectsPanel.appendChild(objectData);
    });
}