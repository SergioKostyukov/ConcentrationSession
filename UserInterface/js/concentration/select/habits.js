// 
function displayHabits(habits) {
    const objectsPanel = document.querySelector('.habits-item');

    // Clear the objects panel before adding new ones
    objectsPanel.innerHTML = '';

    // Add a container for the habits text
    const textContainer = document.createElement('div');
    textContainer.classList.add('text-container');

    // Check if there is task text
    if (habits.text) {
        // Parse the text as JSON
        const objectContentArray = JSON.parse(habits.text);

        // Iterate through the array elements and create corresponding HTML elements
        objectContentArray.forEach(objectContent => {
            const doneToggleElement = document.createElement('div');
            doneToggleElement.classList.add('done-toggle');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'breakToggle';
            checkbox.checked = objectContent.isDone;
            checkbox.disabled = true;

            const paragraph = document.createElement('p');
            paragraph.contentEditable = false;
            paragraph.textContent = objectContent.text;
            if (checkbox.checked) {
                paragraph.classList.add("line-through");
            }

            // Add the created elements to doneToggleElement
            doneToggleElement.appendChild(checkbox);
            doneToggleElement.appendChild(paragraph);

            // Add doneToggleElement to textContainer
            textContainer.appendChild(doneToggleElement);
        });
    }

    objectsPanel.appendChild(textContainer);
}

/* ----------------------------- Requests ----------------------------- */

// Function to request the list of user habits
function getHabitsData() {
    fetch('https://localhost:7131/api/Tasks/GetHabits', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookieValue("jwtToken"),
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.message + `HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.habits != null) {
                displayHabits(data.habits);
            } else {
                console.log("No habits available");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
