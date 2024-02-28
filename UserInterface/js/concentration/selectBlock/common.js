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

    if (viewObjectBlock.id == "viewTaskBlock") {
        taskViewTextContainer(viewObjectBlock, objectData);

        // check if this block selected
        var selectedTask = localStorage.getItem('selected_task');
        if (selectedTask == id) {
            addSelectButton(viewObjectBlock, `unselect('${id}', 'task')`, 'remove')
        } else {
            addSelectButton(viewObjectBlock, `select('${id}', 'task')`)
        }
    } else {
        noteViewTextContainer(viewObjectBlock, objectData);

        // check if this block selected
        var selectedNote = localStorage.getItem('selected_note');
        if (selectedNote == id) {
            addSelectButton(viewObjectBlock, `unselect('${id}', 'note')`, 'remove')
        } else {
            addSelectButton(viewObjectBlock, `select('${id}', 'note')`)
        }
    }
}

// Add the modal "select" button
function addSelectButton(viewObjectBlock, command, image_ = 'add') {
    const button = document.createElement('button');
    button.classList.add('action-button');
    const image = document.createElement('img');
    image.src = `images/${image_}.png`;
    image.alt = 'copy';
    button.setAttribute('onclick', command);
    if (image_ == 'add') {
        button.setAttribute('title', 'Select to session')
    } else {
        button.setAttribute('title', 'Unselect from session')
    }
    button.appendChild(image);
    viewObjectBlock.appendChild(button);
}

function displayObjects(objects, name) {
    const objectsPanel = document.querySelector(`.${name}-sets`);

    // Clear the objects panel before adding new ones
    objectsPanel.innerHTML = '';

    var selectedTask = localStorage.getItem('selected_task');
    var selectedNote = localStorage.getItem('selected_note');
    // Iterate over each object and create the corresponding HTML block
    objects.forEach(object => {
        if (object.name === 'Habits' && name === 'task') {

        } else {
            const objectData = document.createElement('div');
            objectData.classList.add(`${name}-title-block`);
            objectData.id = 'block' + object.id;

            if (object.id == selectedNote || object.id == selectedTask) {
                objectData.classList.add('highlighted');
            }

            // Add the object title
            const objectTitle = document.createElement('h3');
            objectTitle.textContent = object.name;
            objectData.appendChild(objectTitle);

            objectsPanel.appendChild(objectData);
        }
    });
}

function select(ObjectId, type) {
    // check if there are already selected task
    var selectedObject = localStorage.getItem(`selected_${type}`);
    if (selectedObject !== null) {
        unselect(selectedObject, type);
    }

    const objBlock = document.getElementById(`block${ObjectId}`);
    // Встановлюємо клас, що виділяє блок task-sets
    objBlock.classList.add('highlighted');

    localStorage.setItem(`selected_${type}`, ObjectId);

    setObjectSelectBlock(type);

    if (type === 'task') {
        deactivateModalTask();
    } else {
        deactivateModalNote();
    }
}

function unselect(ObjectId, type) {
    const objBlock = document.getElementById(`block${ObjectId}`);
    // Встановлюємо клас, що виділяє блок task-sets
    objBlock.classList.remove('highlighted');

    localStorage.removeItem(`selected_${type}`);

    setObjectSelectBlock(type);

    if (type === 'task') {
        deactivateModalTask();
    } else {
        deactivateModalNote();
    }
}

function setHabits() {
    if (localStorage.getItem("ignore_habits") === 'false') {
        // check if this block selected
        var selectedHabits = localStorage.getItem('selected_habits');
        if (selectedHabits !== null) {
            localStorage.removeItem('selected_habits');
        } else {
            localStorage.setItem('selected_habits', 1);
        }

        setObjectSelectBlock('habits');
    } else {
        alert("Oops, maybe you are ignoring habits( Change this option in settings");
        return;
    }
}

function setSelectBlocksImages() {
    setObjectSelectBlock('task');
    setObjectSelectBlock('note');
    setObjectSelectBlock('habits');
}

function setObjectSelectBlock(name) {
    if(name === 'habits' && localStorage.getItem("ignore_habits") === 'true'){
        localStorage.removeItem('selected_habits');
    }

    var selectedTask = localStorage.getItem(`selected_${name}`);
    const selectTaskButton = document.getElementById(`select-${name}`);
    if (selectedTask !== null) {
        selectTaskButton.querySelector('img').src = '../images/select_on.png';
    } else {
        selectTaskButton.querySelector('img').src = '../images/select_off.png';
    }
}