/* ----------------------------- Requests ----------------------------- */

// Function to send session settings to the server
function sendSessionSettings(request) {
    var settingsData = {
        user_id: getUserId("jwtToken"),
        work_time: request['workPeriod'],
        break_time: request['breakPeriod'],
        is_notification_sound: request['soundSwitch']
    };

    fetch('https://localhost:7131/api/Settings/UpdateSessionParams', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(settingsData)
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

// Function to send goal settings to the server
function sendGoalSettings(request) {
    var settingsData = {
        user_id: getUserId("jwtToken"),
        day_goal: request['dayGoal'],
        reset_time: request['resetTime'],
        is_weekend: request['weekendsSwitch']
    };

    fetch('https://localhost:7131/api/Settings/UpdateGoalParams', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(settingsData)
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

// Function to send other settings to the server
function sendOtherSettings(request) {
    var settingsData = {
        user_id: getUserId("jwtToken"),
        theme_color: request['themeColorSwitch'],
        ignore_habits: request['ignoreHabitsSwitch'],
        block_sites: request['blockSitesSwitch']
    };

    fetch('https://localhost:7131/api/Settings/UpdateOtherParams', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
        body: JSON.stringify(settingsData)
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
