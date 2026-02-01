if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', function() {
        const currentUser = StorageManager.getCurrentUser();
        if (currentUser) {
            window.location.href = 'dashboard.html';
        }
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email === 'admin@task.com' && password === 'password') {
                const user = {
                    name: 'Admin User',
                    email: email,
                    initials: 'AD',
                    role: 'Project Manager'
                };
                
                StorageManager.setCurrentUser(user);
                
                if (!StorageManager.getTasks()) {
                    StorageManager.setTasks(sampleData.tasks);
                }
                
                if (!StorageManager.getActivities()) {
                    StorageManager.setActivities(sampleData.activities);
                }
                
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid credentials! Use admin@task.com / password');
            }
        });
    }
}

function checkAuth() {
    const currentUser = StorageManager.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}