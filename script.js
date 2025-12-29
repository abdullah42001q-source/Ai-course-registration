// public/script.js

// Tab Switching Logic
function showTab(tabName) {
    document.getElementById('registerTab').style.display = tabName === 'register' ? 'block' : 'none';
    document.getElementById('adminTab').style.display = tabName === 'admin' ? 'block' : 'none';
    
    // Agar admin tab khula hai to users fetch karo
    if(tabName === 'admin') {
        fetchUsers();
    }
}

// Handle Registration Form
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        whatsapp: document.getElementById('whatsapp').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        
        const msgDiv = document.getElementById('message');
        if (response.ok) {
            msgDiv.innerHTML = `<span style="color:green;">${result.message}</span>`;
            document.getElementById('registerForm').reset();
        } else {
            msgDiv.innerHTML = `<span style="color:red;">${result.message}</span>`;
        }

    } catch (error) {
        console.error('Error:', error);
    }
});

// Fetch and Display Users (Admin)
async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = ''; // Clear table

        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.whatsapp}</td>
                    <td style="font-weight:bold; color: ${user.status === 'Approved' ? 'green' : 'orange'}">${user.status || 'Pending'}</td>
                    <td>
                        <button class="action-btn btn-approve" onclick="updateStatus('${user.email}', 'Approved')">✔</button>
                        <button class="action-btn btn-reject" onclick="updateStatus('${user.email}', 'Rejected')">✖</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Update User Status
async function updateStatus(email, status) {
    await fetch('/api/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status })
    });
    fetchUsers(); // Refresh table
}
