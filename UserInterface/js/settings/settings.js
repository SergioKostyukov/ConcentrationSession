/* ----------------------------- Initial setup  ----------------------------- */
// Getting DOM elements
var workPeriodSelect = document.getElementById('workPeriod');
var breakPeriodSelect = document.getElementById('breakPeriod');
var soundSwitch = document.getElementById('soundSwitch');

var dayGoalSelect = document.getElementById('dayGoal');
var resetTimeSelect = document.getElementById('resetTime');
var weekendsSwitch = document.getElementById('weekendsSwitch');

var themeColorSwitch = document.getElementById('themeColorSwitch');
var ignoreHabitsSwitch = document.getElementById('ignoreHabitsSwitch');
var blockSitesSwitch = document.getElementById('blockSitesSwitch');

// Call function to restore saved values for each block
restoreSavedValues();

// Function to restore saved values when the page loads
function restoreSavedValues() {
    // Get session settings
    var workTime = localStorage.getItem('work_time');
    var breakTime = localStorage.getItem('break_time');
    var isNotificationSound = localStorage.getItem('is_notification_sound');

    workPeriodSelect.value = workTime;
    breakPeriodSelect.value = breakTime;
    soundSwitch.checked = isNotificationSound === 'true';

    // Get goal settings
    var dayGoal = localStorage.getItem('day_goal');
    var resetTime = localStorage.getItem('reset_time');
    var isWeekend = localStorage.getItem('is_weekend');

    dayGoalSelect.value = dayGoal;
    resetTimeSelect.value = resetTime;
    weekendsSwitch.checked = isWeekend === 'true';

    // Get other settings
    var themeColor = localStorage.getItem('theme_color');
    var ignoreHabits = localStorage.getItem('ignore_habits');
    var blockSites = localStorage.getItem('block_sites');

    themeColorSwitch.checked = themeColor === 'true';
    ignoreHabitsSwitch.checked = ignoreHabits === 'true';
    blockSitesSwitch.checked = blockSites === 'true';
}

/* ----------------------------- EDIT SETTINGS FUNCTIONAL  ----------------------------- */

// Function to enable edit mode
function enableEditMode(blockId) {
    var inputs = document.querySelectorAll(`#${blockId} select, #${blockId} input`);
    // Enable inputs
    inputs.forEach(input => input.removeAttribute('disabled'));

    var updateButton = document.getElementById(`${blockId}Update`);
    updateButton.innerHTML = "Save changes";
    updateButton.onclick = () => saveChanges(blockId);
}

// Function to save changes
function saveChanges(blockId) {
    var inputs = document.querySelectorAll(`#${blockId} select, #${blockId} input`);

    // Get values and save to local storage or send to server
    var values = {};
    inputs.forEach(function (input) {
        values[input.id] = input.type === 'checkbox' ? input.checked : input.value;
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
    } else if (blockId === 'otherSettings') {
        // Save values to DB
        sendOtherSettings(values);

        // Save values to local storage
        localStorage.setItem('theme_color', values['themeColorSwitch']);
        localStorage.setItem('ignore_habits', values['ignoreHabitsSwitch']);
        localStorage.setItem('block_sites', values['blockSitesSwitch']);
    }

    // Disable inputs
    inputs.forEach(input => input.setAttribute('disabled', true));

    var updateButton = document.getElementById(`${blockId}Update`);
    updateButton.innerHTML = "Want to change";
    updateButton.onclick = () => enableEditMode(blockId);
}
