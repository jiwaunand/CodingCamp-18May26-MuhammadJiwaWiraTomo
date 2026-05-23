// --- 1. CLOCK & GREETING ---
function updateClock() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', { hour12: false });
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);

    const hour = now.getHours();
    let greeting = "Good Evening";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    document.getElementById('greeting').textContent = greeting;
}
setInterval(updateClock, 1000);
updateClock();


// --- 2. FOCUS TIMER (25 Menit) ---
let timerInterval;
let timeLeft = 25 * 60; // 25 menit

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').textContent = `${minutes}:${seconds}`;
}

document.getElementById('btn-start').addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Focus session completed! Great job!");
            }
        }, 1000);
    }
});

document.getElementById('btn-stop').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('btn-reset').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});
updateTimerDisplay();


// --- 3. QUICK LINKS (LocalStorage) ---
let links = JSON.parse(localStorage.getItem('quickLinks')) || [];
const linksContainer = document.getElementById('links-container');

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach(link => {
        const badge = document.createElement('div');
        badge.className = 'bg-indigo-500 text-white text-sm px-3 py-1.5 rounded-md flex items-center gap-2';
        badge.innerHTML = `
            <a href="${link.url}" target="_blank" class="hover:underline">${link.name}</a>
            <button data-id="${link.id}" class="delete-link-btn bg-indigo-700 hover:bg-indigo-800 w-4 h-4 rounded-full flex items-center justify-center text-[10px] leading-none transition shrink-0">✕</button>
        `;
        linksContainer.appendChild(badge);
    });
}

document.getElementById('btn-add-link').addEventListener('click', () => {
    const nameInput = document.getElementById('link-name');
    const urlInput = document.getElementById('link-url');
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    
    if (!name || !url) return alert('Mohon isi nama link dan URL-nya.');
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;

    links.push({ id: Date.now().toString(), name, url });
    localStorage.setItem('quickLinks', JSON.stringify(links));
    
    nameInput.value = '';
    urlInput.value = '';
    renderLinks();
});

// Event Listener untuk menghapus link (Event Delegation)
linksContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-link-btn');
    if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        links = links.filter(link => link.id !== id);
        localStorage.setItem('quickLinks', JSON.stringify(links));
        renderLinks();
    }
});
renderLinks();


// --- 4. TASKS (LocalStorage) ---
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const tasksContainer = document.getElementById('tasks-container');
const taskInput = document.getElementById('task-input');

function renderTasks() {
    tasksContainer.innerHTML = '';
    tasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = 'flex items-center justify-between border-b border-gray-50 pb-3';
        taskEl.innerHTML = `
            <label class="flex items-center gap-3 cursor-pointer w-full">
                <input type="checkbox" data-id="${task.id}" class="toggle-task-cb w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" ${task.completed ? 'checked' : ''}>
                <span class="text-gray-700 text-sm ${task.completed ? 'line-through opacity-50' : ''}">${task.text}</span>
            </label>
            <button data-id="${task.id}" class="delete-task-btn bg-red-400 text-white px-3 py-1.5 rounded text-xs hover:bg-red-500 transition shrink-0">Delete</button>
        `;
        tasksContainer.appendChild(taskEl);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now().toString(), text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    renderTasks();
}

document.getElementById('btn-add-task').addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Event Listener untuk tasks (Event Delegation: Hapus & Toggle)
tasksContainer.addEventListener('click', (e) => {
    // Menangani aksi hapus task
    const deleteBtn = e.target.closest('.delete-task-btn');
    if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
});

tasksContainer.addEventListener('change', (e) => {
    // Menangani aksi checklist task
    if (e.target.classList.contains('toggle-task-cb')) {
        const id = e.target.getAttribute('data-id');
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }
});
renderTasks();