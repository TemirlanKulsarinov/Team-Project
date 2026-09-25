// Функция открытия раздела с резюме с главного экрана
function showResumeSection() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('resumeWrapper').classList.add('active-section');
}

// Функция переключения между вкладками
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

// ==========================================
// ЛАБОРАТОРНАЯ РАБОТА: TASK 1
// ==========================================

function addText() {
    if (!document.getElementById('bottomLeftText')) {
        const newDiv = document.createElement('div');
        newDiv.id = 'bottomLeftText';
        newDiv.innerText = 'Привет мир!';
        newDiv.style.position = 'fixed';
        newDiv.style.bottom = '20px';
        newDiv.style.left = '20px';
        newDiv.style.color = '#4b5563';
        newDiv.style.fontSize = '14px';
        newDiv.style.transition = 'all 0.3s ease';

        document.body.appendChild(newDiv);
    }
}

function changeText() {
    const target = document.getElementById('bottomLeftText');
    if (target) {
        target.innerText = 'Это новый элемент';
        target.style.color = '#111827';
        target.style.fontWeight = 'bold';
    }
}

function deleteText() {
    const target = document.getElementById('bottomLeftText');
    if (target) {
        target.remove();
    }
}

function createParagraph() {
    const container = document.getElementById('paragraphContainer');
    container.innerHTML = '';

    const p = document.createElement('p');
    p.innerText = 'Это изменяемый абзац.';
    p.style.cursor = 'pointer';
    p.style.padding = '12px 24px';
    p.style.background = '#f3f4f6';
    p.style.border = '1px solid #e5e7eb';
    p.style.borderRadius = '8px';
    p.style.display = 'inline-block';
    p.style.transition = 'all 0.2s ease';

    let isChanged = false;

    p.addEventListener('click', function () {
        if (!isChanged) {
            this.style.color = '#2563eb';
            this.style.fontSize = '22px';
            isChanged = true;
        } else {
            this.style.color = '';
            this.style.fontSize = '';
            isChanged = false;
        }
    });

    container.appendChild(p);
}

// ==========================================
// ЛАБОРАТОРНАЯ РАБОТА: TASK 2
// ==========================================

function toggleClassAndShow() {
    const targetElement = document.getElementById('task2Target');
    const outputParagraph = document.getElementById('classListOutput');

    // 1. Метод toggle добавляет класс 'active', если его нет, и удаляет, если он есть
    targetElement.classList.toggle('active');

    // Получаем список всех классов элемента в виде строки
    const currentClasses = targetElement.className;

    // 2. Выводим список классов в консоль браузера (F12 -> Консоль)
    console.log("Текущие классы элемента:", currentClasses);

    // 3. Выводим список классов в отдельный тег <p> на странице
    outputParagraph.innerText = "Классы элемента: " + currentClasses;
}