// Активація/деактивація закріплення
function togglePin(pinID) {
    const pinButton = document.getElementById(pinID);
    const isPinned = pinButton.classList.toggle("pinned"); // Додає або видаляє клас "pinned"

    const img = pinButton.querySelector('img');
    if (isPinned) {
        img.style.opacity = 1;
    } else {
        img.style.removeProperty('opacity');
    }
}

function saveTogglePin(pinID) {
    const pinButton = document.getElementById(pinID);
    const isPinned = pinButton.classList.toggle("pinned"); // Додає або видаляє клас "pinned"

    const img = pinButton.querySelector('img');
    if (isPinned) {
        img.style.opacity = 1;
    } else {
        img.style.removeProperty('opacity');
    }

    updateTaskPin(pinButton);
}

function generateUniqueId() {
    return 'toggle_' + Math.random().toString(36).substring(2, 11);
}

// Видалення текстового елементу
function deleteToggle(toggleId) {
    const toggleToDelete = document.getElementById(toggleId);
    if (toggleToDelete) {
        toggleToDelete.remove();
    }
}

// Створення нового текстового елементу
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

    // Знаходимо всі елементи з класом "done-toggle"
    const doneToggleElements = modal.querySelectorAll('.done-toggle');

    if (doneToggleElements.length > 0) {
        // Отримуємо останній елемент з класом "done-toggle"
        const lastDoneToggleElement = doneToggleElements[doneToggleElements.length - 1];

        lastDoneToggleElement.insertAdjacentElement('afterend', newContentElement);
    } else {
        // Додаємо новий зміст до контейнера
        const taskContentContainer = modal.querySelector("hr");
        taskContentContainer.insertAdjacentElement('afterend', newContentElement);
    }

    // Змінено наступні три рядки для переміщення фокусу
    const newParagraph = newContentElement.querySelector('p');
    newParagraph.contentEditable = true;
    newParagraph.focus();
}

function resetTaskBlock(modal_id){
    const modal = document.getElementById(modal_id);

    // Скинути значення в заголовку
    const taskTitle = modal.querySelector('#taskTitle');
    taskTitle.textContent = 'Task name';

    // Скинути стан кнопки "pin"
    const pinButton = modal.querySelector('#pinButton');
    if(pinButton.classList.contains('pinned')){
        togglePin(pinButton.id);
    }

    // Залишити тільки один done-toggle
    const contentElements = modal.querySelectorAll('.done-toggle:not(:first-child)');
    contentElements.forEach(element => {
        element.remove();
    });

    // Зняти позначку "checked" у чекбокса першого елемента
    const Checkbox = modal.querySelector('.done-toggle input[type="checkbox"]');
    Checkbox.checked = false;

    // Скинути значення в усіх рядках-елементах, окрім першого
    const textContent = modal.querySelector('.done-toggle p');
    textContent.textContent = 'Task body';
}

document.addEventListener("DOMContentLoaded", function () {
    //--------------------------------NEW TASK MODE--------------------------------

    const modal = document.getElementById("newTask");
    const addTaskButton = document.querySelector(".add-task-button");
    const addContentButton = modal.querySelector('.add-content-button');
    const saveTaskButton = modal.querySelector(".save-task-button");

    // Розгортання шаблону для нового завдання при натисканні відповідної кнопки
    addTaskButton.addEventListener("click", function () {
        modal.classList.add("active");
    });

    // Закриття шаблону при натисканні поза його межами
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.classList.remove("active");
            resetTaskBlock("newTask");
        }
    });

    // Додавання нового рядка-елемента до завдання
    addContentButton.addEventListener('click', function () {
        addNewContent("newTask");
    });

    // Власне зберення об'єкту до DB та головного меню
    saveTaskButton.addEventListener("click", function () {
        addTask("newTask");

        // Закрити модальне вікно
        modal.classList.remove("active");
        resetTaskBlock("newTask");
    });

    // Обробник події натискання клавіші Enter у блоках <p>
    modal.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;

            // Перевіряємо, чи активний елемент - редагований блок <p>
            if (activeElement.tagName === 'P' && activeElement.isContentEditable) {
                // Запускаємо функцію додавання нового блоку
                event.preventDefault();
                addNewContent("newTask");
            }
        }
    });

    //--------------------------------TASK UPDATE MODE--------------------------------

    const modal_update = document.getElementById("updateTask");

    document.querySelector('.tasks-panel').addEventListener('click', function (event) {
        // Перевіряємо, чи клік був на кнопці "pin"
        if (event.target.classList.contains('pin-button')) {
            return;
        }

        const taskBlock = event.target.closest('.task-block');
        if (taskBlock) {
            // Передаємо дані в модальне вікно
            fillUpdateModal(taskBlock);

            // Активуємо модальне вікно
            modal_update.classList.add('active');
        }
    });

    modal_update.addEventListener("click", function (event) {
        if (event.target === modal_update) {
            modal_update.classList.remove("active");
        }
    });

    // Обробник події натискання клавіші Enter у блоках <p>
    modal_update.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;

            // Перевіряємо, чи активний елемент - редагований блок <p>
            if (activeElement.tagName === 'P' && activeElement.isContentEditable) {
                // Запускаємо функцію додавання нового блоку
                event.preventDefault();
                addNewContent("updateTask");
            }
        }
    });
});

