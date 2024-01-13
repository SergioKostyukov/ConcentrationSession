let isPanelExpandedByButtom = false; // Початковий стан розширення панелі
let isPanelExpandedByCursor = false;

function toggleNavigationPanel() {
    const navigationPanel = document.getElementById('navigationPanel');

    // Змінити стан розширення панелі
    isPanelExpandedByButtom = !isPanelExpandedByButtom;

    // Змінити клас для анімації розширення/звуження
    navigationPanel.classList.toggle('expanded', isPanelExpandedByButtom);

    // Оновити видимість тексту кнопок
    updateButtonLabelsVisibility();
}

function toggleNavigationPanelByCursor() {
    const navigationPanel = document.getElementById('navigationPanel');

    // Змінити стан розширення панелі
    isPanelExpandedByCursor = !isPanelExpandedByCursor;

    // Змінити клас для анімації розширення/звуження
    navigationPanel.classList.toggle('expanded', isPanelExpandedByCursor);

    // Оновити видимість тексту кнопок
    updateButtonLabelsVisibilityByCursor();
}

function updateButtonLabelsVisibility() {
    const roundButtons = document.querySelectorAll('.round-button span');
    roundButtons.forEach((span) => {
        span.style.opacity = isPanelExpandedByButtom ? '1' : '0';
    });
}

function updateButtonLabelsVisibilityByCursor() {
    const roundButtons = document.querySelectorAll('.round-button span');
    roundButtons.forEach((span) => {
        span.style.opacity = isPanelExpandedByCursor ? '1' : '0';
    });
}

// Додайте подію для розширення панелі при натисканні
document.getElementById('navigationPanel').addEventListener('click', toggleNavigationPanel);

// Додайте подію для розширення панелі при наведенні
document.getElementById('navigationPanel').addEventListener('mouseenter', () => {
    if (!isPanelExpandedByButtom) {
        if (!isPanelExpandedByCursor) {
            toggleNavigationPanelByCursor();
        }
    }
});

// Додайте подію для звуження панелі при виході з області наведення
document.getElementById('navigationPanel').addEventListener('mouseleave', () => {
    if (!isPanelExpandedByButtom) {
        if (isPanelExpandedByCursor) {
        toggleNavigationPanelByCursor();
    }}
});