let currentDate = new Date();
let selectedDate = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadTeamMembers();
    renderCalendar();
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

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    let tasks = StorageManager.getTasks();

    if (!tasks || tasks.length === 0) {
        tasks = sampleData.tasks;
        StorageManager.setTasks(tasks);
    }

    const tasksByDate = {};
    
    tasks.forEach(task => {
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            const dateKey = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getDate().toString().padStart(2, '0')}`;
            
            if (!tasksByDate[dateKey]) {
                tasksByDate[dateKey] = [];
            }
            tasksByDate[dateKey].push(task);
        }
    });
    
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day bg-gray-50 border border-gray-200 rounded-lg p-2';
        calendarGrid.appendChild(emptyCell);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        const cellDate = new Date(year, month, day);
        const dateKey = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        const isToday = cellDate.getTime() === today.getTime();
        const isSelected = selectedDate === dateKey;
        
        cell.className = `calendar-day bg-white border border-gray-200 rounded-lg p-2 cursor-pointer ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`;
        cell.onclick = () => showTasksForDate(dateKey);
        
        let cellContent = `<div class="font-semibold text-gray-800 mb-2">${day}</div>`;
        
        if (tasksByDate[dateKey]) {
            const dateTasks = tasksByDate[dateKey].slice(0, 3);
            cellContent += '<div class="space-y-1">';
            
            dateTasks.forEach(task => {
                let bgColor = 'bg-gray-100 text-gray-700';
                if (task.priority === 'High') bgColor = 'bg-red-100 text-red-700';
                else if (task.priority === 'Medium') bgColor = 'bg-orange-100 text-orange-700';
                else if (task.priority === 'Low') bgColor = 'bg-green-100 text-green-700';
                
                cellContent += `
                    <div class="text-xs ${bgColor} px-2 py-1 rounded truncate">
                        ${escapeHtml(task.title)}
                    </div>
                `;
            });
            
            if (tasksByDate[dateKey].length > 3) {
                cellContent += `<div class="text-xs text-gray-500 font-medium">+${tasksByDate[dateKey].length - 3} more</div>`;
            }
            
            cellContent += '</div>';
        }
        
        cell.innerHTML = cellContent;
        calendarGrid.appendChild(cell);
    }
}

function showTasksForDate(dateKey) {
    selectedDate = dateKey;
    renderCalendar();
    
    let tasks = StorageManager.getTasks();
    
    if (!tasks || tasks.length === 0) {
        tasks = sampleData.tasks;
        StorageManager.setTasks(tasks);
    }
    
    const dateTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const taskDateKey = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getDate().toString().padStart(2, '0')}`;
        return taskDateKey === dateKey;
    });
    
    const parts = dateKey.split('-');
    const displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    
    document.getElementById('selectedDate').textContent = displayDate;
    document.getElementById('tasksByDate').classList.remove('hidden');
    
    const tasksList = document.getElementById('dateTasksList');
    tasksList.innerHTML = '';
    
    if (dateTasks.length === 0) {
        tasksList.innerHTML = '<p class="text-gray-500 text-center py-4">No tasks for this date</p>';
        return;
    }
    
    dateTasks.forEach(task => {
        const priorityClass = getPriorityClass(task.priority);
        const statusClass = getStatusClass(task.status);
        const assignee = getTeamMember(task.assignee);
        
        const div = document.createElement('div');
        div.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer';
        div.onclick = () => openTaskModal(task);
        
        div.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-gray-800">${escapeHtml(task.title)}</h4>
                <span class="px-2 py-1 text-xs rounded-full font-medium ${priorityClass}">
                    ${task.priority}
                </span>
            </div>
            
            ${task.description ? `<p class="text-sm text-gray-600 mb-3">${escapeHtml(task.description)}</p>` : ''}
            
            <div class="flex items-center justify-between">
                <span class="status-badge ${statusClass}">${task.status}</span>
                ${assignee ? `
                    <div class="flex items-center space-x-2">
                        <div class="w-6 h-6 rounded-full ${assignee.color} text-white flex items-center justify-center text-xs font-semibold">
                            ${assignee.initials}
                        </div>
                        <span class="text-sm text-gray-700">${assignee.name}</span>
                    </div>
                ` : ''}
            </div>
        `;
        
        tasksList.appendChild(div);
    });
}

function openAddTaskModal() {
    document.getElementById('modalTitle').textContent = 'Add New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('commentsList').innerHTML = '';
    
    if (selectedDate) {
        document.getElementById('taskDueDate').value = selectedDate;
    }
    
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
    renderCalendar();
    
    if (selectedDate) {
        showTasksForDate(selectedDate);
    }
    
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