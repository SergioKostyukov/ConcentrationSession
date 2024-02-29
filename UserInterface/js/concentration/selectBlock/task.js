document.addEventListener("DOMContentLoaded", function () {
    //--------------------------------TASK VIEW MODE--------------------------------

    const modal_update = document.getElementById("viewTask");
    const viewTaskBlock = document.getElementById('viewTaskBlock');

    document.querySelector('.task-sets').addEventListener('click', function (event) {
        const taskBlock = event.target.closest('.task-title-block');
        if (taskBlock) {
            ShowModal(taskBlock);

            modal_update.classList.add('active');
        }
    });

    modal_update.addEventListener("click", function (event) {
        if (event.target === modal_update) {
            modal_update.classList.remove("active");
            viewTaskBlock.innerHTML = '';
        }
    });

    async function ShowModal(taskBlock){
        var id = parseInt(taskBlock.id.replace('block', ''), 10);
        var taskData = await getTaskData(id);
        // Pass data to the modal window
        fillViewModal(viewTaskBlock, id, taskData);
    }
});

// Function to fill the update task window
function taskViewTextContainer(viewTaskBlock, objectData) {
    // Add a container for the task text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    // Check if there is task text
    if (objectData.text) {
        // Parse the text as JSON
        const objectContentArray = JSON.parse(objectData.text);

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
            paragraph.textContent = objectContent.text;
            if (checkbox.checked) {
                paragraph.classList.add("line-through");
            }

            // Add the created elements to doneToggleElement
            doneToggleElement.appendChild(checkbox);
            doneToggleElement.appendChild(paragraph);

            // Add doneToggleElement to textContainer
            textContainer.appendChild(doneToggleElement);
        });
    }

    viewTaskBlock.appendChild(textContainer);
}

function deactivateModalTask(){
    const modal = document.getElementById("viewTask");
    const viewTaskBlock = document.getElementById('viewTaskBlock');
    modal.classList.remove("active");
    viewTaskBlock.innerHTML = '';
}

/* ----------------------------- Requests ----------------------------- */

// Function to request the list of user tasks titles
function getTitlesOfTasks() {
    fetch('https://localhost:7131/api/Tasks/GetTitlesOfNotArchivedTasks', {
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
            if (data.tasksList != null) {
                displayObjects(data.tasksList, 'task');
            } else {
                console.log("No tasks available");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to request the user task by id
async function getTaskData(id) {
    try {
        const response = await fetch(`https://localhost:7131/api/Tasks/GetTaskById?id=${id}`, {
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

        if (data.task != null) {
            return data.task;
        } else {
            console.log("No tasks available");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}