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

    targetElement.classList.toggle('active');

    const currentClasses = targetElement.className;

    console.log("Текущие классы элемента:", currentClasses);

    outputParagraph.innerText = "Классы элемента: " + currentClasses;
}

// ==========================================
// ЛАБОРАТОРНАЯ РАБОТА: TASK 3 (ТАБЛИЦА)
// ==========================================

function generateTable(rows, cols) {
    const container = document.getElementById('tableContainer');
    container.innerHTML = '';
    document.getElementById('tableResult').innerText = '';

    const table = document.createElement('table');

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            td.addEventListener('click', function () {
                const color = document.getElementById('paintColor').value;
                this.style.backgroundColor = color;
                this.dataset.color = color.toLowerCase();
            });
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    container.appendChild(table);
}

function countCellsByColor(color) {
    const cells = document.querySelectorAll('#tableContainer td');
    let count = 0;
    cells.forEach(td => {
        if (td.dataset.color === color.toLowerCase()) count++;
    });
    return count;
}

function handleGenerateTable() {
    const rows = parseInt(document.getElementById('rowsInput').value, 10);
    const cols = parseInt(document.getElementById('colsInput').value, 10);

    if (!rows || !cols || rows < 1 || cols < 1 || rows > 30 || cols > 30) {
        alert('Введите число строк и столбцов от 1 до 30');
        return;
    }
    generateTable(rows, cols);
}

function handleCountColor() {
    if (!document.querySelector('#tableContainer td')) {
        alert('Сначала создайте таблицу');
        return;
    }
    const color = document.getElementById('paintColor').value;
    const n = countCellsByColor(color);
    document.getElementById('tableResult').innerText = `Ячеек цвета ${color}: ${n}`;
}

// ==========================================
// ЛАБОРАТОРНАЯ РАБОТА: TASK 4 (ТЁМНАЯ ТЕМА)
// ==========================================

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = theme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// При загрузке: сохранённая тема, а если её нет, то системная
(function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (!saved) {
        saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(saved);
})();