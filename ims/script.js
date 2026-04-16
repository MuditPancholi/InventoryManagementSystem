let userRegistrationChart = null;
let userRoleChart = null;
let userStatusChart = null;
let purchaseTrendChart = null;
let topProductsChart = null;
let revenueCategoryChart = null;
let stockLevelChart = null;
let categoryDistributionChart = null;
let lowStockChart = null;

let charts = {
    userRegistration: null,
    userRole: null,
    userStatus: null,
    purchaseTrend: null,
    topProducts: null,
    revenueCategory: null,
    stockLevel: null,
    categoryDistribution: null,
    lowStock: null
};

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usersList = document.getElementById('usersList');
    
    if (usersList) {
        usersList.innerHTML = users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>
                    <span class="status ${user.isApproved ? 'status-success' : 'status-warning'}">
                        ${user.isApproved ? 'Active' : 'Pending'}
                    </span>
                </td>
                <td>
                    ${user.role !== 'admin' ? `
                        <button onclick="deleteUser('${user.id}')" class="btn-icon">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }
}

function logout() {
    localStorage.removeItem('currentSession');
    window.location.href = 'login.html';
}

function initializeAdminDashboard() {
    const session = validateSession();
    if (!session || session.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Set user info
    document.getElementById('userFullName').textContent = session.username;
    document.getElementById('userRole').textContent = 'Administrator';

    // Load initial data
    loadDashboardStats();
    loadUsers();
    loadActivityLog();
    initializeCharts();
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers(); // Refresh the users list
        showSuccessMessage('User deleted successfully');
    }
}

// Function to clear all data and reset the system
function clearAllData() {
    if (confirm('WARNING: This will clear all system data including users, inventory, and settings. Are you sure?')) {
        localStorage.clear();
        initializeDefaultUsers(); // Reinitialize default users
        alert('All data has been cleared. The system has been reset to default state.');
        window.location.reload();
    }
}

// Function to reset just the current session
function resetSession() {
    localStorage.removeItem('currentSession');
    window.location.href = 'login.html';
}

// Initialize default users if none exist
function initializeDefaultUsers() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: 'admin_1',
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                isApproved: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'employee_1',
                username: 'employee',
                password: 'employee123',
                role: 'employee',
                isApproved: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'user_1',
                username: 'user',
                password: 'user123',
                role: 'user',
                isApproved: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier_1',
                username: 'supplier',
                password: 'supplier123',
                role: 'supplier',
                isApproved: true,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        console.log('Default users initialized:', defaultUsers);
    }
}

// Handle registration form submission
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultUsers();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            const role = document.getElementById('registerRoleSelect').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if username exists
            if (users.some(u => u.username === username)) {
                showError('Username already exists');
                return;
            }

            // Create new user
            const newUser = {
                id: 'user_' + Date.now(),
                username: username,
                password: password,
                role: role,
                isApproved: true,
                createdAt: new Date().toISOString()
            };

            // Add to users array
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Show success message
            showSuccessMessage('Registration successful! Redirecting to login...');

            // Redirect to login page
            setTimeout(() => {
                window.location.href = `login.html?role=${role}`;
            }, 1500);
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const role = document.getElementById('loginRoleSelect').value;

            // Get users from storage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find matching user
            const user = users.find(u => 
                u.username === username && 
                u.password === password && 
                u.role === role
            );

            if (!user) {
                showError('Invalid username or password');
                return;
            }

            // Create session
            const session = {
                userId: user.id,
                username: user.username,
                role: user.role,
                lastLogin: new Date().toISOString()
            };

            // Store session
            localStorage.setItem('currentSession', JSON.stringify(session));

            // Show success message
            showSuccessMessage(`Welcome ${user.username}!`);

            // Redirect based on role
            setTimeout(() => {
                switch(user.role) {
                    case 'admin':
                        window.location.href = 'admin-dashboard.html';
                        break;
                    case 'employee':
                        window.location.href = 'employee-dashboard.html';
                        break;
                    case 'user':
                        window.location.href = 'user-dashboard.html';
                        break;
                    case 'supplier':
                        window.location.href = 'supplier-dashboard.html';
                        break;
                    default:
                        window.location.href = 'index.html';
                }
            }, 1500);
        });
    }
});

// Helper functions for showing messages
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const errorText = document.getElementById('errorText');
    
    if (errorContainer && errorText) {
        errorText.textContent = message;
        errorContainer.style.display = 'flex';
        
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 3000);
    }
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const form = document.querySelector('form');
    if (form) {
        form.insertBefore(successDiv, form.firstChild);
    }
}

// Function to load dashboard statistics
function loadDashboardStats() {
    // Get data from localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];

    // Calculate user statistics by role
    const userStats = users.reduce((stats, user) => {
        stats[user.role] = (stats[user.role] || 0) + 1;
        return stats;
    }, {});

    // Calculate total revenue from purchases
    const totalRevenue = purchases.reduce((total, purchase) => {
        return total + (purchase.price * purchase.quantity);
    }, 0);

    // Update dashboard statistics with null checks
    const elements = {
        'totalEmployees': userStats.employee || 0,
        'totalUsers': userStats.user || 0,
        'totalSuppliers': userStats.supplier || 0,
        'totalRevenue': `$${totalRevenue.toFixed(2)}`,
        'totalItems': inventory.length,
        'lowStockItems': inventory.filter(item => item.quantity > 0 && item.quantity <= 5).length,
        'outOfStockItems': inventory.filter(item => item.quantity === 0).length,
        'lowStockBadge': inventory.filter(item => item.quantity > 0 && item.quantity <= 5).length,
        'noStockBadge': inventory.filter(item => item.quantity === 0).length
    };

    // Update each element if it exists
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });

    // Update recent activity
    const activityLog = document.getElementById('activityLog');
    if (activityLog) {
        const recentActivities = [
            ...purchases.map(p => ({
                type: 'purchase',
                text: `Purchase: ${p.itemName}`,
                amount: p.price * p.quantity,
                date: new Date(p.timestamp)
            })),
            ...inventory.map(i => ({
                type: 'inventory',
                text: `Stock update: ${i.name}`,
                amount: null,
                date: new Date(i.lastUpdated)
            }))
        ].sort((a, b) => b.date - a.date).slice(0, 5);

        activityLog.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <span class="activity-icon">
                    <i class="fas ${activity.type === 'purchase' ? 'fa-shopping-cart' : 'fa-box'}"></i>
                </span>
                <div class="activity-details">
                    <p>${activity.text} ${activity.amount ? `($${activity.amount.toFixed(2)})` : ''}</p>
                    <small>${activity.date.toLocaleString()}</small>
                </div>
            </div>
        `).join('') || '<p>No recent activity</p>';
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load initial dashboard stats
    loadDashboardStats();

    // Refresh stats every minute
    setInterval(loadDashboardStats, 60000);
});