// Функція для заповнення вікна для оновлення завдання
function fillUpdateModal(taskBlock) {
    const updateTaskBlock = document.getElementById('updateTaskBlock');

    // Отримуємо дані про завдання з вибраного блоку
    const title = taskBlock.querySelector("h3").textContent;
    const contents = taskBlock.querySelectorAll(".done-toggle");

    // Очищаємо вміст модального вікна перед оновленням
    updateTaskBlock.innerHTML = '';

    // Додаємо назву завдання
    const taskTitle = document.createElement('h3');
    taskTitle.textContent = title;
    const task_id = parseInt(taskBlock.id.replace('block', ''), 10);
    taskTitle.id = task_id;
    taskTitle.contentEditable = true;
    updateTaskBlock.appendChild(taskTitle);

    // Додаємо кнопку "pin"
    const pinButton = document.createElement('button');
    pinButton.classList.add('action-button', 'pin-button');
    const existpinButton = taskBlock.querySelector(".pin-button");
    const isPinned = existpinButton.classList.contains("pinned");
    if (isPinned) {
        pinButton.classList.add('pinned');
    }
    const pinImage = document.createElement('img');
    pinImage.src = 'images/pin.png';
    pinImage.alt = 'pin';
    pinButton.id = 'updatePin' + task_id;
    pinButton.setAttribute('onclick', `togglePin('${pinButton.id}')`);
    pinButton.appendChild(pinImage);
    updateTaskBlock.appendChild(pinButton);

    // Додаємо розділювач
    const divider = document.createElement('hr');
    updateTaskBlock.appendChild(divider);

    // Додаємо контейнер для тексту завдання
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    // Додаємо вміст завдання
    contents.forEach(content => {
        const doneToggleElement = document.createElement('div');
        doneToggleElement.classList.add('done-toggle');
        const uniqueId = generateUniqueId();
        doneToggleElement.id = uniqueId;

        // Копіюємо чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'breakToggle';
        checkbox.checked = content.querySelector("#breakToggle").checked;
        doneToggleElement.appendChild(checkbox);

        // Копіюємо рядок <p> і робимо його редагованим
        const paragraph = document.createElement('p');
        paragraph.contentEditable = true;
        paragraph.textContent = content.querySelector("p").textContent;
        doneToggleElement.appendChild(paragraph);

        // Додаємо кнопку видалення
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-toggle-button');
        deleteButton.textContent = '✖';
        deleteButton.setAttribute('onclick', `deleteToggle('${uniqueId}')`);
        doneToggleElement.appendChild(deleteButton);

        // Додаємо doneToggleElement до модального вікна
        textContainer.appendChild(doneToggleElement);
    });

    // Додаємо кнопку "Add line"
    const addContentButton = document.createElement('button');
    addContentButton.classList.add('add-content-button');
    addContentButton.setAttribute('onclick', `addNewContent('updateTask')`);
    addContentButton.textContent = 'Add line';
    textContainer.appendChild(addContentButton);

    updateTaskBlock.appendChild(textContainer);

    // Додаємо кнопку "notification"
    const notificationButton = document.createElement('button');
    notificationButton.classList.add('action-button', 'notification-button');
    const notificationImage = document.createElement('img');
    notificationImage.src = 'images/notification.png';
    notificationImage.alt = 'notification';
    notificationButton.setAttribute('onclick', `notificationTask('updateTask')`);
    notificationButton.appendChild(notificationImage);
    updateTaskBlock.appendChild(notificationButton);

    // Додаємо кнопку "copy"
    const copyButton = document.createElement('button');
    copyButton.classList.add('action-button', 'copy-button');
    const copyImage = document.createElement('img');
    copyImage.src = 'images/copy.png';
    copyImage.alt = 'copy';
    copyButton.setAttribute('onclick', `copyTask('updateTask')`);
    copyButton.appendChild(copyImage);
    updateTaskBlock.appendChild(copyButton);

    // Додаємо кнопку "delete"
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('action-button', 'delete-button');
    const deleteImage = document.createElement('img');
    deleteImage.src = 'images/delete.png';
    deleteImage.alt = 'delete';
    deleteButton.setAttribute('onclick', `deleteTask('updateTask')`);
    deleteButton.appendChild(deleteImage);
    updateTaskBlock.appendChild(deleteButton);

    // Додаємо кнопку "archive"
    const archiveButton = document.createElement('button');
    archiveButton.classList.add('action-button', 'archive-button');
    const archiveImage = document.createElement('img');
    archiveImage.src = 'images/folder.png';
    archiveImage.alt = 'archive';
    archiveButton.setAttribute('onclick', `archiveTask('updateTask')`);
    archiveButton.appendChild(archiveImage);
    updateTaskBlock.appendChild(archiveButton);

    // Додаємо кнопку "Save Changes"
    const saveChangesButton = document.createElement('button');
    saveChangesButton.classList.add('save-task-button');
    saveChangesButton.setAttribute('onclick', `saveUpdate('updateTask')`);
    saveChangesButton.textContent = 'Save Changes';
    updateTaskBlock.appendChild(saveChangesButton);
}

