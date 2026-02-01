const StorageManager = {
    getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : null;
    },

    setTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    },

    getActivities() {
        const activities = localStorage.getItem('activities');
        return activities ? JSON.parse(activities) : null;
    },

    setActivities(activities) {
        localStorage.setItem('activities', JSON.stringify(activities));
    },

    addActivity(description, user = 'Admin User') {
        const activities = this.getActivities() || [];
        const now = new Date();
        const time = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        activities.unshift({
            id: Date.now(),
            description,
            user,
            time
        });

        if (activities.length > 50) {
            activities.pop();
        }

        this.setActivities(activities);
    },

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
};