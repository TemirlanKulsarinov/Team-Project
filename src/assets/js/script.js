// Переключение главной секции
function showResumeSection() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('resumeWrapper').classList.add('active-section');
}

// Переключение вкладок
function switchTab(tabId, buttonElement) {
    document.querySelectorAll('.resume-section').forEach(section => {
        section.classList.remove('active-tab');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active-tab');
    buttonElement.classList.add('active');
}

// TASK 1: Управление элементами
function addText() {
    if (!document.getElementById('bottomLeftText')) {
        const newDiv = document.createElement('div');
        newDiv.id = 'bottomLeftText';
        newDiv.innerText = 'Привет мир!';
        newDiv.style.position = 'fixed';
        newDiv.style.bottom = '20px';
        newDiv.style.left = '20px';
        newDiv.style.color = '#4b5563';
        document.body.appendChild(newDiv);
    }
}

function changeText() {
    const target = document.getElementById('bottomLeftText');
    if (target) {
        target.innerText = 'Это новый элемент';
        target.style.fontWeight = 'bold';
    }
}

function deleteText() {
    const target = document.getElementById('bottomLeftText');
    if (target) target.remove();
}

function createParagraph() {
    const container = document.getElementById('paragraphContainer');
    container.innerHTML = '';
    const p = document.createElement('p');
    p.innerText = 'Это изменяемый абзац.';
    p.style.cursor = 'pointer';
    p.style.padding = '12px 24px';
    p.style.border = '1px solid #e5e7eb';
    p.style.borderRadius = '8px';

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

// TASK 2: Управление классами
function toggleClassAndShow() {
    const targetElement = document.getElementById('task2Target');
    const outputParagraph = document.getElementById('classListOutput');
    targetElement.classList.toggle('active');
    outputParagraph.innerText = "Классы элемента: " + targetElement.className;
}

// TASK 3: Таблица
function handleGenerateTable() {
    const rows = parseInt(document.getElementById('rowsInput').value, 10);
    const cols = parseInt(document.getElementById('colsInput').value, 10);
    const container = document.getElementById('tableContainer');

    if (!rows || !cols) return;
    container.innerHTML = '';

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

function handleCountColor() {
    const color = document.getElementById('paintColor').value.toLowerCase();
    const cells = document.querySelectorAll('#tableContainer td');
    let count = 0;
    cells.forEach(td => { if (td.dataset.color === color) count++; });
    document.getElementById('tableResult').innerText = `Закрашено ячеек: ${count}`;
}

// TASK 4: Тёмная тема
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// TASK 5: CRUD (Threads) через dummyjson.com
const API_URL = 'https://dummyjson.com/posts';
const POSTS_LIMIT = 10;
let currentActivePost = null;
let localPostCounter = 0;

// Единая обёртка над fetch: бросает ошибку, если сервер ответил не 2xx
async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`);
        err.status = response.status;
        throw err;
    }
    return response.json();
}

// Всплывающее уведомление внизу экрана
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

function setStatus(message, type = '') {
    const el = document.getElementById('threadsStatus');
    el.className = 'threads-status' + (type ? ' ' + type : '');
    el.textContent = message;
    el.style.display = message ? 'block' : 'none';
}

function updateEmptyState() {
    const hasCards = document.querySelectorAll('#threadsContainer .thread-card').length > 0;
    document.getElementById('emptyPostsPlaceholder').style.display = hasCards ? 'none' : 'block';
}

// READ: GET /posts?limit=10
async function loadPosts() {
    document.querySelectorAll('#threadsContainer .thread-card').forEach(card => card.remove());
    document.getElementById('emptyPostsPlaceholder').style.display = 'none';
    setStatus('Загрузка постов...');

    try {
        const data = await apiRequest(`${API_URL}?limit=${POSTS_LIMIT}`);
        data.posts.forEach(post => renderThreadPost(post));
        setStatus('');
        updateEmptyState();
    } catch (e) {
        console.error(e);
        setStatus('Не удалось загрузить посты. ', 'error');
        const retryBtn = document.createElement('button');
        retryBtn.type = 'button';
        retryBtn.className = 'threads-retry-btn';
        retryBtn.textContent = 'Повторить';
        retryBtn.addEventListener('click', loadPosts);
        document.getElementById('threadsStatus').appendChild(retryBtn);
    }
}

function openCreateModal() { document.getElementById('createModal').classList.add('open'); }
function closeCreateModal() {
    document.getElementById('createModal').classList.remove('open');
    document.getElementById('createPostForm').reset();
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('open');
    currentActivePost = null;
}

// CREATE: POST /posts/add
async function handleCreatePost(event) {
    event.preventDefault();
    const userId = Number(document.getElementById('postUserSelect').value);
    const titleText = document.getElementById('postTitleInput').value.trim();
    const bodyText = document.getElementById('postBodyInput').value.trim();
    if (!titleText || !bodyText) return;

    const submitBtn = document.getElementById('submitCreateBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Загрузка...';

    try {
        const created = await apiRequest(`${API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: titleText, body: bodyText, userId: userId })
        });
        // dummyjson не сохраняет данные, поэтому такой пост существует только до перезагрузки
        renderThreadPost({
            id: created.id,
            title: created.title ?? titleText,
            body: created.body ?? bodyText,
            userId: created.userId ?? userId
        }, true, true);
        updateEmptyState();
        closeCreateModal();
        showToast('Пост опубликован');
    } catch (e) {
        console.error(e);
        showToast('Не удалось создать пост', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Опубликовать';
    }
}

