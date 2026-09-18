// Функция открытия раздела с резюме с главного экрана
function showResumeSection() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('resumeWrapper').classList.add('active-section');
}

// Функция переключения между участниками
function switchTab(tabId, buttonElement) {
    const sections = document.querySelectorAll('.resume-section');
    sections.forEach(section => {
        section.classList.remove('active-tab');
    });

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active-tab');
    buttonElement.classList.add('active');
}