// Функція при натисканні на кнопку збереження  
function saveUpdate(blockName) {
    const modal = document.getElementById(blockName);

    updateTask(blockName);

    modal.classList.remove("active");
}

// Функція для відображення завдань на сторінці
function displayTasks(tasks) {
    const tasksPanel = document.querySelector('.tasks-panel');
    const pinnedTasks = [];
    const otherTasks = [];

    // Очищаємо панель завдань перед додаванням нових
    tasksPanel.innerHTML = '';

    // Перебираємо кожне завдання і створюємо відповідний HTML-блок
    tasks.forEach(task => {
        const taskBlock = document.createElement('div');
        taskBlock.classList.add('task-block');
        taskBlock.id = 'block' + task.id;

        // Додаємо назву завдання
        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.name;
        taskBlock.appendChild(taskTitle);

        // Додаємо розділювач
        const divider = document.createElement('hr');
        taskBlock.appendChild(divider);

        // Додаємо кнопку "pin"
        const pinButton = document.createElement('button');
        pinButton.classList.add('action-button', 'pin-button');
        if (task.is_pin) {
            pinButton.classList.add('pinned');
            pinnedTasks.push(taskBlock);
        } else {
            otherTasks.push(taskBlock);
        }
        const pinImage = document.createElement('img');
        pinImage.src = 'images/pin.png';
        pinImage.alt = 'pin';
        pinButton.id = 'pin' + task.id;
        pinButton.setAttribute('onclick', `saveTogglePin('${pinButton.id}')`);
        pinButton.appendChild(pinImage);
        taskBlock.appendChild(pinButton);

        // Додаємо контейнер для тексту завдання
        const textContainer = document.createElement('div');
        textContainer.classList.add('text-container');

        // Перевіряємо, чи є текст завдання
        if (task.text) {
            // Розпарсюємо текст як JSON
            const taskContentArray = JSON.parse(task.text);

            // Перебираємо елементи масиву та створюємо відповідні HTML-елементи
            taskContentArray.forEach(taskContent => {
                const doneToggleElement = document.createElement('div');
                doneToggleElement.classList.add('done-toggle');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'breakToggle';
                checkbox.checked = taskContent.isDone;
                checkbox.disabled = true;

                const paragraph = document.createElement('p');
                paragraph.contentEditable = false;
                paragraph.textContent = taskContent.text;

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-toggle-button');
                deleteButton.textContent = '×';
                deleteButton.style.visibility = 'hidden';

                // !!! додати ще кнопку для меню дій з блоком !!!

                // Додаємо створені елементи до doneToggleElement
                doneToggleElement.appendChild(checkbox);
                doneToggleElement.appendChild(paragraph);
                doneToggleElement.appendChild(deleteButton);

                // Додаємо doneToggleElement до textContainer
                textContainer.appendChild(doneToggleElement);
            });
        }

        taskBlock.appendChild(textContainer);

        // Вставляємо закріплені завдання
        pinnedTasks.forEach(taskBlock => {
            tasksPanel.appendChild(taskBlock);
        });

        // Вставляємо інші завдання
        otherTasks.forEach(taskBlock => {
            tasksPanel.appendChild(taskBlock);
        });
    });
}