function renderThreadPost(post, prepend = false, isLocal = false) {
    const container = document.getElementById('threadsContainer');
    localPostCounter++;

    // reactions в dummyjson — объект { likes, dislikes } (в старых версиях — число)
    const initialLikes = (post.reactions && typeof post.reactions === 'object')
        ? post.reactions.likes
        : (post.reactions || 0);

    const postCard = document.createElement('div');
    postCard.className = 'thread-card';
    // DOM-id уникален всегда, а настоящий id с сервера лежит в data-id
    // (POST /add каждый раз возвращает один и тот же id, поэтому его нельзя использовать как DOM-id)
    postCard.id = `post-local-${localPostCounter}`;
    postCard.dataset.id = post.id;
    postCard.dataset.local = isLocal ? 'true' : 'false';
    postCard.dataset.userId = post.userId;
    postCard.dataset.title = post.title || '';
    postCard.dataset.body = post.body;
    postCard.dataset.likes = initialLikes;
    postCard.dataset.reposts = 0;

    const avatarUrl = post.userId == 2
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=User2'
        : 'https://api.dicebear.com/7.x/bottts/svg?seed=User1';

    postCard.innerHTML = `
        <img src="${avatarUrl}" class="thread-avatar" alt="">
        <div class="thread-content">
            <div class="thread-header-info">
                <span class="thread-author"></span>
            </div>
            <h3 class="thread-title"></h3>
            <p class="thread-text"></p>
            <div class="thread-actions">
                <button type="button" class="action-btn like-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span class="like-count"></span>
                </button>
                <button type="button" class="action-btn repost-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                    <span class="repost-count">0</span>
                </button>
            </div>
        </div>
    `;

    // textContent вместо innerHTML — защита от XSS
    postCard.querySelector('.thread-author').textContent = `UserId ${post.userId}`;
    postCard.querySelector('.thread-title').textContent = post.title || '';
    postCard.querySelector('.thread-text').textContent = post.body;
    postCard.querySelector('.like-count').textContent = initialLikes;

    postCard.querySelector('.like-btn').addEventListener('click', (e) => toggleLike(e, postCard));
    postCard.querySelector('.repost-btn').addEventListener('click', (e) => toggleRepost(e, postCard));
    postCard.addEventListener('click', (e) => {
        if (!e.target.closest('.action-btn')) openViewModal(postCard);
    });

    if (prepend) {
        container.insertBefore(postCard, container.querySelector('.thread-card'));
    } else {
        container.appendChild(postCard);
    }
}

