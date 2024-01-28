// Function to create new cookie data
function setCookie(name, value, expires, path) {
    var cookieString = name + "=" + encodeURIComponent(value);

    if (expires) {
        cookieString += "; expires=" + expires.toUTCString();
    }

    if (path) {
        cookieString += "; path=" + path;
    }

    document.cookie = cookieString;
}

// Function to get user data from token
function getCookieValue(cookieName) {
    var allCookies = document.cookie;
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(allCookies);
    var cookieArray = decodedCookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null;
}

// Function to get user id from token
function getUserId(cookieName){
    var userToken = getCookieValue(cookieName);

    if (userToken !== null) {
        var tokenParts = userToken.split('.');

        try {
            var payload = JSON.parse(atob(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')));

            return payload.id;
        } catch (error) {
            console.error('Error decoding token body: ', error);
        }
    } else {
        console.log("Unregistered user.");
    }
}