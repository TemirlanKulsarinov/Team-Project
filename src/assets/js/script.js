function switchTab(tabId, buttonElement) {
    // 1. Скрываем все секции резюме
    const sections = document.querySelectorAll('.resume-section');
    sections.forEach(section => {
        section.classList.remove('active-tab');
    });

    // 2. Убираем класс активности у всех кнопок навигации
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Показываем ту секцию, на которую нажали
    document.getElementById(tabId).classList.add('active-tab');

    // 4. Делаем нажатую кнопку активной (подсвечиваем)
    buttonElement.classList.add('active');
}