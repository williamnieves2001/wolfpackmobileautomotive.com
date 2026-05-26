const EMPLOYEES_KEY = 'wpEmployees';
const LOGIN_USER_KEY = 'wpEmployeeLoggedIn';
const LOGIN_ROLE_KEY = 'wpEmployeeRole';
const LOGIN_NAME_KEY = 'wpEmployeeName';

// Form submission handler
// Service details for modal
const SERVICE_DETAILS = {
    maintenance: {
        title: 'General Maintenance',
        details: [
            'Oil and filter changes',
            'Fluid top-ups and replacements',
            'Battery inspection and replacement',
            'Belt and hose maintenance',
            'Tune-up services',
            'Brake inspection and service',
        ]
    },
    rv: {
        title: 'RV Services',
        details: [
            'Interior systems inspection',
            'Roof, plumbing, and electrical checks',
            'Tank cleanings',
            'Water system disinfection',
            'Pre-trip readiness evaluations',
        ]
    },
    diagnostics: {
        title: 'Diagnostics',
        details: [
            'Computer diagnostics',
            'Check engine light diagnosis',
            'Performance testing',
        ]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Service modal logic for home page (only run if modal exists)
    (function() {
        const modal = document.getElementById('serviceModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDetails = document.getElementById('modalDetails');
        const closeModal = document.getElementById('closeModal');
        const serviceCards = document.querySelectorAll('.service-card[data-service]');
        if (modal && modalTitle && modalDetails && closeModal && serviceCards.length) {
            serviceCards.forEach(card => {
                card.addEventListener('click', function() {
                    const key = card.getAttribute('data-service');
                    const info = SERVICE_DETAILS[key];
                    if (info) {
                        modalTitle.textContent = info.title;
                        modalDetails.innerHTML = info.details.map(item => `<li>${item}</li>`).join('');
                        modal.classList.remove('hidden');
                        modal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                    }
                });
            });
            closeModal.addEventListener('click', function() {
                modal.classList.add('hidden');
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
            // Close modal on outside click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    })();
    initEmployeeAccounts();

    const vehicleForm = document.getElementById('vehicleForm');
    const employeeLoginForm = document.getElementById('employeeLoginForm');
    const logoutButton = document.getElementById('logoutButton');
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    const currentUserDisplay = document.getElementById('currentUserDisplay');

    if (vehicleForm) {
        vehicleForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state') ? document.getElementById('state').value : '',
                zip: document.getElementById('zip') ? document.getElementById('zip').value : '',
                code: document.getElementById('code').value,
                year: document.getElementById('year').value,
                make: document.getElementById('make').value,
                model: document.getElementById('model').value,
                licensePlate: document.getElementById('licensePlate').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                status: 'New',
                assignedTo: '',
                timestamp: new Date().toISOString()
            };

            let submissions = JSON.parse(localStorage.getItem('vehicleSubmissions')) || [];
            submissions.push(formData);
            localStorage.setItem('vehicleSubmissions', JSON.stringify(submissions));

            console.log('Form submitted:', formData);
            showSuccessMessage();
        });
    }

    if (employeeLoginForm) {
        employeeLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const loginError = document.getElementById('loginError');

            const employee = findEmployee(username, password);
            if (employee) {
                // Store login state in localStorage for persistence
                localStorage.setItem(LOGIN_USER_KEY, 'true');
                localStorage.setItem(LOGIN_ROLE_KEY, employee.role);
                localStorage.setItem(LOGIN_NAME_KEY, employee.username);
                window.location.href = 'admin.html';
            } else {
                if (loginError) {
                    loginError.classList.remove('hidden');
                }
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem(LOGIN_USER_KEY);
            localStorage.removeItem(LOGIN_ROLE_KEY);
            localStorage.removeItem(LOGIN_NAME_KEY);
            window.location.href = 'login.html';
        });
    }

    if (currentUserDisplay) {
        currentUserDisplay.textContent = localStorage.getItem(LOGIN_NAME_KEY) || 'Unknown';
    }

    if (document.body.contains(document.getElementById('submissionsList'))) {
        if (localStorage.getItem(LOGIN_USER_KEY) !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        renderEmployeeDashboard();
        initEmployeeManagement();
    }

    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addEmployee();
        });
    }
});

