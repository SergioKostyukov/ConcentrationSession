function addTask(name, text) {
    var taskData = {
        id: getUserId("jwtToken"),
        name: name,
        text: text,
        is_archive: false,
        notification_time: new Date().toISOString(),
        is_pin: false
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
        window.location.href = 'concentration.html';
    }).catch(error => {
        alert(error.message + '. Please try again.');
        // clearInputFields();
        console.error('Error:', error);
    });
}

function updateTask(){
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

document.addEventListener("DOMContentLoaded", function () {
    const addTaskButton = document.querySelector(".add-task-button");
    const modal = document.querySelector(".new-task-modal");
    const saveTaskButton = document.querySelector(".save-task-button");

    addTaskButton.addEventListener("click", function () {
        modal.classList.add("active");
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    });

    saveTaskButton.addEventListener("click", function () {
        const taskTitle = document.getElementById("taskTitle").value;
        const taskContent = document.getElementById("taskContent").value;

        // Відправити дані на сервер або обробити їх локально
        console.log("Task Title:", taskTitle);
        console.log("Task Content:", taskContent);
        addTask(taskTitle, taskContent);

        // Закрити модальне вікно
        modal.classList.remove("active");
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const addContentButton = document.querySelector('.add-content-button');
    const saveTaskButton = document.querySelector('.save-task-button');

    addContentButton.addEventListener('click', addNewContent);

    function addNewContent() {
        const taskContent = document.getElementById('taskContent');

        // Створюємо новий елемент h4 для змісту завдання
        const newContentElement = document.createElement('h4');
        newContentElement.contentEditable = true;
        newContentElement.classList.add('task-content');
        newContentElement.innerText = 'New Task Body';

        // Вставляємо новий елемент після поточного елементу taskContent
        taskContent.parentNode.insertBefore(newContentElement, taskContent.nextSibling);
    }

    // Додайте інші необхідні функції або події тут

});

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
        console.log(`New Title: ${title}, New Content: ${content}`);

        modal.style.display = "none"; // Приховуємо модальне вікно
    };
});

