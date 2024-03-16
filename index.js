const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const users = []; // Array to store user data

// Validation middleware for checking if required fields are present
const validateUser = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required!' });
    }
    next();
};

// GET all users
app.get('/users', (req, res) => {
    res.json(users);
});

// GET user by ID
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found!' });
    }
    res.json(user);
});

// CREATE a new user
app.post('/users', validateUser, (req, res) => {
    const { username, password } = req.body;
    const newUser = { id: Date.now().toString(), username, password };

    users.push(newUser);
    res.status(201).json(newUser);
});

// UPDATE user by ID
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body;

    if (!username && !password) {
        return res.status(400).json({ error: 'Either a username or password is required!' });
    }

    const userData = {};
    if(username){
        userData.username = username;
    }
    if(password){
        userData.password = password;
    }

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found!' });
    }

    users[userIndex] = { ...users[userIndex], ...userData };
    res.json(users[userIndex]);
});

// DELETE user by ID
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found!' });
    }

    const deletedUser = users.splice(userIndex, 1);
    res.json(deletedUser[0]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
