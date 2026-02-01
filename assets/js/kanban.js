let currentTask = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadTeamMembers();
    loadKanbanBoard();
    updateNotificationBadge();
    
    document.getElementById('taskForm').addEventListener('submit', saveTask);
});

function loadTeamMembers() {
    const teamList = document.getElementById('teamList');
    const assigneeSelect = document.getElementById('taskAssignee');
    const currentUser = StorageManager.getCurrentUser();
    
    document.getElementById('userInitials').textContent = currentUser.initials;

    sampleData.teamMembers.forEach(member => {
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer';
        div.innerHTML = `
            <div class="w-8 h-8 rounded-full ${member.color} text-white flex items-center justify-center text-xs font-semibold">
                ${member.initials}
            </div>
            <span class="text-sm text-gray-700">${member.name}</span>
        `;
        teamList.appendChild(div);

        const option = document.createElement('option');
        option.value = member.name;
        option.textContent = member.name;
        assigneeSelect.appendChild(option);
    });
}

function loadKanbanBoard() {
    let tasks = StorageManager.getTasks();
    
    if (!tasks || tasks.length === 0) {
        tasks = sampleData.tasks;
        StorageManager.setTasks(tasks);
    }    
    const columns = {
        'To Do': document.getElementById('todoColumn'),
        'In Progress': document.getElementById('progressColumn'),
        'Review': document.getElementById('reviewColumn'),
        'Done': document.getElementById('doneColumn')
    };

    Object.values(columns).forEach(col => col.innerHTML = '');

    const counts = {
        'To Do': 0,
        'In Progress': 0,
        'Review': 0,
        'Done': 0
    };

    tasks.forEach(task => {
        const column = columns[task.status];
        if (column) {
            counts[task.status]++;
            column.appendChild(createTaskCard(task));
        }
    });

    document.getElementById('todoCount').textContent = counts['To Do'];
    document.getElementById('progressCount').textContent = counts['In Progress'];
    document.getElementById('reviewCount').textContent = counts['Review'];
    document.getElementById('doneCount').textContent = counts['Done'];
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md';
    card.onclick = () => openTaskModal(task);

    const priorityClass = getPriorityClass(task.priority);
    const assignee = getTeamMember(task.assignee);
    const isTaskOverdue = isOverdue(task.dueDate) && task.status !== 'Done';

    card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <h4 class="font-semibold text-gray-800 text-sm flex-1">${escapeHtml(task.title)}</h4>
            <span class="px-2 py-1 text-xs rounded-full font-medium ${priorityClass}">
                ${task.priority}
            </span>
        </div>
        
        ${task.description ? `<p class="text-sm text-gray-600 mb-3 line-clamp-2">${escapeHtml(task.description)}</p>` : ''}
        
        ${task.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1 mb-3">
                ${task.tags.map(tag => `<span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">${escapeHtml(tag)}</span>`).join('')}
            </div>
        ` : ''}
        
        <div class="flex items-center justify-between text-xs">
            <div class="flex items-center space-x-2">
                ${assignee ? `
                    <div class="w-6 h-6 rounded-full ${assignee.color} text-white flex items-center justify-center text-xs font-semibold">
                        ${assignee.initials}
                    </div>
                ` : ''}
                ${task.dueDate ? `
                    <span class="flex items-center ${isTaskOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${formatDate(task.dueDate)}
                    </span>
                ` : ''}
            </div>
            ${task.comments.length > 0 ? `
                <span class="text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    ${task.comments.length}
                </span>
            ` : ''}
        </div>
        
        <div class="flex gap-2 mt-3 pt-3 border-t">
            ${task.status !== 'To Do' ? `<button onclick="moveTask(event, '${task.id}', 'To Do')" class="flex-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs">To Do</button>` : ''}
            ${task.status !== 'In Progress' ? `<button onclick="moveTask(event, '${task.id}', 'In Progress')" class="flex-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs">Progress</button>` : ''}
            ${task.status !== 'Review' ? `<button onclick="moveTask(event, '${task.id}', 'Review')" class="flex-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-xs">Review</button>` : ''}
            ${task.status !== 'Done' ? `<button onclick="moveTask(event, '${task.id}', 'Done')" class="flex-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs">Done</button>` : ''}
        </div>
    `;

    return card;
}

function moveTask(event, taskId, newStatus) {
    event.stopPropagation();
    
    const tasks = StorageManager.getTasks() || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        const oldStatus = tasks[taskIndex].status;
        tasks[taskIndex].status = newStatus;
        StorageManager.setTasks(tasks);
        StorageManager.addActivity(`Moved task "${tasks[taskIndex].title}" from ${oldStatus} to ${newStatus}`);
        loadKanbanBoard();
        updateNotificationBadge();
    }
}

function openAddTaskModal() {
    currentTask = null;
    document.getElementById('modalTitle').textContent = 'Add New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('commentsList').innerHTML = '';
    document.getElementById('taskModal').classList.remove('hidden');
}

function openTaskModal(task) {
    currentTask = task;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskAssignee').value = task.assignee;
    document.getElementById('taskDueDate').value = task.dueDate;
    document.getElementById('taskTags').value = task.tags.join(', ');
    
    loadComments(task.comments);
    document.getElementById('taskModal').classList.remove('hidden');
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.add('hidden');
    currentTask = null;
}

function saveTask(e) {
    e.preventDefault();
    
    const tasks = StorageManager.getTasks() || [];
    const taskId = document.getElementById('taskId').value;
    const tagsValue = document.getElementById('taskTags').value;
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        assignee: document.getElementById('taskAssignee').value,
        dueDate: document.getElementById('taskDueDate').value,
        tags: tagsValue ? tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    if (taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...taskData };
            StorageManager.addActivity(`Updated task "${taskData.title}"`);
        }
    } else {
        const newTask = {
            id: generateId(),
            ...taskData,
            comments: [],
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        StorageManager.addActivity(`Created new task "${taskData.title}"`);
    }

    StorageManager.setTasks(tasks);
    closeTaskModal();
    loadKanbanBoard();
    updateNotificationBadge();
}

function loadComments(comments) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    if (!comments || comments.length === 0) {
        commentsList.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">No comments yet</p>';
        return;
    }

    comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'bg-gray-50 rounded-lg p-3';
        div.innerHTML = `
            <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-800">${escapeHtml(comment.user)}</span>
                <span class="text-xs text-gray-500">${comment.time}</span>
            </div>
            <p class="text-sm text-gray-700">${escapeHtml(comment.text)}</p>
        `;
        commentsList.appendChild(div);
    });
}

function addComment() {
    const commentInput = document.getElementById('newComment');
    const commentText = commentInput.value.trim();
    
    if (!commentText) return;
    
    const tasks = StorageManager.getTasks() || [];
    const taskId = document.getElementById('taskId').value;
    
    if (!taskId) {
        alert('Please save the task first before adding comments');
        return;
    }
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        const currentUser = StorageManager.getCurrentUser();
        const now = new Date();
        const time = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        if (!tasks[taskIndex].comments) {
            tasks[taskIndex].comments = [];
        }
        
        tasks[taskIndex].comments.push({
            text: commentText,
            user: currentUser.name,
            time: time
        });
        
        StorageManager.setTasks(tasks);
        StorageManager.addActivity(`Added comment to task "${tasks[taskIndex].title}"`);
        
        loadComments(tasks[taskIndex].comments);
        commentInput.value = '';
    }
}