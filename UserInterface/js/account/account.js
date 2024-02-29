function enableEditMode(editField1, editField2, editField3, updateButton) {
    // Check if already in edit mode
    if (editField1.readOnly) {
        // Enable edit mode
        editField1.readOnly = false;
        editField2.readOnly = false;
        editField3.readOnly = false;
        document.getElementById('newFieldSwitch').disabled = false;

        // Confirm button for saving changes
        updateButton.innerHTML = "Save Changes";
        updateButton.onclick = function () {
            saveChanges(editField1, editField2, editField3, updateButton);
        };
    } else {
        // Disable edit mode
        editField1.readOnly = true;
        editField2.readOnly = true;
        editField3.readOnly = true;
        document.getElementById('newFieldSwitch').disabled = true;

        // Confirm button to return to view mode
        updateButton.innerHTML = "Want to change";
        updateButton.onclick = function () {
            enableEditMode(editField1, editField2, editField3, updateButton);
        };
    }
}

function saveChanges(editField1, editField2, editField3, updateButton) {
    if (updateButton.id === "userDataUpdate") {
        sendUserData(editField1.value, editField2.value, editField3.value);
    } else if (updateButton.id === "userPasswordUpdate") {
        sendUserPassword(editField1.value, editField2.value, editField3.value);

        editField1.value = "";
        editField2.value = "";
        editField3.value = "";
    }
    // Disable edit mode
    enableEditMode(editField1, editField2, editField3, updateButton);
}

// Retrieve and display user information on page load
getUserInfo();