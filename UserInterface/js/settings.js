// Getting DOM elements
var workPeriodSelect = document.getElementById('workPeriod');
var breakPeriodSelect = document.getElementById('breakPeriod');
var soundSwitch = document.getElementById('soundSwitch');
var dayGoalSelect = document.getElementById('dayGoal');
var resetTimeSelect = document.getElementById('resetTime');
var weekendsSwitch = document.getElementById('weekendsSwitch');

// Event handler for selecting work period
workPeriodSelect.addEventListener('change', function () {
    var selectedWorkPeriod = workPeriodSelect.value;
    console.log('Selected Work Period:', selectedWorkPeriod);
});

// Event handler for selecting break period
breakPeriodSelect.addEventListener('change', function () {
    var selectedBreakPeriod = breakPeriodSelect.value;
    console.log('Selected Break Period:', selectedBreakPeriod);
});

// Event handler for selecting notification sound
soundSwitch.addEventListener('change', function () {
    var selectedSound = soundSwitch.checked;
    console.log('Selected sound:', selectedSound);
});

// Event handler for selecting day goal
dayGoalSelect.addEventListener('change', function () {
    var selectedDayGoal = dayGoalSelect.value;
    console.log('Selected Day Goal:', selectedDayGoal);
});

// Event handler for selecting reset time
resetTimeSelect.addEventListener('change', function () {
    var selectedResetTime = resetTimeSelect.value;
    console.log('Selected Reset Time:', selectedResetTime);
});

// Event handler for selecting weekends
weekendsSwitch.addEventListener('change', function () {
    var selectedWeekends = weekendsSwitch.checked;
    console.log('Selected Weekends:', selectedWeekends);
});

// Function to enable edit mode
function enableEditMode(blockId) {
    var inputs = document.querySelectorAll(`#${blockId} select, #${blockId} input`);
    // Enable inputs
    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
    });

    var updateButton = document.getElementById(`${blockId}Update`);
    updateButton.innerHTML = "Save changes";
    updateButton.onclick = function () {
        saveChanges(blockId);
    };
}

// Function to save changes
function saveChanges(blockId) {
    var inputs = document.querySelectorAll(`#${blockId} select, #${blockId} input`);

    // Get values and save to local storage or send to server
    var values = {};
    inputs.forEach(function (input) {
        if (input.type === 'checkbox') {
            values[input.id] = input.checked;
        } else {
            values[input.id] = input.value;
        }
    });

    // Send data to server based on the blockId
    if (blockId === 'sessionSettings') {
        // Save values to DB
        sendSessionSettings(values);

        // Save values to local storage
        localStorage.setItem('work_time', values['workPeriod']);
        localStorage.setItem('break_time', values['breakPeriod']);
        localStorage.setItem('is_notification_sound', values['soundSwitch']);
    } else if (blockId === 'goalSettings') {
        // Save values to DB
        sendGoalSettings(values);

        // Save values to local storage
        localStorage.setItem('day_goal', values['dayGoal']);
        localStorage.setItem('reset_time', values['resetTime']);
        localStorage.setItem('is_weekend', values['weekendsSwitch']);
    }

    // Disable inputs
    inputs.forEach(function (input) {
        input.setAttribute('disabled', true);
    });

    var updateButton = document.getElementById(`${blockId}Update`);
    updateButton.innerHTML = "Want to change";
    updateButton.onclick = function () {
        enableEditMode(blockId);
    };
}

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

// Function to restore saved values when the page loads
function restoreSavedValues(blockId) {
    if (blockId === 'sessionSettings') {
        var workTime = localStorage.getItem('work_time');
        var breakTime = localStorage.getItem('break_time');
        var isNotificationSound = localStorage.getItem('is_notification_sound');

        document.getElementById('workPeriod').value = workTime;
        document.getElementById('breakPeriod').value = breakTime;
        document.getElementById('soundSwitch').checked = isNotificationSound === 'true';
    } else if (blockId === 'goalSettings') {
        var dayGoal = localStorage.getItem('day_goal');
        var resetTime = localStorage.getItem('reset_time');
        var isWeekend = localStorage.getItem('is_weekend');

        document.getElementById('dayGoal').value = dayGoal;
        document.getElementById('resetTime').value = resetTime;
        document.getElementById('weekendsSwitch').checked = isWeekend === 'true';
    }
}

// Call the function to restore saved values for each block
restoreSavedValues('sessionSettings');
restoreSavedValues('goalSettings');
