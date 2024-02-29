/* ----------------------------- Requests ----------------------------- */

// Function to send user profile data to the server
function sendUserData(userName, userTag, userEmail) {
    var userData = {
        id: getUserId("jwtToken"),
        tag_name: userTag,
        user_name: userName,
        email: userEmail,
        notifications: document.getElementById('newFieldSwitch').checked
    };

    fetch('https://localhost:7131/api/Account/UpdateUser', {
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
            setCookie("jwtToken", data.user_token, new Date(Date.now() + 12 * 3600 * 1000), "/");
            console.log("Token was updated");
            
            getUserInfo();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to send password change data to the server
function sendUserPassword(currentPassword, newPassword, confirmNewPassword) {
    // Check for match between new password and confirmation
    if (newPassword !== confirmNewPassword) {
        console.error('New password and confirm password do not match.');
        return;
    }

    // Create an object to send data
    var passwordData = {
        id: getUserId("jwtToken"),
        old_password: currentPassword,
        password: newPassword
    };

    fetch('https://localhost:7131/api/Account/UpdatePassword', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(passwordData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to get and display user information
function getUserInfo() {
    fetch('https://localhost:7131/api/Account/GetUser', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Set received user information to corresponding elements
            document.getElementById('usernameField').value = data.user.user_name;
            document.getElementById('usertagField').value = data.user.tag_name;
            document.getElementById('useremailField').value = data.user.email;

            // Create a switcher and set initial value
            var newFieldSwitch = document.getElementById('newFieldSwitch');
            newFieldSwitch.checked = data.user.notifications;
            newFieldSwitch.disabled = true; // switcher is disabled until in edit mode
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
        fetch('https://localhost:7131/api/Account/DeleteAccount', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                logout();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}