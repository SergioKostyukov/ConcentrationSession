function unArchiveTask(TaskId) {
    var requestData = {
        id: TaskId,
        status: false
    };

    fetch('https://localhost:7131/api/Tasks/ArchiveTask', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            getArchivedTasks();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function deleteTask(TaskId) {
    var requestData = {
        id: TaskId
    };

    fetch('https://localhost:7131/api/Tasks/DeleteTask', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            getArchivedTasks();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Функція для відображення завдань на сторінці
function displayTasks(tasks) {
    const archivePanel = document.getElementById('tasksArchive');

    // Очищаємо панель завдань перед додаванням нових
    archivePanel.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = 'Archived Tasks';
    archivePanel.appendChild(title);

    // Перебираємо кожне завдання і створюємо відповідний HTML-блок
    tasks.forEach(task => {
        const taskBlock = document.createElement('div');
        taskBlock.classList.add('task-block');
        taskBlock.id = 'block' + task.id;

        // Додаємо назву завдання
        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.name;
        taskBlock.appendChild(taskTitle);

        // Додаємо кнопку "archive"
        const archiveButton = document.createElement('button');
        archiveButton.classList.add('action-button', 'archive-button');
        const archiveImage = document.createElement('img');
        archiveImage.src = 'images/folder.png';
        archiveImage.alt = 'archive';
        archiveButton.setAttribute('onclick', `unArchiveTask(${task.id})`);
        archiveButton.appendChild(archiveImage);
        taskBlock.appendChild(archiveButton);

        // Додаємо кнопку "delete"
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('action-button', 'delete-button');
        const deleteImage = document.createElement('img');
        deleteImage.src = 'images/delete.png';
        deleteImage.alt = 'delete';
        deleteButton.setAttribute('onclick', `deleteTask(${task.id})`);
        deleteButton.appendChild(deleteImage);
        taskBlock.appendChild(deleteButton);

        // Додаємо розділювач
        const divider = document.createElement('hr');
        taskBlock.appendChild(divider);

        // Додаємо контейнер для тексту завдання
        const textContainer = document.createElement('div');
        textContainer.classList.add('text-container');

        if (task.text) {
            const taskContentArray = JSON.parse(task.text);

            // Перебираємо елементи масиву та створюємо відповідні HTML-елементи
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

// Функція-запит отримання списку заархівованих задач користувача
function getArchivedTasks() {
    // Ваш API-запит для отримання списку завдань
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

function unArchiveNote(TaskId) {
    var requestData = {
        id: TaskId,
        status: false
    };

    fetch('https://localhost:7131/api/Notes/ArchiveNote', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            getArchivedNotes();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function deleteNote(TaskId) {
    var requestData = {
        id: TaskId
    };

    fetch('https://localhost:7131/api/Notes/DeleteNote', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            getArchivedNotes();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Функція для відображення завдань на сторінці
function displayNotes(tasks) {
    const archivePanel = document.getElementById('notesArchive');

    // Очищаємо панель завдань перед додаванням нових
    archivePanel.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = 'Archived Notes';
    archivePanel.appendChild(title);

    // Перебираємо кожне завдання і створюємо відповідний HTML-блок
    tasks.forEach(task => {
        const taskBlock = document.createElement('div');
        taskBlock.classList.add('task-block');
        taskBlock.id = 'block' + task.id;

        // Додаємо назву завдання
        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.name;
        taskBlock.appendChild(taskTitle);

        // Додаємо кнопку "archive"
        const archiveButton = document.createElement('button');
        archiveButton.classList.add('action-button', 'archive-button');
        const archiveImage = document.createElement('img');
        archiveImage.src = 'images/folder.png';
        archiveImage.alt = 'archive';
        archiveButton.setAttribute('onclick', `unArchiveNote(${task.id})`);
        archiveButton.appendChild(archiveImage);
        taskBlock.appendChild(archiveButton);

        // Додаємо кнопку "delete"
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('action-button', 'delete-button');
        const deleteImage = document.createElement('img');
        deleteImage.src = 'images/delete.png';
        deleteImage.alt = 'delete';
        deleteButton.setAttribute('onclick', `deleteNote(${task.id})`);
        deleteButton.appendChild(deleteImage);
        taskBlock.appendChild(deleteButton);

        // Додаємо розділювач
        const divider = document.createElement('hr');
        taskBlock.appendChild(divider);

        // Додаємо контейнер для тексту завдання
        const textContainer = document.createElement('div');
        textContainer.classList.add('text-container');

        if (task.text) {
            const doneToggleElement = document.createElement('div');
            doneToggleElement.classList.add('done-toggle');

            const paragraph = document.createElement('p');
            paragraph.contentEditable = false;
            paragraph.textContent = task.text;

            doneToggleElement.appendChild(paragraph);

            textContainer.appendChild(doneToggleElement);

        }

        taskBlock.appendChild(textContainer);

        archivePanel.appendChild(taskBlock);
    });
}

// Функція-запит отримання списку заархівованих задач користувача
function getArchivedNotes() {
    // Ваш API-запит для отримання списку завдань
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
            displayNotes(data.tasksList);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getElements(){
    getArchivedTasks();
    getArchivedNotes();
}

getElements();