// Update the loadSettings function
function loadSettings() {
    // Get settings from localStorage or use defaults
    const settings = JSON.parse(localStorage.getItem('systemSettings')) || {
        lowStockThreshold: 5,
        notifications: {
            lowStock: true,
            newUser: true
        }
    };

    // Update form values with null checks
    const lowStockThreshold = document.getElementById('lowStockThreshold');
    if (lowStockThreshold) {
        lowStockThreshold.value = settings.lowStockThreshold;
    }

    const lowStockAlerts = document.getElementById('lowStockAlerts');
    if (lowStockAlerts) {
        lowStockAlerts.checked = settings.notifications?.lowStock ?? true;
    }

    const newUserAlerts = document.getElementById('newUserAlerts');
    if (newUserAlerts) {
        newUserAlerts.checked = settings.notifications?.newUser ?? true;
    }

    // Add event listeners for settings forms with null checks
    const thresholdSettings = document.getElementById('thresholdSettings');
    if (thresholdSettings) {
        thresholdSettings.addEventListener('submit', saveThresholdSettings);
    }

    const notificationSettings = document.getElementById('notificationSettings');
    if (notificationSettings) {
        notificationSettings.addEventListener('submit', saveNotificationSettings);
    }
}

function saveThresholdSettings(event) {
    event.preventDefault();
    const settings = JSON.parse(localStorage.getItem('systemSettings')) || {};
    
    settings.lowStockThreshold = parseInt(document.getElementById('lowStockThreshold').value);
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    
    alert('Low stock threshold updated successfully!');
    loadDashboardStats(); // Refresh dashboard stats with new threshold
}

