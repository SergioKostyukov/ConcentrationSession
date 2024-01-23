document.addEventListener("DOMContentLoaded", function() {
    const addTaskButton = document.querySelector(".add-task-button");
    const modal = document.querySelector(".new-task-modal");
    const closeModalButton = document.querySelector(".close-modal");
    const saveTaskButton = document.querySelector(".save-task-button");

    addTaskButton.addEventListener("click", function() {
        modal.style.display = "block";
    });

    closeModalButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    saveTaskButton.addEventListener("click", function() {
        const taskTitle = document.getElementById("taskTitle").value;
        const taskContent = document.getElementById("taskContent").value;

        // Відправити дані на сервер або обробити їх локально
        console.log("Task Title:", taskTitle);
        console.log("Task Content:", taskContent);

        // Закрити модальне вікно
        modal.style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const taskBlocks = document.querySelectorAll(".task-block");
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