// Функція-запит додавання завдання до DB
function addTask(blockName) {
    // Отримуємо основний блок
    const taskBlock = document.getElementById(blockName);

    // Отримуємо дані з блоку
    const taskTitle = taskBlock.querySelector("#taskTitle").textContent;

    // Отримуємо вміст елементів "done-toggle"
    const doneToggleElements = taskBlock.querySelectorAll(".done-toggle");

    // Створюємо масив для збереження тексту та статусу
    const taskContentArray = [];

    // Перебираємо елементи "done-toggle" та збираємо текст та статус
    doneToggleElements.forEach(doneToggleElement => {
        const text = doneToggleElement.querySelector("p").textContent;
        const isDone = doneToggleElement.querySelector("#breakToggle").checked;
        taskContentArray.push({ text, isDone });
    });

    const pinButton = document.getElementById("pinButton");
    const isPinned = pinButton.classList.contains("pinned");

    var taskData = {
        user_id: getUserId("jwtToken"),
        name: taskTitle,
        text: JSON.stringify(taskContentArray),
        is_archive: false,
        notification_time: new Date().toISOString(),
        is_pin: isPinned
    };

    // Fetch to send a POST request to the server
    fetch('https://localhost:7131/api/Tasks/AddTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(taskData),
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.message + `HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log(data.message);
        getUserTasks();
    }).catch(error => {
        alert(error.message + '. Please try again.');
        console.error('Error:', error);
    });
}

// Функція-запит отримання списку задач користувача
function getUserTasks() {
    // Ваш API-запит для отримання списку завдань
    fetch('https://localhost:7131/api/Tasks/GetNotArchivedTasks', {
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
            // Отримано список завдань
            displayTasks(data.tasksList);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Функція-запит оновлення завдання
function updateTask(blockName) {
    // Отримуємо основний блок
    const taskBlock = document.getElementById(blockName);

    // Отримуємо дані з блоку
    const taskId = parseInt(taskBlock.querySelector("h3").id);
    const taskTitle = taskBlock.querySelector("h3").textContent;

    // Отримуємо вміст елементів "done-toggle"
    const doneToggleElements = taskBlock.querySelectorAll(".done-toggle");

    // Створюємо масив для збереження тексту та статусу
    const taskContentArray = [];

    // Перебираємо елементи "done-toggle" та збираємо текст та статус
    doneToggleElements.forEach(doneToggleElement => {
        const text = doneToggleElement.querySelector("p").textContent;
        const isDone = doneToggleElement.querySelector("#breakToggle").checked;
        taskContentArray.push({ text, isDone });
    });

    const pinButton = taskBlock.querySelector(".pin-button");
    const isPinned = pinButton.classList.contains("pinned");

    var userData = {
        id: taskId,
        name: taskTitle,
        text: JSON.stringify(taskContentArray),
        is_archive: false,
        notification_time: new Date().toISOString(),
        is_pin: isPinned
    };

    fetch('https://localhost:7131/api/Tasks/UpdateTask', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            getUserTasks();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Функція-запит оновлення статусу закріплення завдання
function updateTaskPin(pin) {
    var requestData = {
        id: parseInt(pin.id.replace('pin', ''), 10),
        status: pin.classList.contains("pinned")
    };

    fetch('https://localhost:7131/api/Tasks/UpdateTaskPin', {
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
            getUserTasks();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function copyTask(TaskName){
    const taskBlock = document.getElementById(TaskName);
    var requestData = {
        id: parseInt(taskBlock.querySelector('h3').id),
    };

    console.log(requestData.id);

    fetch('https://localhost:7131/api/Tasks/CopyTask', {
        method: 'POST',
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
            getUserTasks();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function deleteTask(TaskName){
    const taskBlock = document.getElementById(TaskName);
    var requestData = {
        id: parseInt(taskBlock.querySelector('h3').id),
    };

    console.log(requestData.id);

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
            getUserTasks();
            taskBlock.classList.remove("active");
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function archiveTask(TaskName){
    const taskBlock = document.getElementById(TaskName);
    var requestData = {
        id: parseInt(taskBlock.querySelector('h3').id),
        status: true
    };

    console.log(requestData.id, requestData.status);

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
            getUserTasks();
            taskBlock.classList.remove("active");
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function notificationTask(TaskName){

}

getUserTasks();