function saveNotificationSettings(event) {
    event.preventDefault();
    const settings = JSON.parse(localStorage.getItem('systemSettings')) || {};
    
    settings.notifications = {
        lowStock: document.getElementById('lowStockAlerts').checked,
        newUser: document.getElementById('newUserAlerts').checked
    };
    
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    alert('Notification settings saved successfully!');
}

function backupSystem() {
    const systemData = {
        inventory: JSON.parse(localStorage.getItem('inventory')) || [],
        users: JSON.parse(localStorage.getItem('users')) || [],
        settings: JSON.parse(localStorage.getItem('systemSettings')) || {},
        purchases: JSON.parse(localStorage.getItem('purchases')) || []
    };

    const dataStr = JSON.stringify(systemData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', 'ims_backup_' + new Date().toISOString() + '.json');
    exportLink.click();
}

function resetSystem() {
    if (confirm('WARNING: This will reset all system data. This action cannot be undone. Continue?')) {
        localStorage.clear();
        initializeDefaultUsers(); // Reinitialize default users
        alert('System has been reset to default settings.');
        window.location.reload();
    }
}

// Add this function to script.js
function loadActivityLog() {
    // Get data from localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];

    // Combine all activities with timestamps
    const activities = [
        ...inventory.map(item => ({
            type: 'inventory',
            action: 'updated',
            item: item.name,
            timestamp: item.lastUpdated,
            icon: 'fas fa-box'
        })),
        ...users.filter(user => user.createdAt).map(user => ({
            type: 'user',
            action: 'joined',
            item: user.username,
            timestamp: user.createdAt,
            icon: 'fas fa-user-plus'
        })),
        ...purchases.map(purchase => ({
            type: 'purchase',
            action: 'purchased',
            item: purchase.itemName,
            timestamp: purchase.timestamp,
            icon: 'fas fa-shopping-cart'
        }))
    ];

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Get recent activities (last 10)
    const recentActivities = activities.slice(0, 10);

    // Update activity log in the dashboard
    const activityLog = document.getElementById('activityLog');
    if (activityLog) {
        activityLog.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <span class="activity-icon"><i class="${activity.icon}"></i></span>
                <div class="activity-details">
                    <p>${activity.type === 'user' ? 
                        `New user ${activity.item} ${activity.action}` : 
                        `${activity.item} was ${activity.action}`}</p>
                    <small>${new Date(activity.timestamp).toLocaleString()}</small>
                </div>
            </div>
        `).join('') || '<p>No recent activity</p>';
    }
}

// Add this function to script.js
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
    }

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterItems);
    }

    // Stock filter
    const stockFilter = document.getElementById('stockFilter');
    if (stockFilter) {
        stockFilter.addEventListener('change', filterItems);
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('itemModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Add scroll event listener for inventory section
    const inventoryContainer = document.querySelector('.inventory-container');
    const inventoryHeader = document.querySelector('.inventory-header');

    if (inventoryContainer && inventoryHeader) {
        inventoryContainer.addEventListener('scroll', function() {
            if (this.scrollTop > 20) {
                inventoryHeader.classList.add('scrolled');
            } else {
                inventoryHeader.classList.remove('scrolled');
            }
        });
    }
}

// Add helper function for filtering items
function filterItems() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const stockFilter = document.getElementById('stockFilter')?.value || '';

    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const filteredItems = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        const matchesStock = !stockFilter || (
            stockFilter === 'low' ? (item.quantity > 0 && item.quantity <= 5) :
            stockFilter === 'out' ? item.quantity === 0 :
            stockFilter === 'available' ? item.quantity > 5 : true
        );

        return matchesSearch && matchesCategory && matchesStock;
    });

    // Update the display
    const grid = document.getElementById('inventoryGrid');
    if (grid) {
        grid.innerHTML = filteredItems.map(item => `
            <div class="inventory-card">
                <div class="item-image">
                    <img src="${item.image || 'placeholder.png'}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="quantity">Quantity: ${item.quantity}</p>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="item-actions">
                        <button onclick="editItem(${item.id})" class="btn-icon">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteItem(${item.id})" class="btn-icon">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('') || '<p class="no-data">No items found</p>';
    }
}

// Add these functions to handle report charts
function loadUserAnalytics() {
    // Destroy existing charts first
    if (charts.userRegistration) charts.userRegistration.destroy();
    if (charts.userRole) charts.userRole.destroy();
    if (charts.userStatus) charts.userStatus.destroy();

    // Create new charts
    const userRegCtx = document.getElementById('userRegistrationChart')?.getContext('2d');
    if (userRegCtx) {
        charts.userRegistration = new Chart(userRegCtx, {
            type: 'line',
            data: {
                labels: getLastSixMonths(),
                datasets: [{
                    label: 'New Users',
                    data: getUserRegistrationData(),
                    borderColor: '#4CAF50',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'User Registration Trend' }
                }
            }
        });
    }

    const roleCtx = document.getElementById('userRoleChart')?.getContext('2d');
    if (roleCtx) {
        charts.userRole = new Chart(roleCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(getRoleDistribution()),
                datasets: [{
                    data: Object.values(getRoleDistribution()),
                    backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0']
                }]
            }
        });
    }

    const statusCtx = document.getElementById('userStatusChart')?.getContext('2d');
    if (statusCtx) {
        charts.userStatus = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Inactive'],
                datasets: [{
                    data: getUserStatusDistribution(),
                    backgroundColor: ['#4CAF50', '#FF5252']
                }]
            }
        });
    }
}

