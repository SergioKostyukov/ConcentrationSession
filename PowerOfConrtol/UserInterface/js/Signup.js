// Об'єкт для збереження введених даних та помилок
const userData = {
    tag_name: "",
    user_name: "",
    email: "",
    password: "",
    confirm_password: "",
    notifications: false
};

const errorMessages = {
    email: "Email must have a gmail.com domain.",
    confirm_password: "Password and confirm password must match."
};

// Функція для збереження введених даних в об'єкт та верифікації
function updateUserData(fieldId) {
    userData[fieldId] = document.getElementById(fieldId).value;
    validateField(fieldId);
}

// Функція для вибору значень для відправлення на back-end
function getSignupFormData() {
    // Створити новий об'єкт
    const formData = Object.assign({}, userData);

    // Вилучити confirm_password з нового об'єкту
    delete formData.confirm_password;

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

    // Верифікація домену email
    if (!userData.email.endsWith('@gmail.com')) {
        displayError('Email', errorMessages.email);
        is_error = true;
    }

    // Верифікація відповідності паролів
    if (userData.password !== userData.confirm_password) {
        displayError('ConfirmPassword', errorMessages.confirm_password);
        is_error = true;
    }

    if (is_error) return;

    // Отримання даних для відправлення на back-end
    const formData = getSignupFormData();

    // fetch для відправки Post-запиту на сервер
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
        // Відображення повідомлення про вдалу реєстрацію
        alert('Signup successful. Redirecting to Login page.');
        // Перехід на сторінку Login
        window.location.href = 'login.html';
    }).catch(error => {
        // Відображення повідомлення про помилку
        alert('Error during Signup. Please try again.');
        clearInputFields();
        console.error('Error:', error);
    });
}

// Функція для очищення полів вводу
function clearInputFields() {
    const inputFields = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
    
    inputFields.forEach(input => {
        input.value = '';
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
}