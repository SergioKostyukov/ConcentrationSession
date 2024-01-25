var is_pin_ = false;

function togglePin() {
    const pinButton = document.getElementById("pinButton");
    const isPinned = pinButton.classList.toggle("pinned"); // Додає або видаляє клас "pinned"

    // Додаємо або видаляємо значення is_pin у залежності від isPinned
    const img = pinButton.querySelector('img');
    if (isPinned) {
        img.style.opacity = 1;
    } else {
        img.style.removeProperty('opacity');
    }
    is_pin_ = isPinned;

    // Опціонально виводьте у консоль значення is_pin для перевірки
    console.log("is_pin:", isPinned);
}

function generateUniqueId() {
    return 'toggle_' + Date.now().toString(36);
}

document.addEventListener("DOMContentLoaded", function () {
    //--------------------------------NEW TASK MODE--------------------------------

    const addTaskButton = document.querySelector(".add-task-button");
    const modal = document.querySelector(".new-task-modal");
    const addContentButton = document.querySelector('.add-content-button');
    const saveTaskButton = document.querySelector(".save-task-button");

    // Розгортання шаблону для нового завдання при натисканні відповідної кнопки
    addTaskButton.addEventListener("click", function () {
        modal.classList.add("active");
    });

    // Закриття шаблону при натисканні поза його межами
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    });

    // Додавання нового рядка-елемента до завдання
    addContentButton.addEventListener('click', addNewContent);

    // Власне зберення об'єкту до DB та головного меню
    saveTaskButton.addEventListener("click", function () {
        addTask("newTask");

        // Закрити модальне вікно
        modal.classList.remove("active");
    });

    // Обробник події натискання клавіші Enter у блоках <p>
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;

            // Перевіряємо, чи активний елемент - редагований блок <p>
            if (activeElement.tagName === 'P' && activeElement.isContentEditable) {
                // Запускаємо функцію додавання нового блоку
                event.preventDefault();
                addNewContent();
            }
        }
    });

    // Створюємо новий текстовий елемент завдання
    function addNewContent() {
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
        const doneToggleElements = document.querySelectorAll('.new-task-modal .done-toggle');
        const taskContentContainer = modal.querySelector("hr");

        if (doneToggleElements.length > 0) {
            // Отримуємо останній елемент з класом "done-toggle"
            const lastDoneToggleElement = doneToggleElements[doneToggleElements.length - 1];

            lastDoneToggleElement.insertAdjacentElement('afterend', newContentElement);
        } else {
            // Додаємо новий зміст до контейнера
            taskContentContainer.insertAdjacentElement('afterend', newContentElement);
        }

        // Змінено наступні три рядки для переміщення фокусу
        const newParagraph = newContentElement.querySelector('p');
        newParagraph.contentEditable = true;
        newParagraph.focus();
    }

    //--------------------------------TASK UPDATE MODE--------------------------------

    const taskBlocks = document.querySelectorAll(".tasks-panel .task-block");
    const modal_update = document.querySelector(".modal_update");


});

/*
document.addEventListener("DOMContentLoaded", function () {
    const taskBlocks = document.querySelectorAll(".tasks-panel .task-block");
    const modal = document.querySelector(".modal");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");

    taskBlocks.forEach(taskBlock => {
        taskBlock.addEventListener("click", function (event) {
            event.stopPropagation(); // Зупинити розповсюдження події, щоб не скасовувати відображення модального вікна
            showModal(taskBlock);
        });
    });

    modal.addEventListener("click", function () {
        modal.style.display = "none"; // Приховуємо модальне вікно при кліку поза блоком
    });

    function showModal(taskBlock) {
        const taskId = taskBlock.dataset.id;
        const title = taskBlock.dataset.title;
        const content = taskBlock.dataset.content;

        // Заповнюємо поля вводу значеннями з task-block
        titleInput.value = title;
        contentInput.value = content;

        modal.style.display = "flex"; // Показуємо модальне вікно
    }

    // Функція для збереження змін на сервері
    window.saveChanges = function () {
        const title = titleInput.value;
        const content = contentInput.value;

        // Ваш код для відправлення даних на сервер
        console.log("New Title: ${title}, New Content: ${content}");

        modal.style.display = "none"; // Приховуємо модальне вікно
    };
});
*/

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

    var taskData = {
        id: getUserId("jwtToken"),
        name: taskTitle,
        text: JSON.stringify(taskContentArray),
        is_archive: false,
        notification_time: new Date().toISOString(),
        is_pin: is_pin_
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
        alert(data.message + '.');
        console.log(data.message);
        window.location.href = 'tasks.html';
    }).catch(error => {
        alert(error.message + '. Please try again.');
        console.error('Error:', error);
    });
}

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

function deleteToggle(toggleId) {
    const toggleToDelete = document.getElementById(toggleId);
    if (toggleToDelete) {
        toggleToDelete.remove();
    }
}

// Функція для відображення завдань на сторінці
function displayTasks(tasks) {
    const tasksPanel = document.querySelector('.tasks-panel');

    // Очищаємо панель завдань перед додаванням нових
    tasksPanel.innerHTML = '';

    // Перебираємо кожне завдання і створюємо відповідний HTML-блок
    tasks.forEach(task => {
        const taskBlock = document.createElement('div');
        taskBlock.classList.add('task-block');

        // Додаємо назву завдання
        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.name;
        taskBlock.appendChild(taskTitle);

        // Додаємо розділювач
        const divider = document.createElement('hr');
        taskBlock.appendChild(divider);

        // Додаємо кнопку "pin"
        const pinButton = document.createElement('button');
        pinButton.classList.add('pin-button');
        const pinImage = document.createElement('img');
        pinImage.src = 'images/pin.png';
        pinImage.alt = 'pin';
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
                checkbox.checked = taskContent.isDone; // Встановлюємо стан чекбоксу

                const paragraph = document.createElement('p');
                paragraph.contentEditable = true;
                paragraph.textContent = taskContent.text;

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-toggle-button');
                deleteButton.onclick = function () {
                    deleteToggle(taskContent.uniqueId);
                };
                deleteButton.textContent = '×';

                // Додаємо створені елементи до doneToggleElement
                doneToggleElement.appendChild(checkbox);
                doneToggleElement.appendChild(paragraph);
                doneToggleElement.appendChild(deleteButton);

                // Додаємо doneToggleElement до textContainer
                textContainer.appendChild(doneToggleElement);
            });
        }

        taskBlock.appendChild(textContainer);

        // Додаємо створений блок до панелі завдань
        tasksPanel.appendChild(taskBlock);
    });
}

getUserTasks();

/*
function updateTask() {
    var userData = {
        id: 1,
        tag_name: userTag,
        user_name: userName,
        email: userEmail,
        notifications: document.getElementById('newFieldSwitch').checked
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

            // Update cookie`s token
            setCookie("jwtToken", data.user_token, new Date(Date.now() + 3600 * 1000), "/");
            console.log("Token was updated");
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
*/