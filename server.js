// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// In-memory "Database" (Temporary storage)
let users = [];

// Route: Register User
app.post('/api/register', (req, res) => {
    const { name, email, phone, whatsapp, password } = req.body;

    // Check if user already exists
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email!' });
    }

    const newUser = {
        name,
        email,
        phone,
        whatsapp,
        password, // Real app me password hash karna chahiye
        status: 'Pending'
    };

    users.push(newUser);
    console.log('New User Registered:', newUser.name);
    res.status(201).json({ message: 'Registration Successful!' });
});

// Route: Get All Users (For Admin)
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Route: Update User Status
app.post('/api/update-status', (req, res) => {
    const { email, status } = req.body;
    const user = users.find(u => u.email === email);
    
    if (user) {
        user.status = status;
        res.json({ message: 'Status updated' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
