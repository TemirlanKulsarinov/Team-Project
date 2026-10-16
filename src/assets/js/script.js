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

    // Автоматическая загрузка постов при открытии Task 5
    if (tabId === 'task5' && globalPosts.length === 0) {
        initThreadsFeed();
    }
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

// ==========================================
// TASK 5: GLOBAL STATE & API (Threads)
// ==========================================
const API_URL = 'https://dummyjson.com';
let globalPosts = [];
let usersCache = {}; 
let currentActivePostId = null;
let currentProfileUserId = null;

// --- Динамический сбор тегов ---
function updateTagDropdowns() {
    const allTags = new Set();
    globalPosts.forEach(post => {
        if (post.tags) post.tags.forEach(t => allTags.add(t));
    });
    
    const tagOptions = '<option value="all">Все теги</option>' + 
                       Array.from(allTags).map(t => `<option value="${t}">#${t}</option>`).join('');
    
    const mainFilter = document.getElementById('mainFeedFilter');
    const profileFilter = document.getElementById('profileFeedFilter');
    
    if (mainFilter) {
        const currentVal = mainFilter.value;
        mainFilter.innerHTML = tagOptions;
        if(allTags.has(currentVal)) mainFilter.value = currentVal;
    }
    
    if (profileFilter) {
        const currentVal = profileFilter.value;
        profileFilter.innerHTML = tagOptions;
        if(allTags.has(currentVal)) profileFilter.value = currentVal;
    }
}

// --- API Фетчинг Главной Ленты ---
async function initThreadsFeed() {
    const container = document.getElementById('threadsContainer');
    container.innerHTML = '<p style="text-align: center; color: var(--muted);">Загрузка ленты...</p>';
    try {
        const res = await fetch(`${API_URL}/posts?limit=10`); 
        const data = await res.json();
        globalPosts = data.posts.map(p => ({
            ...p,
            likes: p.reactions?.likes || 0,
            reposts: p.reactions?.reposts || 0
        }));
        
        updateTagDropdowns();
        await renderMainFeed();
    } catch (e) {
        container.innerHTML = '<p style="color: red;">Ошибка сети</p>';
    }
}

async function getUserInfo(userId) {
    if (usersCache[userId]) return usersCache[userId];
    try {
        const res = await fetch(`${API_URL}/users/${userId}`);
        const user = await res.json();
        usersCache[userId] = user;
        return user;
    } catch (e) {
        return { 
            id: userId, username: `user_${userId}`, 
            image: 'https://api.dicebear.com/7.x/bottts/svg?seed='+userId, 
            firstName: 'Unknown', lastName: '', birthDate: 'N/A', 
            company: {title: 'No Bio'}, address: {city: 'Unknown'} 
        };
    }
}

// --- Комбинированная Фильтрация и Сортировка ---
function sortAndFilterPosts(postsArray, filterTag, sortType) {
    let result = [...postsArray];
    
    if (filterTag && filterTag !== 'all') {
        result = result.filter(p => p.tags && p.tags.includes(filterTag));
    } 
    
    if (sortType === 'title-asc') {
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'title-desc') {
        result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortType === 'newest') {
        result.sort((a, b) => b.id - a.id); 
    }
    
    return result;
}

// --- Рендер ленты ---
async function renderMainFeed() {
    const container = document.getElementById('threadsContainer');
    const filterVal = document.getElementById('mainFeedFilter').value;
    const sortVal = document.getElementById('mainFeedSort').value;
    
    const postsToRender = sortAndFilterPosts(globalPosts, filterVal, sortVal);
    
    container.innerHTML = '';
    if (postsToRender.length === 0) {
        container.innerHTML = '<div class="threads-empty">Постов по заданным критериям не найдено.</div>';
        return;
    }

    for (const post of postsToRender) {
        const user = await getUserInfo(post.userId);
        container.appendChild(createPostHTML(post, user));
    }
}

