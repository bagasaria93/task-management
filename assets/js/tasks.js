let currentPage = 1;
let tasksPerPage = 10;
let filteredTasks = [];
let selectedTasks = [];
let sortColumn = 'createdAt';
let sortDirection = 'desc';

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadTeamMembers();
    loadFilterOptions();
    loadTasks();
    updateNotificationBadge();
    
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterPriority').addEventListener('change', applyFilters);
    document.getElementById('filterAssignee').addEventListener('change', applyFilters);
    document.getElementById('taskForm').addEventListener('submit', saveTask);
});

function loadTeamMembers() {
    const teamList = document.getElementById('teamList');
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
    });
}

function loadFilterOptions() {
    const assigneeSelect = document.getElementById('filterAssignee');
    const taskAssigneeSelect = document.getElementById('taskAssignee');
    
    sampleData.teamMembers.forEach(member => {
        const option1 = document.createElement('option');
        option1.value = member.name;
        option1.textContent = member.name;
        assigneeSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = member.name;
        option2.textContent = member.name;
        taskAssigneeSelect.appendChild(option2);
    });
}

function loadTasks() {
    let tasks = StorageManager.getTasks();
    
    if (!tasks || tasks.length === 0) {
        tasks = sampleData.tasks;
        StorageManager.setTasks(tasks);
    }
    
    applyFilters();
}

function applyFilters() {
    const tasks = StorageManager.getTasks() || [];
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const assigneeFilter = document.getElementById('filterAssignee').value;

    filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm) || 
                            task.description.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || task.status === statusFilter;
        const matchesPriority = !priorityFilter || task.priority === priorityFilter;
        const matchesAssignee = !assigneeFilter || task.assignee === assigneeFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });

    sortTasks(sortColumn, false);
    currentPage = 1;
    renderTable();
}

function sortTasks(column, toggleDirection = true) {
    if (toggleDirection && column === sortColumn) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else if (toggleDirection) {
        sortColumn = column;
        sortDirection = 'asc';
    }

    filteredTasks.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        if (column === 'dueDate') {
            valA = valA ? new Date(valA) : new Date(0);
            valB = valB ? new Date(valB) : new Date(0);
        } else if (column === 'priority') {
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            valA = priorityOrder[valA] || 0;
            valB = priorityOrder[valB] || 0;
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
            return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
    });

    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('tasksTableBody');
    tbody.innerHTML = '';

    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    paginatedTasks.forEach(task => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        
        const assignee = getTeamMember(task.assignee);
        const isTaskOverdue = isOverdue(task.dueDate) && task.status !== 'Done';
        const priorityClass = getPriorityClass(task.priority);
        const statusClass = getStatusClass(task.status);

        tr.innerHTML = `
            <td class="px-6 py-4">
                <input type="checkbox" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary task-checkbox" data-task-id="${task.id}">
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="text-sm text-gray-500 truncate max-w-md">${escapeHtml(task.description)}</div>` : ''}
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 text-xs rounded-full font-medium ${priorityClass}">
                    ${task.priority}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="status-badge ${statusClass}">
                    ${task.status}
                </span>
            </td>
            <td class="px-6 py-4">
                ${assignee ? `
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-full ${assignee.color} text-white flex items-center justify-center text-xs font-semibold">
                            ${assignee.initials}
                        </div>
                        <span class="text-sm text-gray-700">${assignee.name}</span>
                    </div>
                ` : '<span class="text-sm text-gray-500">Unassigned</span>'}
            </td>
            <td class="px-6 py-4">
                ${task.dueDate ? `
                    <span class="text-sm ${isTaskOverdue ? 'text-red-600 font-semibold' : 'text-gray-700'}">
                        ${formatDate(task.dueDate)}
                    </span>
                ` : '<span class="text-sm text-gray-500">No due date</span>'}
            </td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button onclick='openTaskModal(${JSON.stringify(task).replace(/'/g, "&#39;")})' class="text-primary hover:text-primaryDark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button onclick="deleteTask('${task.id}')" class="text-red-600 hover:text-red-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });

    document.getElementById('showingCount').textContent = paginatedTasks.length;
    document.getElementById('totalCount').textContent = filteredTasks.length;

    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedTasks);
    });
}

function updateSelectedTasks() {
    selectedTasks = [];
    document.querySelectorAll('.task-checkbox:checked').forEach(checkbox => {
        selectedTasks.push(checkbox.dataset.taskId);
    });
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.task-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
    
    updateSelectedTasks();
}

function batchComplete() {
    if (selectedTasks.length === 0) {
        alert('Please select tasks first');
        return;
    }

    const tasks = StorageManager.getTasks() || [];
    selectedTasks.forEach(taskId => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'Done';
            StorageManager.addActivity(`Marked task "${task.title}" as complete`);
        }
    });

    StorageManager.setTasks(tasks);
    selectedTasks = [];
    document.getElementById('selectAll').checked = false;
    loadTasks();
    updateNotificationBadge();
}

function batchDelete() {
    if (selectedTasks.length === 0) {
        alert('Please select tasks first');
        return;
    }

    if (!confirm(`Delete ${selectedTasks.length} selected tasks?`)) {
        return;
    }

    let tasks = StorageManager.getTasks() || [];
    tasks = tasks.filter(task => !selectedTasks.includes(task.id));
    
    StorageManager.setTasks(tasks);
    StorageManager.addActivity(`Deleted ${selectedTasks.length} tasks`);
    
    selectedTasks = [];
    document.getElementById('selectAll').checked = false;
    loadTasks();
    updateNotificationBadge();
}

function deleteTask(taskId) {
    if (!confirm('Delete this task?')) {
        return;
    }

    let tasks = StorageManager.getTasks() || [];
    const task = tasks.find(t => t.id === taskId);
    tasks = tasks.filter(t => t.id !== taskId);
    
    StorageManager.setTasks(tasks);
    if (task) {
        StorageManager.addActivity(`Deleted task "${task.title}"`);
    }
    
    loadTasks();
    updateNotificationBadge();
}

function exportCSV() {
    const tasks = filteredTasks.length > 0 ? filteredTasks : StorageManager.getTasks() || [];
    
    if (tasks.length === 0) {
        alert('No tasks to export');
        return;
    }

    const headers = ['Title', 'Description', 'Priority', 'Status', 'Assignee', 'Due Date', 'Tags'];
    const csvContent = [
        headers.join(','),
        ...tasks.map(task => [
            `"${task.title.replace(/"/g, '""')}"`,
            `"${task.description.replace(/"/g, '""')}"`,
            task.priority,
            task.status,
            task.assignee || 'Unassigned',
            task.dueDate ? formatDate(task.dueDate) : '',
            `"${task.tags.join(', ')}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    StorageManager.addActivity('Exported tasks to CSV');
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function openAddTaskModal() {
    document.getElementById('modalTitle').textContent = 'Add New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('commentsList').innerHTML = '';
    document.getElementById('taskModal').classList.remove('hidden');
}

function openTaskModal(task) {
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
    loadTasks();
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