function initEmployeeAccounts() {
    if (!localStorage.getItem(EMPLOYEES_KEY)) {
        const employees = [
            { name: 'Master Admin', username: 'anarchy', password: 'teslas suck', role: 'master' }
        ];
        localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
    }

    // Seed a sample submission so dashboard shows something to act on if none exist
    if (!localStorage.getItem('vehicleSubmissions')) {
        const sample = [{
            name: 'Sample Customer',
            phone: '555-1234',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '90210',
            code: '',
            year: '2015',
            make: 'Toyota',
            model: 'Camry',
            licensePlate: 'ABC123',
            email: 'sample@example.com',
            message: 'Test submission',
            status: 'New',
            assignedTo: '',
            timestamp: new Date().toISOString()
        }];
        localStorage.setItem('vehicleSubmissions', JSON.stringify(sample));
    }
}

function getEmployeeByUsername(username) {
    if (!username) return null;
    return getEmployees().find(emp => emp.username === username) || null;
}

function getEmployees() {
    return JSON.parse(localStorage.getItem(EMPLOYEES_KEY)) || [];
}

function saveEmployees(employees) {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
}

function findEmployee(username, password) {
    return getEmployees().find(emp => emp.username === username && emp.password === password);
}

function addEmployee() {
    const name = document.getElementById('newName').value.trim();
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const errorBox = document.getElementById('employeeFormError');
    const successBox = document.getElementById('employeeFormSuccess');

    if (!name || !username || !password) {
        showEmployeeFormMessage(errorBox, 'Name, username, and password are all required.', true);
        return;
    }

    if (getEmployees().some(emp => emp.username === username)) {
        showEmployeeFormMessage(errorBox, 'That username already exists.', true);
        return;
    }

    const employees = getEmployees();
    employees.push({ name, username, password, role: 'employee' });
    saveEmployees(employees);
    renderEmployeeList();
    document.getElementById('addEmployeeForm').reset();
    showEmployeeFormMessage(successBox, 'Employee added successfully.', false);
}

function removeEmployee(username) {
    const employees = getEmployees().filter(emp => emp.username !== username);
    saveEmployees(employees);
    renderEmployeeList();
}

function initEmployeeManagement() {
    const managementBox = document.getElementById('employeeManagement');
    const role = localStorage.getItem(LOGIN_ROLE_KEY);
    // Only show employee management to master admin000
    if (managementBox) {
        if (role === 'master') {
            managementBox.classList.remove('hidden');
            renderEmployeeList();
        } else {
            managementBox.classList.add('hidden');
        }
    }
}

function renderEmployeeDashboard() {
    const submissions = getAllSubmissions();
    const submissionsList = document.getElementById('submissionsList');

    if (!submissionsList) return;

    if (submissions.length === 0) {
        submissionsList.innerHTML = '<p>No submissions yet.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'dashboard-table';
    const headerRow = document.createElement('tr');
    ['Name', 'Phone', 'Address', 'City', 'State', 'ZIP', 'Code', 'Year', 'Make', 'Model', 'License', 'Email', 'Notes', 'Status', 'Actions', 'Submitted'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    submissions.forEach((submission, index) => {
        const row = document.createElement('tr');
        [
            submission.name,
            submission.phone,
            submission.address,
            submission.city,
            submission.state || '-',
            submission.zip || '-',
            submission.code || '-',
            submission.year,
            submission.make,
            submission.model,
            submission.licensePlate,
            submission.email || '-',
            submission.message || '-',
            submission.status || 'New',
        ].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });

        const actionsCell = document.createElement('td');
        const currentUser = localStorage.getItem(LOGIN_NAME_KEY) || 'Unknown';
        const status = submission.status || 'New';

        const onItButton = document.createElement('button');
        onItButton.className = 'btn action-btn';
        onItButton.textContent = 'On it';
        // Show both buttons for every submission; disable only when already Done
        const isDone = status === 'Done';
        onItButton.disabled = isDone;
        onItButton.setAttribute('data-action', 'onit');
        onItButton.addEventListener('click', function() {
            updateSubmissionStatus(index, 'On it', currentUser);
        });
        actionsCell.appendChild(onItButton);

        const doneButton = document.createElement('button');
        doneButton.className = 'btn action-btn';
        doneButton.textContent = 'Done';
        doneButton.disabled = isDone;
        doneButton.setAttribute('data-action', 'done');
        doneButton.addEventListener('click', function() {
            updateSubmissionStatus(index, 'Done', currentUser);
        });
        actionsCell.appendChild(doneButton);

        row.appendChild(actionsCell);
        const timestampCell = document.createElement('td');
        timestampCell.textContent = new Date(submission.timestamp).toLocaleString();
        row.appendChild(timestampCell);

        table.appendChild(row);
    });

    submissionsList.innerHTML = '';
    submissionsList.appendChild(table);
}

