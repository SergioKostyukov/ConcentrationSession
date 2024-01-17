const currentUser = {
    tag_name: "",
    user_name: "",
    email: "",
    notifications: false,
    registered: false,
};

function getUserInfo(){
    fetch('https://localhost:7131/api/Account/GetUser', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        if (data.message === "User data get successful") {
            currentUser.tag_name = data.user.tag_name;
            currentUser.user_name = data.user.user_name;
            currentUser.email = data.user.email;
            currentUser.notifications = data.user.notifications;
            currentUser.registered = true;
            console.log('User info:', data);

            updateProfileButtonText();
        } else if (data.message === "User not found") {
            console.log('User not found');
        } else {
            console.log('Unexpected response:', data);
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

// Функція для оновлення тексту на кнопці
async function updateProfileButtonText() {
    const profileButton = document.querySelector('.profile-button');

    await getUserInfo(); 

    profileButton.querySelector('h2').textContent = currentUser.registered ? currentUser.tag_name : "user";
}

function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userInfo = document.getElementById('userInfo');
    const userOptions = document.getElementById('userOptions');

    if (userMenu.style.display === 'none' || userMenu.style.display === '') {
        // Показуємо меню, якщо воно приховане
        if (currentUser.registered) {
            userInfo.innerHTML = `
            <p class="user-info-item">Name: ${currentUser.tag_name}</p>
            <p class="user-info-item">Email: ${currentUser.email}</p>
        `;
            userOptions.innerHTML = `
            <li><a href="account.html">User Account</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        `;
        } else {
            // Користувач не зареєстрований, виводимо опції для входу/реєстрації
            userInfo.innerHTML = `
            <p class="user-info-item">You are not registered</p>
        `;
            userOptions.innerHTML = `
            <li><a href="login.html">Login</a></li>
            <li><a href="signup.html">Sign up</a></li>
        `;
        }

        userMenu.style.display = 'block';
    } else {
        // Ховаємо меню, якщо воно відкрите
        userMenu.style.display = 'none';
    }
}

// Закривати меню, якщо користувач клікає за межами меню
document.addEventListener('click', function (event) {
    const userMenu = document.getElementById('userMenu');
    const profileButton = document.querySelector('.profile-button');

    if (event.target !== profileButton && !profileButton.contains(event.target) && event.target !== userMenu && !userMenu.contains(event.target)) {
        userMenu.style.display = 'none';
    }
});

// Функція для виходу користувача
function logout() {
    fetch('https://localhost:7131/api/Account/Logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log('User info:', data);
        currentUser.tag_name = "";
        currentUser.user_name = "";
        currentUser.email = "";
        currentUser.notifications = false;
        currentUser.registered = false;
        
        updateProfileButtonText();
    }).catch(error => {
        console.error('Error:', error);
    });
    toggleUserMenu(); // Оновлюємо меню після виходу
}

getUserInfo();
updateProfileButtonText(); 