function createPostHTML(post, user) {
    const postCard = document.createElement('div');
    postCard.className = 'thread-card';
    postCard.id = `post-${post.id}`;
    
    const tagsHtml = post.tags ? post.tags.map(t => `<span class="thread-tag">#${t}</span>`).join(' ') : '';

    postCard.innerHTML = `
        <img src="${user.image}" class="thread-avatar" onclick="openUserProfile(${user.id}, event)" title="Открыть профиль">
        <div class="thread-content">
            <div class="thread-header-info">
                <span class="thread-author" onclick="openUserProfile(${user.id}, event)">@${user.username}</span>
            </div>
            <h4 style="margin: 0 0 6px; font-size: 1rem; color: var(--ink);">${post.title}</h4>
            <p class="thread-text">${post.body}</p>
            <div style="margin-bottom: 10px;">${tagsHtml}</div>
            <div class="thread-actions">
                <button class="action-btn like-btn" onclick="toggleLike(event, ${post.id})">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span class="like-count">${post.likes}</span>
                </button>
                <button class="action-btn repost-btn" onclick="toggleRepost(event, ${post.id})">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                    <span class="repost-count">${post.reposts}</span>
                </button>
            </div>
        </div>
    `;

    postCard.addEventListener('click', (e) => {
        if (!e.target.closest('.action-btn') && !e.target.closest('.thread-avatar') && !e.target.closest('.thread-author')) {
            openViewModal(post.id);
        }
    });

    return postCard;
}

// --- Интерактив ---
function toggleLike(e, id) {
    e.stopPropagation();
    const post = globalPosts.find(p => p.id === id);
    const btn = e.currentTarget;
    if (btn.classList.toggle('liked')) post.likes++; else post.likes--;
    btn.querySelector('.like-count').innerText = post.likes;
}

function toggleRepost(e, id) {
    e.stopPropagation();
    const post = globalPosts.find(p => p.id === id);
    const btn = e.currentTarget;
    if (btn.classList.toggle('reposted')) post.reposts++; else post.reposts--;
    btn.querySelector('.repost-count').innerText = post.reposts;
}

// --- Модалки: Профиль Пользователя ---
async function openUserProfile(userId, event) {
    if(event) event.stopPropagation();
    
    currentProfileUserId = userId;
    document.getElementById('profileModal').classList.add('open');
    const profileLeft = document.getElementById('profileLeftContent');
    
    profileLeft.innerHTML = '<p>Загрузка данных...</p>';

    const user = await getUserInfo(userId);
    
    const bio = user.company?.title ? `${user.company.title} at ${user.company.name}` : 'Студент / Разработчик';
    const location = user.address?.city ? user.address.city : 'Не указан';
    const education = user.university ? user.university : 'Самоучка';
    
    profileLeft.innerHTML = `
        <img src="${user.image}" class="profile-big-avatar" alt="avatar">
        <h3 style="margin: 10px 0 4px;">${user.firstName} ${user.lastName}</h3>
        <p style="color: var(--accent); font-weight: bold; margin: 0 0 5px;">@${user.username}</p>
        <p style="color: var(--muted); font-size: 0.85rem; margin: 0 0 15px;">📍 г. ${location}</p>
        
        <div style="font-size: 0.9rem; color: var(--ink); text-align: left; background: var(--card); padding: 12px; border-radius: 8px; border: 1px solid var(--rule);">
            <div style="margin-bottom: 8px;">🎓 <strong>Образование:</strong><br><span style="color:var(--muted)">${education}</span></div>
            <div style="margin-bottom: 8px;">💼 <strong>Работа:</strong><br><span style="color:var(--muted)">${bio}</span></div>
            <div>🎂 <strong>День рождения:</strong><br><span style="color:var(--muted)">${user.birthDate || 'Скрыто'}</span></div>
        </div>
    `;

    renderProfilePosts(userId);
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('open');
    currentProfileUserId = null;
}

async function renderProfilePosts(userId) {
    const container = document.getElementById('profileFeedContainer');
    const filterVal = document.getElementById('profileFeedFilter').value;
    const sortVal = document.getElementById('profileFeedSort').value;
    
    // Показываем загрузку, если контейнер пуст
    if (!container.querySelector('.thread-card')) {
        container.innerHTML = '<p style="color: var(--muted); text-align:center; padding: 20px;">Загрузка постов по API...</p>';
    }

    try {
        // === ИСПРАВЛЕНИЕ ДЛЯ ПРЕПОДАВАТЕЛЯ (Запрос к API DummyJSON) ===
        const res = await fetch(`${API_URL}/posts/user/${userId}`);
        const data = await res.json();
        
        // Сливаем полученные из API посты с глобальным массивом, 
        // чтобы сохранить локально созданные посты и не потерять их!
        data.posts.forEach(apiPost => {
            const existingIndex = globalPosts.findIndex(p => p.id === apiPost.id);
            if (existingIndex === -1) {
                globalPosts.push({
                    ...apiPost,
                    likes: apiPost.reactions?.likes || 0,
                    reposts: apiPost.reactions?.reposts || 0
                });
            }
        });
        updateTagDropdowns(); // Обновляем теги после подгрузки API-постов
    } catch (e) {
        console.error('Ошибка API при загрузке постов пользователя:', e);
    }

    // Теперь берем обновленный массив (включая старые и только что созданные посты)
    const userPosts = globalPosts.filter(p => p.userId === userId);
    const postsToRender = sortAndFilterPosts(userPosts, filterVal, sortVal);

    container.innerHTML = '';
    if (postsToRender.length === 0) {
        container.innerHTML = '<p style="color: var(--muted); text-align:center; padding: 20px;">Постов не найдено.</p>';
        return;
    }

    const user = await getUserInfo(userId);
    postsToRender.forEach(post => {
        container.appendChild(createPostHTML(post, user));
    });
}

