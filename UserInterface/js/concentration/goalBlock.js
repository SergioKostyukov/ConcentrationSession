
function updateGoalBlock(){
    var dayGoal = localStorage.getItem('day_goal');
    var complete = localStorage.getItem('complete_time') || 0;
    
    var goalValueElement = document.getElementById('dayGoalValue');
    var completeValueElement = document.getElementById('completeValue');
    
    goalValueElement.textContent = dayGoal/60 + ' hours';
    completeValueElement.textContent = formatCompleteTime(complete);
    
    var completionPercentage = ((complete/60) / dayGoal) * 100;
    
    document.getElementById('progressBar').style.setProperty('--progress-width', completionPercentage + '%');
    
    function formatCompleteTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
    
        let result = '';
        if (hours > 0) {
            result += hours + ' hours ';
        }
        if (minutes > 0 || hours === 0) {
            result += minutes + ' minutes';
        }
        
        return result;
    }
}
