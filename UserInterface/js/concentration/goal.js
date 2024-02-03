var dayGoal = localStorage.getItem('day_goal');
var complete = 90;
console.log(`${complete}/${dayGoal}`);

var goalValueElement = document.getElementById('dayGoalValue');

goalValueElement.textContent = dayGoal/60 + ' hours';

var completeValueElement = document.getElementById('completeValue');

completeValueElement.textContent = complete/60 + ' hours';

var completionPercentage = (complete / dayGoal) * 100;

document.getElementById('progressBar').style.setProperty('--progress-width', completionPercentage + '%');