function updateSubmissionStatus(index, status, assignedTo) {
    const submissions = getAllSubmissions();
    if (!submissions[index]) return;
    submissions[index].status = status;
    // Store the username of the employee who acted on this submission.
    // If assignedTo wasn't passed, use the currently logged-in username from localStorage.
    const actingUser = assignedTo || localStorage.getItem(LOGIN_NAME_KEY) || '';
    submissions[index].assignedTo = actingUser;
    localStorage.setItem('vehicleSubmissions', JSON.stringify(submissions));
    renderEmployeeDashboard();
    showStatusWindow(status, actingUser || 'Someone');
}

function showStatusWindow(status, displayName) {
    const statusWin = document.getElementById('statusWindow');
    if (!statusWin) return;
    const who = displayName || 'Someone';
    if (status === 'On it') {
        statusWin.textContent = `${who} is on it.`;
    } else if (status === 'Done') {
        statusWin.textContent = `${who} marked this done.`;
    } else {
        statusWin.textContent = `${who} set status: ${status}`;
    }
    statusWin.classList.remove('hidden');
    clearTimeout(showStatusWindow._timer);
    showStatusWindow._timer = setTimeout(() => {
        statusWin.classList.add('hidden');
    }, 4000);
}

function renderEmployeeList() {
    const employeeList = document.getElementById('employeeList');
    if (!employeeList) return;

    const employees = getEmployees();
    if (employees.length === 0) {
        employeeList.innerHTML = '<p>No employees configured.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'dashboard-table';

    const headerRow = document.createElement('tr');
    ['Name', 'Username', 'Role', 'Actions'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    employees.forEach(emp => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = emp.name || '-';
        const usernameCell = document.createElement('td');
        usernameCell.textContent = emp.username;
        const roleCell = document.createElement('td');
        roleCell.textContent = emp.role;
        const actionsCell = document.createElement('td');

        if (emp.role !== 'master') {
            const removeButton = document.createElement('button');
            removeButton.className = 'btn';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function() {
                if (confirm('Remove employee ' + emp.username + '?')) {
                    removeEmployee(emp.username);
                }
            });
            actionsCell.appendChild(removeButton);
        } else {
            actionsCell.textContent = '-';
        }

        row.appendChild(nameCell);
        row.appendChild(usernameCell);
        row.appendChild(roleCell);
        row.appendChild(actionsCell);
        table.appendChild(row);
    });

    employeeList.innerHTML = '';
    employeeList.appendChild(table);
}

function showEmployeeFormMessage(element, message, isError) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
    if (isError) {
        element.classList.add('form-error');
        element.classList.remove('success-message');
    } else {
        element.classList.add('success-message');
        element.classList.remove('form-error');
    }
    setTimeout(() => {
        element.classList.add('hidden');
    }, 3000);
}

// Display success message
function showSuccessMessage() {
    const form = document.getElementById('vehicleForm');
    const successMsg = document.getElementById('successMessage');

    if (form && successMsg) {
        form.style.display = 'none';
        successMsg.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
}

// Reset form and show input again
function resetForm() {
    const form = document.getElementById('vehicleForm');
    const successMsg = document.getElementById('successMessage');

    if (form && successMsg) {
        form.reset();
        form.style.display = 'block';
        successMsg.classList.add('hidden');
    }
}

// Future function for backend integration
function sendToBackend(formData) {
    // Example: send to your backend API
    // fetch('/api/submit-vehicle', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Backend response:', data);
    // })
    // .catch(error => {
    //     console.error('Backend error:', error);
    // });
}

// Get all submissions from localStorage (for admin/dashboard)
function getAllSubmissions() {
    return JSON.parse(localStorage.getItem('vehicleSubmissions')) || [];
}

// Clear all submissions (for admin)
function clearAllSubmissions() {
    if (confirm('Are you sure you want to clear all submissions?')) {
        localStorage.removeItem('vehicleSubmissions');
        console.log('All submissions cleared');
    }
}