function toggleLike(e, card) {
    e.stopPropagation();
    const btn = card.querySelector('.like-btn');
    let likes = parseInt(card.dataset.likes, 10);
    if (btn.classList.toggle('liked')) {
        likes++;
    } else {
        likes--;
    }
    card.dataset.likes = likes;
    card.querySelector('.like-count').innerText = likes;
}

function toggleRepost(e, card) {
    e.stopPropagation();
    const btn = card.querySelector('.repost-btn');
    let reposts = parseInt(card.dataset.reposts, 10);
    if (btn.classList.toggle('reposted')) {
        reposts++;
    } else {
        reposts--;
    }
    card.dataset.reposts = reposts;
    card.querySelector('.repost-count').innerText = reposts;
}

function openViewModal(card) {
    currentActivePost = card;
    document.getElementById('viewAuthorText').innerText = `UserId ${card.dataset.userId}`;
    document.getElementById('viewTitleInput').value = card.dataset.title;
    document.getElementById('viewBodyInput').value = card.dataset.body;
    document.getElementById('viewModal').classList.add('open');
}

// UPDATE: PUT /posts/{id}
async function handleUpdatePost() {
    const newTitle = document.getElementById('viewTitleInput').value.trim();
    const newBody = document.getElementById('viewBodyInput').value.trim();
    if (!newTitle || !newBody || !currentActivePost) return;

    const card = currentActivePost;
    const isLocal = card.dataset.local === 'true';
    const saveBtn = document.getElementById('saveEditBtn');
    saveBtn.disabled = true;
    saveBtn.innerText = 'Сохранение...';

    try {
        const updated = await apiRequest(`${API_URL}/${card.dataset.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, body: newBody })
        });
        card.dataset.title = updated.title ?? newTitle;
        card.dataset.body = updated.body ?? newBody;
    } catch (e) {
        // Пост, созданный через /add, на сервере не хранится, поэтому PUT вернёт 404 — это ожидаемо
        if (isLocal && e.status === 404) {
            card.dataset.title = newTitle;
            card.dataset.body = newBody;
        } else {
            console.error(e);
            showToast('Не удалось сохранить изменения', 'error');
            saveBtn.disabled = false;
            saveBtn.innerText = 'Сохранить изменения';
            return;
        }
    }

    card.querySelector('.thread-title').textContent = card.dataset.title;
    card.querySelector('.thread-text').textContent = card.dataset.body;
    saveBtn.disabled = false;
    saveBtn.innerText = 'Сохранить изменения';
    closeViewModal();
    showToast('Пост обновлён');
}

// DELETE: DELETE /posts/{id}
async function handleDeletePost() {
    if (!currentActivePost) return;

    const card = currentActivePost;
    const isLocal = card.dataset.local === 'true';
    const deleteBtn = document.getElementById('deletePostBtn');
    deleteBtn.disabled = true;
    deleteBtn.innerText = 'Удаление...';

    try {
        await apiRequest(`${API_URL}/${card.dataset.id}`, { method: 'DELETE' });
    } catch (e) {
        if (!(isLocal && e.status === 404)) {
            console.error(e);
            showToast('Не удалось удалить пост', 'error');
            deleteBtn.disabled = false;
            deleteBtn.innerText = 'Удалить ветку';
            return;
        }
    }

    card.remove();
    closeViewModal();
    deleteBtn.disabled = false;
    deleteBtn.innerText = 'Удалить ветку';
    updateEmptyState();
    showToast('Пост удалён');
}

// Загружаем посты с сервера при открытии страницы
document.addEventListener('DOMContentLoaded', loadPosts);