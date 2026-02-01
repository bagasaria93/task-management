function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function parseDate(dateString) {
    const parts = dateString.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
}

function getPriorityClass(priority) {
    const classes = {
        'High': 'priority-badge-high',
        'Medium': 'priority-badge-medium',
        'Low': 'priority-badge-low'
    };
    return classes[priority] || 'priority-badge-low';
}

function getStatusClass(status) {
    const classes = {
        'To Do': 'status-todo',
        'In Progress': 'status-progress',
        'Review': 'status-review',
        'Done': 'status-done'
    };
    return classes[status] || 'status-todo';
}

function updateNotificationBadge() {
    const tasks = StorageManager.getTasks() || [];
    const overdueTasks = tasks.filter(task => isOverdue(task.dueDate) && task.status !== 'Done');
    const badge = document.getElementById('notifBadge');
    if (badge) {
        badge.textContent = overdueTasks.length;
        badge.style.display = overdueTasks.length > 0 ? 'flex' : 'none';
    }
}

function generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getTeamMember(name) {
    return sampleData.teamMembers.find(member => member.name === name);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}