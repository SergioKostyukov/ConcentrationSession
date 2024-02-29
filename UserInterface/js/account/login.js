// Object to store user input login data
const userLoginData = {
    tag_name: "",
    password: ""
};

// Error messages for login validation
const ERROR_MESSAGES = {
    tag_name: "Please fill in the tag name",
    password: "Please fill in the password",
};

// Function to update user login data and perform validation
function updateUserLoginData(fieldId) {
    userLoginData[fieldId] = document.getElementById(fieldId).value;
    hideError(fieldId);
}

// Function to hide errors
function hideError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}_error`);
    errorElement.textContent = "";
}

// Function for login validation and sending data to the backend
function login() {
    // Validate input
    if (validateFields()) return;

    // Sending a POST request to the server
    fetch('https://localhost:7131/api/Account/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userLoginData),
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 400) {
            return response.json().then(data => {
                throw new Error(data.message);
            });
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    }).then(data => {
        // Set cookie with token
        setCookie("jwtToken", data.user_token, new Date(Date.now() + 12 * 3600 * 1000), "/");

        localStorage.setItem('habits_id', data.habits_id);

        // Save settings data to localStorage
        localStorage.setItem('work_time', data.settings.work_time);
        localStorage.setItem('break_time', data.settings.break_time);
        localStorage.setItem('is_notification_sound', data.settings.is_notification_sound);
        
        localStorage.setItem('day_goal', data.settings.day_goal);
        localStorage.setItem('reset_time', data.settings.reset_time);
        localStorage.setItem('is_weekend', data.settings.is_weekend);

        localStorage.setItem('theme_color', data.settings.theme_color);
        localStorage.setItem('ignore_habits', data.settings.ignore_habits);
        localStorage.setItem('block_sites', data.settings.block_sites);

        // Display successful login message and redirect to main page
        alert(data.message + '. Redirecting to main page.');
        window.location.href = 'mainpage.html';
    }).catch(error => {
        // Display error message and clear input fields
        alert(error.message + '. Please check your credentials.');
        clearInputFields();
        console.error(error);
    });
}

// Function to validate a field
function validateFields() {
    let is_error = false;

    // Validation for empty fields
    for (const field in userLoginData) {
        if (userLoginData[field] === '') {
            displayError(field, ERROR_MESSAGES[field]);
            is_error = true;
        }
    }

    return is_error;
}

// Function to display errors
function displayError(fieldId, errorMessage) {
    const errorElement = document.getElementById(`${fieldId}_error`);
    errorElement.textContent = errorMessage;
}

// Function to clear input fields
function clearInputFields() {
    const inputFields = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');

    inputFields.forEach(input => {
        input.value = '';
    });

    // Remove empty fields from userLoginData
    for (const field in userLoginData) {
        userLoginData[field] = '';
    }
}