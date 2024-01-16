// Об'єкт для збереження введених даних та помилок
const userData = {
    TagName: "",
    UserName: "",
    Email: "",
    Password: "",
    ConfirmPassword: ""
};

const userLoginData = {
    TagName: "",
    Password: ""
}

const errorMessages = {
    TagName: "Tag name must be unique.",
    UserName: "",
    Email: "Email must have a gmail.com domain.",
    Password: "Password and confirm password must match.",
    ConfirmPassword: "Password and confirm password must match."
};

// Функція для збереження введених даних в об'єкт та верифікації
function updateUserData(fieldId) {
    userData[fieldId] = document.getElementById(fieldId).value;
    validateField(fieldId);
}

// Функція для збереження введених даних в об'єкт та верифікації
function updateUserLoginData(fieldId) {
    userLoginData[fieldId] = document.getElementById(fieldId).value;
    validateField(fieldId);
}

// Функція для вибору значень для відправлення на back-end
function getSignupFormData() {
    // Створити новий об'єкт
    const formData = Object.assign({}, userData);

    // Вилучити confirm_password з нового об'єкту
    delete formData.ConfirmPassword;

    return formData;
}

// Функція для верифікації та відправлення на back-end
function signup(){
    let is_error = false;
    // Верифікація заповнення полів
    for (const field in userData) {
        if (userData[field] === "") {
            displayError(field, `Please fill in ${field.replace('_', ' ')}`);
            is_error = true;
        }
    }
    if (is_error) return;

    // Верифікація унікальності tag name
    const uniqueTagName = true;
    if (!uniqueTagName) {
        displayError('TagName', errorMessages.TagName);
        is_error = true;
    }

    // Верифікація домену email
    if (!userData.Email.endsWith('@gmail.com')) {
        displayError('Email', errorMessages.Email);
        is_error = true;
    }

    // Верифікація відповідності паролів
    if (userData.Password !== userData.ConfirmPassword) {
        displayError('ConfirmPassword', errorMessages.ConfirmPassword);
        is_error = true;
    }

    if (is_error) return;

    // Отримання даних для відправлення на back-end
    const formData = getSignupFormData();

    // Використовуйте fetch або інші методи для відправки Post-запиту на сервер
    fetch('https://localhost:7131/api/Account/Authorization', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        // Відобразіть результат на сторінці
        console.log('Success:', data);
    }).catch(error => {
        console.error('Error:', error);
    });
}

function login(){
    let is_error = false;
    // Верифікація заповнення полів
    for (const field in userLoginData) {
        if (userLoginData[field] === "") {
            displayError(field, `Please fill in ${field.replace('_', ' ')}`);
            is_error = true;
        }
    }
    if (is_error) return;

    // Використовуйте fetch або інші методи для відправки Post-запиту на сервер
    fetch('https://localhost:7131/api/Account/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userLoginData),
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        // Відобразіть результат на сторінці
        console.log('Success:', data);
    }).catch(error => {
        console.error('Error:', error);
    });
}

// Функція для відображення помилок
function displayError(fieldId, errorMessage) {
    const errorElement = document.getElementById(`${fieldId}_error`);
    errorElement.textContent = errorMessage;
}

// Функція для приховання помилок
function hideError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}_error`);
    errorElement.textContent = "";
}

// Функція для валідації поля
function validateField(fieldId) {
    hideError(fieldId);

    // Додайте додаткові перевірки, якщо потрібно
}