const userLoginData = {
    tag_name: "",
    password: ""
}

// Функція для збереження введених даних в об'єкт та верифікації
function updateUserLoginData(fieldId) {
    userLoginData[fieldId] = document.getElementById(fieldId).value;
    validateField(fieldId);
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

    // Відправки Post-запиту на сервер
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
        // Відображення повідомлення про вдалий вхід
        alert('Login successful. Redirecting to index page.');
        window.location.href = 'index.html';
    }).catch(error => {
        alert('Error during Login. Please check your credentials.');
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