// Object to store input data and errors
const userData = {
    tag_name: "",
    user_name: "",
    email: "",
    password: "",
    confirm_password: "",
    notifications: false
};

// Error messages for validation
const errorMessages = {
    email: "Email must have a gmail.com domain.",
    confirm_password: "Password and confirm password must match."
};

// Function to update user data and perform validation
function updateUserData(fieldId) {
    userData[fieldId] = document.getElementById(fieldId).value;
    validateField(fieldId);
}

// Function to get form data for signup
function getSignupFormData() {
    const formData = { ...userData };
    delete formData.confirm_password;
    return formData;
}

// Function for signup validation and sending data to the backend
function signup() {
    let is_error = false;

    // Validation for empty fields
    for (const field in userData) {
        if (userData[field] === "") {
            displayError(field, `Please fill in ${field.replace('_', ' ')}`);
            is_error = true;
        }
    }
    if (is_error) return;

    // Validation for email domain
    if (!userData.email.endsWith('@gmail.com')) {
        displayError('Email', errorMessages.email);
        is_error = true;
    }

    // Validation for password match
    if (userData.password !== userData.confirm_password) {
        displayError('ConfirmPassword', errorMessages.confirm_password);
        is_error = true;
    }

    if (is_error) return;

    // Get data for backend submission
    const formData = getSignupFormData();

    // Fetch to send a POST request to the server
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
        // Display successful signup message and redirect to Login page
        alert('Signup successful. Redirecting to Login page.');
        window.location.href = 'login.html';
    }).catch(error => {
        // Display error message and clear input fields
        alert('Error during Signup. Please try again.');
        clearInputFields();
        console.error('Error:', error);
    });
}

// Function to clear input fields
function clearInputFields() {
    const inputFields = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');

    inputFields.forEach(input => {
        input.value = '';
    });
}

// Function to display errors
function displayError(fieldId, errorMessage) {
    const errorElement = document.getElementById(`${fieldId}_error`);
    errorElement.textContent = errorMessage;
}

// Function to hide errors
function hideError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}_error`);
    errorElement.textContent = "";
}

// Function to validate a field
function validateField(fieldId) {
    hideError(fieldId);
}