function loadPurchaseAnalytics() {
    // Similar implementation for purchase analytics charts
    return [];
}

function loadInventoryAnalytics() {
    // Similar implementation for inventory analytics charts
    return [];
}

// Helper functions
function getLastSixMonths() {
    const months = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(currentDate.getMonth() - i);
        months.push(d.toLocaleString('default', { month: 'short' }));
    }
    return months;
}

function getMonthlyPurchaseData(purchases) {
    const monthlyData = {};
    getLastSixMonths().forEach(month => monthlyData[month] = 0);

    purchases.forEach(purchase => {
        const purchaseMonth = new Date(purchase.timestamp)
            .toLocaleString('default', { month: 'short' });
        if (monthlyData.hasOwnProperty(purchaseMonth)) {
            monthlyData[purchaseMonth] += purchase.price * purchase.quantity;
        }
    });

    return monthlyData;
}

function getTopSellingProducts(purchases) {
    const productSales = {};
    purchases.forEach(purchase => {
        productSales[purchase.itemName] = (productSales[purchase.itemName] || 0) + 
            (purchase.price * purchase.quantity);
    });

    return Object.entries(productSales)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
}

function getCategoryRevenue(purchases, inventory) {
    const categoryRev = {};
    purchases.forEach(purchase => {
        const item = inventory.find(i => i.id === purchase.itemId);
        if (item) {
            categoryRev[item.category] = (categoryRev[item.category] || 0) + 
                (purchase.price * purchase.quantity);
        }
    });
    return categoryRev;
}

