function generateDynamicDates() {
    const today = new Date();
    const dates = [];
    
    for (let i = -5; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const formatted = date.toISOString().split('T')[0];
        dates.push(formatted);
    }
    
    return dates;
}

const dynamicDates = generateDynamicDates();

const sampleData = {
    teamMembers: [
        {
            id: 1,
            name: 'Sarah Johnson',
            initials: 'SJ',
            email: 'sarah.j@company.com',
            role: 'Frontend Developer',
            color: 'bg-blue-600'
        },
        {
            id: 2,
            name: 'Michael Chen',
            initials: 'MC',
            email: 'michael.c@company.com',
            role: 'Backend Developer',
            color: 'bg-green-600'
        },
        {
            id: 3,
            name: 'Emma Wilson',
            initials: 'EW',
            email: 'emma.w@company.com',
            role: 'UI/UX Designer',
            color: 'bg-purple-600'
        },
        {
            id: 4,
            name: 'David Martinez',
            initials: 'DM',
            email: 'david.m@company.com',
            role: 'QA Engineer',
            color: 'bg-orange-600'
        },
        {
            id: 5,
            name: 'Lisa Anderson',
            initials: 'LA',
            email: 'lisa.a@company.com',
            role: 'Product Manager',
            color: 'bg-pink-600'
        }
    ],

    tasks: [
        {
            id: 'task_1',
            title: 'Redesign Landing Page',
            description: 'Create a modern and responsive landing page with new branding guidelines',
            priority: 'High',
            status: 'In Progress',
            assignee: 'Emma Wilson',
            dueDate: dynamicDates[14],
            tags: ['design', 'frontend', 'urgent'],
            comments: [
                {
                    text: 'Working on the mockups now',
                    user: 'Emma Wilson',
                    time: '01/02/2025 09:30'
                }
            ],
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_2',
            title: 'Implement User Authentication',
            description: 'Set up JWT-based authentication system with refresh tokens',
            priority: 'High',
            status: 'In Progress',
            assignee: 'Michael Chen',
            dueDate: dynamicDates[12],
            tags: ['backend', 'security'],
            comments: [],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_3',
            title: 'Fix Mobile Navigation Bug',
            description: 'Navigation menu not closing properly on mobile devices',
            priority: 'Medium',
            status: 'To Do',
            assignee: 'Sarah Johnson',
            dueDate: dynamicDates[9],
            tags: ['bug', 'frontend', 'mobile'],
            comments: [],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_4',
            title: 'Database Performance Optimization',
            description: 'Optimize slow queries and add proper indexing',
            priority: 'High',
            status: 'Review',
            assignee: 'Michael Chen',
            dueDate: dynamicDates[16],
            tags: ['backend', 'performance', 'database'],
            comments: [
                {
                    text: 'Added indexes on user_id and created_at columns',
                    user: 'Michael Chen',
                    time: '31/01/2025 16:45'
                }
            ],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_5',
            title: 'Create Dashboard Charts',
            description: 'Implement interactive charts for analytics dashboard using Chart.js',
            priority: 'Medium',
            status: 'To Do',
            assignee: 'Sarah Johnson',
            dueDate: dynamicDates[19],
            tags: ['frontend', 'charts', 'analytics'],
            comments: [],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_6',
            title: 'Write API Documentation',
            description: 'Document all REST API endpoints with examples and response schemas',
            priority: 'Medium',
            status: 'In Progress',
            assignee: 'Lisa Anderson',
            dueDate: dynamicDates[22],
            tags: ['documentation', 'api'],
            comments: [],
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_7',
            title: 'Setup CI/CD Pipeline',
            description: 'Configure GitHub Actions for automated testing and deployment',
            priority: 'High',
            status: 'To Do',
            assignee: 'Michael Chen',
            dueDate: dynamicDates[24],
            tags: ['devops', 'automation'],
            comments: [],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_8',
            title: 'Design Mobile App Mockups',
            description: 'Create high-fidelity mockups for iOS and Android applications',
            priority: 'Medium',
            status: 'Review',
            assignee: 'Emma Wilson',
            dueDate: dynamicDates[18],
            tags: ['design', 'mobile', 'mockup'],
            comments: [
                {
                    text: 'iOS mockups completed, working on Android',
                    user: 'Emma Wilson',
                    time: '01/02/2025 11:20'
                }
            ],
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_9',
            title: 'Implement Email Notifications',
            description: 'Setup email service for task reminders and updates',
            priority: 'Low',
            status: 'To Do',
            assignee: 'Michael Chen',
            dueDate: dynamicDates[29],
            tags: ['backend', 'notifications', 'email'],
            comments: [],
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_10',
            title: 'Conduct User Testing',
            description: 'Run usability tests with 10 beta users and gather feedback',
            priority: 'High',
            status: 'Review',
            assignee: 'Lisa Anderson',
            dueDate: dynamicDates[15],
            tags: ['testing', 'ux', 'feedback'],
            comments: [
                {
                    text: 'Recruited 8 testers so far',
                    user: 'Lisa Anderson',
                    time: '31/01/2025 14:00'
                }
            ],
            createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_11',
            title: 'Optimize Image Loading',
            description: 'Implement lazy loading and WebP format for better performance',
            priority: 'Medium',
            status: 'Done',
            assignee: 'Sarah Johnson',
            dueDate: dynamicDates[7],
            tags: ['frontend', 'performance', 'optimization'],
            comments: [
                {
                    text: 'Implemented lazy loading with Intersection Observer',
                    user: 'Sarah Johnson',
                    time: '30/01/2025 17:30'
                }
            ],
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_12',
            title: 'Security Audit',
            description: 'Perform comprehensive security audit and fix vulnerabilities',
            priority: 'High',
            status: 'In Progress',
            assignee: 'Michael Chen',
            dueDate: dynamicDates[13],
            tags: ['security', 'audit', 'backend'],
            comments: [],
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_13',
            title: 'Create Design System',
            description: 'Build comprehensive design system with reusable components',
            priority: 'Medium',
            status: 'In Progress',
            assignee: 'Emma Wilson',
            dueDate: dynamicDates[26],
            tags: ['design', 'components', 'system'],
            comments: [],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_14',
            title: 'Implement Dark Mode',
            description: 'Add dark mode theme toggle with user preference storage',
            priority: 'Low',
            status: 'To Do',
            assignee: 'Sarah Johnson',
            dueDate: dynamicDates[32],
            tags: ['frontend', 'theme', 'feature'],
            comments: [],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_15',
            title: 'API Rate Limiting',
            description: 'Implement rate limiting to prevent API abuse',
            priority: 'High',
            status: 'Review',
            assignee: 'Michael Chen',
            dueDate: dynamicDates[11],
            tags: ['backend', 'security', 'api'],
            comments: [
                {
                    text: 'Using Redis for rate limit counters',
                    user: 'Michael Chen',
                    time: '01/02/2025 10:15'
                }
            ],
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_16',
            title: 'Accessibility Improvements',
            description: 'Ensure WCAG 2.1 AA compliance across all pages',
            priority: 'Medium',
            status: 'To Do',
            assignee: 'Emma Wilson',
            dueDate: dynamicDates[23],
            tags: ['accessibility', 'a11y', 'frontend'],
            comments: [],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_17',
            title: 'Payment Gateway Integration',
            description: 'Integrate Stripe payment processing for subscriptions',
            priority: 'High',
            status: 'To Do',
            assignee: 'Michael Chen',
            dueDate: dynamicDates[20],
            tags: ['backend', 'payment', 'integration'],
            comments: [],
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_18',
            title: 'Regression Testing',
            description: 'Run full regression test suite before release',
            priority: 'High',
            status: 'Done',
            assignee: 'David Martinez',
            dueDate: dynamicDates[5],
            tags: ['testing', 'qa', 'release'],
            comments: [
                {
                    text: 'All tests passed successfully',
                    user: 'David Martinez',
                    time: '01/02/2025 18:00'
                }
            ],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_19',
            title: 'Customer Onboarding Flow',
            description: 'Design and implement interactive onboarding tutorial',
            priority: 'Medium',
            status: 'In Progress',
            assignee: 'Emma Wilson',
            dueDate: dynamicDates[17],
            tags: ['ux', 'onboarding', 'tutorial'],
            comments: [],
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_20',
            title: 'Data Export Feature',
            description: 'Allow users to export their data in CSV and JSON formats',
            priority: 'Low',
            status: 'To Do',
            assignee: 'Sarah Johnson',
            dueDate: dynamicDates[31],
            tags: ['feature', 'export', 'frontend'],
            comments: [],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_21',
            title: 'Server Monitoring Setup',
            description: 'Configure monitoring and alerting for production servers',
            priority: 'High',
            status: 'Done',
            assignee: 'Michael Chen',
            dueDate: dynamicDates[4],
            tags: ['devops', 'monitoring', 'production'],
            comments: [
                {
                    text: 'Setup complete with Grafana dashboards',
                    user: 'Michael Chen',
                    time: '30/01/2025 16:00'
                }
            ],
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'task_22',
            title: 'Update Dependencies',
            description: 'Update all npm packages to latest stable versions',
            priority: 'Low',
            status: 'Review',
            assignee: 'Sarah Johnson',
            dueDate: dynamicDates[10],
            tags: ['maintenance', 'dependencies', 'security'],
            comments: [],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
    ],

    activities: [
        {
            id: 1,
            description: 'Marked task "Regression Testing" as complete',
            user: 'David Martinez',
            time: '01/02/2025 18:00'
        },
        {
            id: 2,
            description: 'Updated task "Security Audit"',
            user: 'Michael Chen',
            time: '01/02/2025 15:30'
        },
        {
            id: 3,
            description: 'Added comment to task "Design Mobile App Mockups"',
            user: 'Emma Wilson',
            time: '01/02/2025 11:20'
        },
        {
            id: 4,
            description: 'Moved task "API Rate Limiting" to Review',
            user: 'Michael Chen',
            time: '01/02/2025 10:15'
        },
        {
            id: 5,
            description: 'Created new task "Data Export Feature"',
            user: 'Lisa Anderson',
            time: '31/01/2025 17:45'
        },
        {
            id: 6,
            description: 'Added comment to task "Database Performance Optimization"',
            user: 'Michael Chen',
            time: '31/01/2025 16:45'
        },
        {
            id: 7,
            description: 'Updated task "Conduct User Testing"',
            user: 'Lisa Anderson',
            time: '31/01/2025 14:00'
        },
        {
            id: 8,
            description: 'Marked task "Server Monitoring Setup" as complete',
            user: 'Michael Chen',
            time: '30/01/2025 16:00'
        },
        {
            id: 9,
            description: 'Moved task "Optimize Image Loading" to Done',
            user: 'Sarah Johnson',
            time: '30/01/2025 17:30'
        },
        {
            id: 10,
            description: 'Created new task "Create Dashboard Charts"',
            user: 'Lisa Anderson',
            time: '30/01/2025 09:00'
        }
    ]
};