// Слушатели для фильтров в профиле
function handleProfileFilterChange() {
    if (currentProfileUserId) renderProfilePosts(currentProfileUserId);
}
document.getElementById('profileFeedFilter').addEventListener('change', handleProfileFilterChange);
document.getElementById('profileFeedSort').addEventListener('change', handleProfileFilterChange);

// --- Модалки: CRUD (Create, Update, Delete) ---
function openCreateModal(prefillUserId = null) { 
    document.getElementById('createModal').classList.add('open'); 
    
    if (prefillUserId) {
        const select = document.getElementById('postUserSelect');
        if (!Array.from(select.options).some(opt => opt.value == prefillUserId)) {
            const newOption = new Option(`User ${prefillUserId}`, prefillUserId);
            select.add(newOption);
        }
        select.value = prefillUserId;
    }
}

function closeCreateModal() { 
    document.getElementById('createModal').classList.remove('open'); 
    document.getElementById('createPostForm').reset(); 
}

async function handleCreatePost(event) {
    event.preventDefault();
    const userId = parseInt(document.getElementById('postUserSelect').value, 10);
    const titleText = document.getElementById('postTitleInput').value.trim();
    const bodyText = document.getElementById('postBodyInput').value.trim();
    const submitBtn = document.getElementById('submitCreateBtn');

    submitBtn.innerText = 'Публикация...';
    try {
        const res = await fetch(`${API_URL}/posts/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: titleText, body: bodyText, userId: userId })
        });
        const newPost = await res.json();
        newPost.id = Date.now(); 
        newPost.tags = ['new'];
        newPost.likes = 0;
        newPost.reposts = 0;
        
        globalPosts.unshift(newPost);
        updateTagDropdowns(); 
        
        renderMainFeed();
        if (currentProfileUserId === userId) renderProfilePosts(userId);
        
        closeCreateModal();
    } catch (e) {
        console.error(e);
    } finally {
        submitBtn.innerText = 'Опубликовать';
    }
}

async function openViewModal(postId) {
    currentActivePostId = postId;
    const post = globalPosts.find(p => p.id === postId);
    const user = await getUserInfo(post.userId);

    document.getElementById('viewAuthorText').innerText = `@${user.username}`;
    document.getElementById('viewTitleInput').value = post.title;
    document.getElementById('viewBodyInput').value = post.body;
    document.getElementById('viewModal').classList.add('open');
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('open');
    currentActivePostId = null;
}

async function handleUpdatePost() {
    const newTitle = document.getElementById('viewTitleInput').value.trim();
    const newBody = document.getElementById('viewBodyInput').value.trim();
    if (!newTitle || !newBody || !currentActivePostId) return;

    const btn = document.getElementById('saveEditBtn');
    btn.innerText = 'Сохранение...';
    try {
        await fetch(`${API_URL}/posts/${currentActivePostId}`, { method: 'PUT' });
    } catch(e) {}
    
    const postIndex = globalPosts.findIndex(p => p.id === currentActivePostId);
    globalPosts[postIndex].title = newTitle;
    globalPosts[postIndex].body = newBody;
    
    renderMainFeed();
    if (currentProfileUserId) renderProfilePosts(currentProfileUserId); 
    
    closeViewModal();
    btn.innerText = 'Сохранить';
}

async function handleDeletePost() {
    if (!currentActivePostId) return;
    const btn = document.getElementById('deletePostBtn');
    btn.innerText = 'Удаление...';
    
    try {
        await fetch(`${API_URL}/posts/${currentActivePostId}`, { method: 'DELETE' });
    } catch(e) {}
    
    globalPosts = globalPosts.filter(p => p.id !== currentActivePostId);
    
    renderMainFeed();
    if (currentProfileUserId) renderProfilePosts(currentProfileUserId);
    
    closeViewModal();
    btn.innerText = 'Удалить ветку';
}