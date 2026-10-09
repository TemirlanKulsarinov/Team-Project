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

    // Автоматическая загрузка данных при открытии Task 5 (Read)
    if (tabId === 'task5') {
        fetchPosts();
    }
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
    try { localStorage.setItem('theme', theme); } catch (e) { }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

(function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) { }
    if (!saved) {
        saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(saved);
})();

// ==========================================
// ЛАБОРАТОРНАЯ РАБОТА: TASK 5 (CRUD СИСТЕМА)
// ==========================================
const API_URL = 'https://dummyjson.com/posts';
let isPostsLoaded = false;

// READ (Чтение - GET)
async function fetchPosts() {
    if (isPostsLoaded) return; // Защита от повторной загрузки

    const container = document.getElementById('postsContainer');
    container.innerHTML = '<p style="color: #6b7280; text-align: center;">Загрузка данных с сервера...</p>';

    try {
        // Получаем 3 поста, чтобы не перегружать страницу
        const response = await fetch(`${API_URL}?limit=3`);
        const data = await response.json();

        container.innerHTML = '';
        data.posts.forEach(post => renderPost(post));
        isPostsLoaded = true;
    } catch (error) {
        container.innerHTML = `<p style="color: red;">Ошибка загрузки: ${error.message}</p>`;
    }
}

// CREATE (Создание - POST)
async function createPost(event) {
    event.preventDefault(); // Останавливаем перезагрузку страницы
    const title = document.getElementById('postTitle').value;
    const body = document.getElementById('postBody').value;
    const submitBtn = event.target.querySelector('button');

    submitBtn.innerText = 'Создание...';

    try {
        const response = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        const newPost = await response.json();
        // Генерируем уникальный ID для фронтенда, так как Fake API часто возвращает одинаковый ID
        newPost.id = Date.now();

        renderPost(newPost, true); // Добавляем пост в начало списка
        event.target.reset(); // Очищаем форму
        alert('Пост успешно создан на сервере!');
    } catch (error) {
        alert('Ошибка при создании: ' + error.message);
    } finally {
        submitBtn.innerText = 'Добавить пост (Create)';
    }
}

// UPDATE (Обновление - PUT)
async function editPost(id) {
    const postCard = document.getElementById(`post-${id}`);
    const currentTitle = postCard.querySelector('h3').innerText;
    const currentBody = postCard.querySelector('p').innerText;

    const newTitle = prompt('Отредактируйте заголовок:', currentTitle);
    const newBody = prompt('Отредактируйте текст:', currentBody);

    // Если пользователь не нажал Отмена и ввел новые данные
    if (newTitle && newBody && (newTitle !== currentTitle || newBody !== currentBody)) {
        try {
            // Отправляем PUT запрос
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTitle,
                    body: newBody,
                })
            });

            // Локально обновляем DOM (интерфейс)
            postCard.querySelector('h3').innerText = newTitle;
            postCard.querySelector('p').innerText = newBody;
            alert('Пост успешно обновлен!');
        } catch (error) {
            alert('Ошибка сервера, но интерфейс обновлен (Fake API специфика).');
        }
    }
}

// DELETE (Удаление - DELETE)
async function deletePost(id) {
    if (confirm('Вы точно хотите удалить этот пост?')) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            // Удаляем карточку со страницы
            document.getElementById(`post-${id}`).remove();
            alert('Пост успешно удален!');
        } catch (error) {
            alert('Ошибка при удалении: ' + error.message);
        }
    }
}

// Вспомогательная функция для отрисовки карточки поста
function renderPost(post, prepend = false) {
    const container = document.getElementById('postsContainer');

    const postEl = document.createElement('div');
    postEl.id = `post-${post.id}`;
    // Используем инлайн стили, чтобы избежать правок в CSS файле
    postEl.style.cssText = 'border: 1px solid #d1d5db; padding: 20px; border-radius: 8px; text-align: left; background: var(--card, #fff); box-shadow: 0 2px 5px rgba(0,0,0,0.05);';

    postEl.innerHTML = `
        <h3 style="margin: 0 0 10px; font-size: 1.2rem;">${post.title}</h3>
        <p style="margin: 0 0 15px; font-size: 0.95rem; color: var(--muted);">${post.body}</p>
        <div style="display: flex; gap: 10px;">
            <button class="lab-btn" onclick="editPost(${post.id})" style="border-color: #f59e0b; color: #f59e0b; background: transparent;">Редактировать</button>
            <button class="lab-btn" onclick="deletePost(${post.id})" style="border-color: #ef4444; color: #ef4444; background: transparent;">Удалить</button>
        </div>
    `;

    // Если prepend=true, вставляем наверх (используется при создании)
    if (prepend) {
        container.prepend(postEl);
    } else {
        container.appendChild(postEl);
    }
}