// Object to store current user information
const currentUser = {
    tag_name: "",
    user_name: "",
    email: "",
    notifications: false,
    registered: false,
};

// Function to asynchronously update the profile button text
function updateProfileButtonText() {
    const profileButton = document.querySelector('.profile-button');

    profileButton.querySelector('h2').textContent = currentUser.registered ? currentUser.tag_name : "user";
}

// Function to toggle the user menu visibility
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userInfo = document.getElementById('userInfo');
    const userOptions = document.getElementById('userOptions');

    if (userMenu.style.display === 'none' || userMenu.style.display === '') {
        // Show the menu if it is hidden
        if (currentUser.registered) {
            userInfo.innerHTML = `
            <p class="user-info-item">Name: ${currentUser.tag_name}</p>
            <p class="user-info-item">Email: ${currentUser.email}</p>
        `;
            userOptions.innerHTML = `
            <a href="account.html" class="user-menu-choise">User Account</a>
            <a href="#"  class="user-menu-choise" onclick="logout()">Logout</a>
        `;
        } else {
            // User is not registered, display options for login/signup
            userInfo.innerHTML = `
            <p class="user-info-item">You are not registered</p>
        `;
            userOptions.innerHTML = `
            <a href="login.html" class="user-menu-choise">Login</a>
            <a href="signup.html" class="user-menu-choise">Signup</a>
        `;
        }

        userMenu.style.display = 'block';
    } else {
        // Hide the menu if it is open
        userMenu.style.display = 'none';
    }
}

// Function to fetch user information from the server
function getUserInfo() {
    var userToken = getCookieValue("jwtToken");

    if (userToken !== null) {
        var tokenParts = userToken.split('.');

        try {
            var payload = JSON.parse(atob(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')));

            currentUser.tag_name = payload.tag_name;
            currentUser.user_name = payload.user_name;
            currentUser.email = payload.email;
            currentUser.notifications = payload.notifications;
            currentUser.registered = true;

            console.log("Registered user: " + currentUser.tag_name);
        } catch (error) {
            console.error('Error decoding token body: ', error);
        }
    } else {
        alert("Sorry, but you not logged in(");
        window.location.href = 'login.html';
    }

    updateProfileButtonText();
}

// Function to handle user logout
function logout() {
    // Clear cookie values
    setCookie("jwtToken", "", new Date(0), "/");

    // Update user information locally
    currentUser.tag_name = "";
    currentUser.user_name = "";
    currentUser.email = "";
    currentUser.notifications = false;
    currentUser.registered = false;

    console.log('Logout successful');

    window.location.href = 'login.html';
}

// Close the menu if the user clicks outside of it
document.addEventListener('click', function (event) {
    const userMenu = document.getElementById('userMenu');
    const profileButton = document.querySelector('.profile-button');

    if (event.target !== profileButton && !profileButton.contains(event.target) && event.target !== userMenu && !userMenu.contains(event.target)) {
        userMenu.style.display = 'none';
    }
});

getUserInfo();