// Add this function to handle simple report data
function loadSimpleReportData() {
    // Get data from localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];

    // Calculate total revenue
    const totalRevenue = purchases.reduce((total, purchase) => {
        return total + (purchase.price * purchase.quantity);
    }, 0);

    // Update simple report statistics
    if (document.getElementById('totalRevenueSimple')) {
        document.getElementById('totalRevenueSimple').textContent = `$${totalRevenue.toFixed(2)}`;
    }
    if (document.getElementById('totalUsersSimple')) {
        document.getElementById('totalUsersSimple').textContent = users.length;
    }
    if (document.getElementById('totalProductsSimple')) {
        document.getElementById('totalProductsSimple').textContent = inventory.length;
    }
    if (document.getElementById('lowStockItemsSimple')) {
        const lowStockCount = inventory.filter(item => item.quantity <= 5 && item.quantity > 0).length;
        document.getElementById('lowStockItemsSimple').textContent = lowStockCount;
    }

    // Update recent activity list
    const recentActivityList = document.getElementById('recentActivityList');
    if (recentActivityList) {
        const activities = [
            ...purchases.map(p => ({
                type: 'purchase',
                text: `Purchase: ${p.itemName}`,
                amount: p.price * p.quantity,
                date: new Date(p.timestamp)
            })),
            ...inventory.map(i => ({
                type: 'inventory',
                text: `Stock update: ${i.name}`,
                amount: null,
                date: new Date(i.lastUpdated)
            }))
        ].sort((a, b) => b.date - a.date).slice(0, 10);

        recentActivityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <span class="activity-icon">
                    <i class="fas ${activity.type === 'purchase' ? 'fa-shopping-cart' : 'fa-box'}"></i>
                </span>
                <div class="activity-details">
                    <p>${activity.text} ${activity.amount ? `($${activity.amount.toFixed(2)})` : ''}</p>
                    <small>${activity.date.toLocaleString()}</small>
                </div>
            </div>
        `).join('') || '<p>No recent activity</p>';
    }
}

// Add cleanup function
function cleanupCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    
    // Reset charts object
    charts = {
        userRegistration: null,
        userRole: null,
        userStatus: null,
        purchaseTrend: null,
        topProducts: null,
        revenueCategory: null,
        stockLevel: null,
        categoryDistribution: null,
        lowStock: null
    };
}

// Update showReportSection function
function showReportSection(reportType) {
    // Clean up existing charts
    cleanupCharts();

    // Show reports section
    showSection('reports');
    
    // Hide all report views
    document.querySelectorAll('.report-section').forEach(view => {
        view.style.display = 'none';
    });

    // Show and load the appropriate section
    const view = document.getElementById(reportType + 'View');
    if (view) {
        view.style.display = 'block';
        
        // Load appropriate charts
        switch(reportType) {
            case 'userAnalytics':
                loadUserAnalytics();
                break;
            case 'purchaseAnalytics':
                loadPurchaseAnalytics();
                break;
            case 'inventoryAnalytics':
                loadInventoryAnalytics();
                break;
        }
    }

    // Close dropdown after selection
    const dropdownMenu = document.getElementById('reportsDropdown');
    if (dropdownMenu) {
        dropdownMenu.style.display = 'none';
        document.querySelector('.dropdown')?.classList.remove('active');
    }
}

// Update the validateSession function
function validateSession() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    
    // Simple session check
    if (!session) {
        console.log('No session found');
        return null;
    }

    // Check if session has required fields
    if (!session.userId || !session.username || !session.role) {
        console.log('Invalid session structure:', session);
        localStorage.removeItem('currentSession');
        return null;
    }

    return session;
}

// Update dashboard stats
function updateDashboardStats() {
    const userId = getCurrentUserId();
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const userPurchases = purchases.filter(p => p.userId === userId);

    // Update total purchases
    if (document.getElementById('totalPurchases')) {
        document.getElementById('totalPurchases').textContent = userPurchases.length;
    }

    // Calculate and update total spent
    const totalSpent = userPurchases.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    if (document.getElementById('totalSpent')) {
        document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
    }

    // Update items bought
    const itemsBought = userPurchases.reduce((sum, p) => sum + p.quantity, 0);
    if (document.getElementById('itemsBought')) {
        document.getElementById('itemsBought').textContent = itemsBought;
    }
}

// Load purchase history
function loadPurchaseHistory() {
    const userId = getCurrentUserId();
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const userPurchases = purchases.filter(p => p.userId === userId);
    
    const purchaseHistory = document.getElementById('purchaseHistory');
    if (purchaseHistory) {
        purchaseHistory.innerHTML = userPurchases.map(purchase => `
            <div class="purchase-card">
                <div class="purchase-info">
                    <h3>${purchase.itemName}</h3>
                    <p class="price">$${purchase.price.toFixed(2)}</p>
                    <p class="quantity">Quantity: ${purchase.quantity}</p>
                    <p class="date">${new Date(purchase.timestamp).toLocaleString()}</p>
                </div>
            </div>
        `).join('') || '<p>No purchase history available</p>';
    }
}

// Get current user ID
function getCurrentUserId() {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    return session ? session.userId : null;
}

// Initialize dashboard
function initializeUserDashboard() {
    const session = validateSession();
    if (!session || session.role !== 'user') {
        window.location.replace('login.html');
        return;
    }

    // Set user info once
    const userNameElement = document.getElementById('userName');
    const userFullNameElement = document.getElementById('userFullName');
    
    if (userNameElement) userNameElement.textContent = session.username;
    if (userFullNameElement) userFullNameElement.textContent = session.username;
    
    // Load initial data once
    loadInventoryView();
    loadPurchaseHistory();
    updateDashboardStats();
    
    // Set date once
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString();
    }

    // Only update time display
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        // Initial time set
        timeElement.textContent = new Date().toLocaleTimeString();
        // Update time every second
        const timeInterval = setInterval(() => {
            timeElement.textContent = new Date().toLocaleTimeString();
        }, 1000);
    }
}

// Update document ready listener
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the dashboard
    if (document.getElementById('dashboard')) {
        initializeUserDashboard();
    }
    
    // Initialize default users if needed
    initializeDefaultUsers();
});

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', loadInventoryView);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', loadInventoryView);
    }
}

function loadInventoryView() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const userId = getCurrentUserId();
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || item.category === category;
        return matchesSearch && matchesCategory;
    });

    const inventoryGrid = document.getElementById('inventoryViewGrid');
    if (inventoryGrid) {
        inventoryGrid.innerHTML = filteredInventory.map(item => {
            const isWishlisted = wishlist.some(w => w.userId === userId && w.itemId === item.id);
            return `
                <div class="inventory-card">
                    <div class="item-image">
                        <img src="${item.image || 'placeholder.png'}" alt="${item.name}">
                        <button onclick="toggleWishlist(${item.id})" class="wishlist-btn ${isWishlisted ? 'active' : ''}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p class="category">${item.category || 'Uncategorized'}</p>
                        <p class="price">$${item.price.toFixed(2)}</p>
                        <p class="stock ${item.quantity <= 5 ? 'low-stock' : ''}">
                            ${item.quantity > 0 ? `Stock: ${item.quantity}` : 'Out of Stock'}
                        </p>
                        <button onclick="purchaseItem(${item.id})" class="btn btn-primary" 
                                ${item.quantity === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> Purchase
                        </button>
                    </div>
                </div>
            `;
        }).join('') || '<p class="no-data">No products available</p>';
    }
}

// Add this function to initialize sample products
function initializeSampleProducts() {
    if (!localStorage.getItem('inventory')) {
        const sampleProducts = [
            {
                id: 1,
                name: "Laptop Pro X",
                category: "electronics",
                price: 999.99,
                quantity: 15,
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                description: "High-performance laptop for professionals"
            },
            {
                id: 2,
                name: "Ergonomic Office Chair",
                category: "furniture",
                price: 199.99,
                quantity: 8,
                image: "https://images.unsplash.com/photo-1505797149-35ebcb05a6fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                description: "Comfortable office chair with lumbar support"
            },
            {
                id: 3,
                name: "4K Monitor",
                category: "electronics",
                price: 349.99,
                quantity: 0,
                image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                description: "Ultra HD monitor for crystal clear display"
            },
            {
                id: 4,
                name: "Wireless Mouse",
                category: "electronics",
                price: 29.99,
                quantity: 3,
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                description: "Ergonomic wireless mouse"
            },
            {
                id: 5,
                name: "Standing Desk",
                category: "furniture",
                price: 449.99,
                quantity: 12,
                image: "https://images.unsplash.com/photo-1505797149-35ebcb05a6fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                description: "Adjustable height standing desk"
            },
            {
                id: 6,
                name: "Mechanical Keyboard",
                category: "electronics",
                price: 89.99,
                quantity: 20,
                image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                description: "RGB mechanical gaming keyboard"
            },
            {
                id: 7,
                name: "Bookshelf",
                category: "furniture",
                price: 159.99,
                quantity: 5,
                image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                description: "Modern 5-tier bookshelf"
            },
            {
                id: 8,
                name: "Wireless Headphones",
                category: "electronics",
                price: 149.99,
                quantity: 0,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                description: "Noise-cancelling wireless headphones"
            }
        ];

        localStorage.setItem('inventory', JSON.stringify(sampleProducts));
    }
}

// Update the document ready listener to include product initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultUsers();
    initializeSampleProducts(); // Add this line
    
    // Rest of your existing code...
});

// Add these functions to your script section
function loadRecentPurchases() {
    const userId = getCurrentUserId();
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    // Get last 5 purchases
    const recentPurchases = purchases
        .filter(p => p.userId === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    const grid = document.getElementById('recentPurchasesGrid');
    if (grid) {
        grid.innerHTML = recentPurchases.map(purchase => {
            const item = inventory.find(i => i.id === purchase.itemId) || {};
            const totalPrice = purchase.price * purchase.quantity;
            
            return `
                <div class="purchase-card">
                    <div class="purchase-image">
                        <img src="${item.image || 'placeholder.png'}" alt="${purchase.itemName}">
                    </div>
                    <div class="purchase-info">
                        <h3>${purchase.itemName}</h3>
                        <div class="purchase-details">
                            <div class="detail-item">
                                <div class="detail-label">Price</div>
                                <div class="detail-value">$${purchase.price.toFixed(2)}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Quantity</div>
                                <div class="detail-value">${purchase.quantity}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Total</div>
                                <div class="detail-value">$${totalPrice.toFixed(2)}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Purchased</div>
                                <div class="detail-value">${new Date(purchase.timestamp).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('') || '<p class="no-data">No recent purchases</p>';
    }
}

function loadCategoryWisePurchases(category = '') {
    const userId = getCurrentUserId();
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    let filteredPurchases = purchases.filter(p => p.userId === userId);
    if (category) {
        filteredPurchases = filteredPurchases.filter(p => {
            const item = inventory.find(i => i.id === p.itemId);
            return item && item.category === category;
        });
    }

    const grid = document.getElementById('categoryWiseGrid');
    if (grid) {
        grid.innerHTML = filteredPurchases.map(purchase => {
            const item = inventory.find(i => i.id === purchase.itemId) || {};
            const totalPrice = purchase.price * purchase.quantity;
            
            return `
                <div class="purchase-card">
                    <div class="purchase-image">
                        <img src="${item.image || 'placeholder.png'}" alt="${purchase.itemName}">
                    </div>
                    <div class="purchase-info">
                        <h3>${purchase.itemName}</h3>
                        <span class="category-tag">${item.category || 'Uncategorized'}</span>
                        <div class="purchase-details">
                            <div class="detail-item">
                                <div class="detail-label">Price</div>
                                <div class="detail-value">$${purchase.price.toFixed(2)}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Quantity</div>
                                <div class="detail-value">${purchase.quantity}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Total</div>
                                <div class="detail-value">$${totalPrice.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('') || '<p class="no-data">No purchases found</p>';
    }
}

function filterByCategory(category) {
    loadCategoryWisePurchases(category);
}

// Update showSection function
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';

        // Load section-specific data
        if (sectionId === 'purchases') {
            loadPurchaseHistory();
        }
    }
}