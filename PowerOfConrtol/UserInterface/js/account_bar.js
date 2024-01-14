const currentUser = {
    name: "Anonymous",
    email: "someone@gmail.com",
    registered: true, // Змініть це значення відповідно до стану реєстрації користувача
};

// Функція для оновлення тексту на кнопці
function updateProfileButtonText() {
    const profileButton = document.querySelector('.profile-button');
    profileButton.querySelector('h2').textContent = currentUser.registered ? currentUser.name : 'User';
}

function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userInfo = document.getElementById('userInfo');
    const userOptions = document.getElementById('userOptions');

    if (userMenu.style.display === 'none' || userMenu.style.display === '') {
        // Показуємо меню, якщо воно приховане
        if (currentUser.registered) {
            // Користувач зареєстрований, виводимо інформацію та опції
            userInfo.innerHTML = `
            <p class="user-info-item">Name: ${currentUser.name}</p>
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
    updateProfileButtonText()
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
    currentUser.registered = false;
    toggleUserMenu(); // Оновлюємо меню після виходу
}

updateProfileButtonText();