let isPanelExpandedByButton = false;
let isPanelExpandedByCursor = false;

function reserButtonText(){
    const roundButtons = document.querySelectorAll('.round-button span');
    roundButtons.forEach((span) => {
        span.style.opacity = '0';
    });
}

function toggleNavigationPanel() {
    const navigationPanel = document.getElementById('navigationPanel');

    // Toggle the panel expansion state
    isPanelExpandedByButton = !isPanelExpandedByButton;

    // Toggle the class for expanding/collapsing animation
    navigationPanel.classList.toggle('expanded', isPanelExpandedByButton);

    // Update the visibility of button labels
    updateButtonLabelsVisibility();
}

function updateButtonLabelsVisibility() {
    const roundButtons = document.querySelectorAll('.round-button span');
    roundButtons.forEach((span) => {
        span.style.opacity = isPanelExpandedByButton ? '1' : '0';
    });
}

function toggleNavigationPanelByCursor() {
    const navigationPanel = document.getElementById('navigationPanel');

    // Toggle the panel expansion state
    isPanelExpandedByCursor = !isPanelExpandedByCursor;

    // Toggle the class for expanding/collapsing animation
    navigationPanel.classList.toggle('expanded', isPanelExpandedByCursor);

    // Update the visibility of button labels
    updateButtonLabelsVisibilityByCursor();
}

function updateButtonLabelsVisibilityByCursor() {
    const roundButtons = document.querySelectorAll('.round-button span');
    roundButtons.forEach((span) => {
        span.style.opacity = isPanelExpandedByCursor ? '1' : '0';
    });
}

// Add event for expanding the panel on mouse enter
document.getElementById('navigationPanel').addEventListener('mouseenter', () => {
    if (!isPanelExpandedByButton) {
        if (!isPanelExpandedByCursor) {
            toggleNavigationPanelByCursor();
        }
    }
});

// Add event for collapsing the panel on mouse leave
document.getElementById('navigationPanel').addEventListener('mouseleave', () => {
    if (!isPanelExpandedByButton) {
        if (isPanelExpandedByCursor) {
            toggleNavigationPanelByCursor();
        }
    }
});

reserButtonText();