// Отримання елементів DOM
var workPeriodSelect = document.getElementById('workPeriod');
var breakPeriodSelect = document.getElementById('breakPeriod');
var soundSwitch = document.getElementById('soundSwitch');
var dayGoalSelect = document.getElementById('dayGoal');
var resetTimeSelect = document.getElementById('resetTime');
var weekendsSwitch = document.getElementById('weekendsSwitch');

// Обробник події для вибору робочого періоду
workPeriodSelect.addEventListener('change', function () {
    var selectedWorkPeriod = workPeriodSelect.value;
    console.log('Selected Work Period:', selectedWorkPeriod);
});

// Обробник події для вибору перервного періоду
breakPeriodSelect.addEventListener('change', function () {
    var selectedBreakPeriod = breakPeriodSelect.value;
    console.log('Selected Break Period:', selectedBreakPeriod);
});

// Обробник події для вибору вихідних
soundSwitch.addEventListener('change', function () {
    var selectedSound = soundSwitch.checked;
    console.log('Selected sound:', selectedSound);
});

// Обробник події для вибору денної мети
dayGoalSelect.addEventListener('change', function () {
    var selectedDayGoal = dayGoalSelect.value;
    console.log('Selected Day Goal:', selectedDayGoal);
});

// Обробник події для вибору часу скидання
resetTimeSelect.addEventListener('change', function () {
    var selectedResetTime = resetTimeSelect.value;
    console.log('Selected Reset Time:', selectedResetTime);
});

// Обробник події для вибору вихідних
weekendsSwitch.addEventListener('change', function () {
    var selectedWeekends = weekendsSwitch.checked;
    console.log('Selected Weekends:', selectedWeekends);
});

function enableEditMode(blockId) {
    var inputs = document.querySelectorAll(`#${blockId} select, #${blockId} input`);
    // Enable inputs
    inputs.forEach(function (input) {
        input.removeAttribute('disabled');
    });

    var updateButton = document.getElementById(`${blockId}Update`);
    updateButton.innerHTML = "Save Changes";
    updateButton.onclick = function () {
        saveChanges(blockId);
    };
}

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

    if (blockId === 'sessionSettings') {
        localStorage.setItem('work_time', values['workPeriod']);
        localStorage.setItem('break_time', values['breakPeriod']);
        localStorage.setItem('is_notification_sound', values['soundSwitch']);
    } else if (blockId === 'goalsSettings') {
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

// Відновлення збережених значень при завантаженні сторінки
function restoreSavedValues(blockId) {
    if (blockId === 'sessionSettings') {
        var workTime = localStorage.getItem('work_time');
        var breakTime = localStorage.getItem('break_time');
        var isNotificationSound = localStorage.getItem('is_notification_sound');

        document.getElementById('workPeriod').value = workTime;
        document.getElementById('breakPeriod').value = breakTime;
        document.getElementById('soundSwitch').checked = isNotificationSound === 'true';
    } else if (blockId === 'goalsSettings') {
        var dayGoal = localStorage.getItem('day_goal');
        var resetTime = localStorage.getItem('reset_time');
        var isWeekend = localStorage.getItem('is_weekend');

        document.getElementById('dayGoal').value = dayGoal;
        document.getElementById('resetTime').value = resetTime;
        document.getElementById('weekendsSwitch').checked = isWeekend === 'true';
    }
}

restoreSavedValues('sessionSettings');
restoreSavedValues('goalsSettings');