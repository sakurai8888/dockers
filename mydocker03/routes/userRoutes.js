const express = require('express');
const router = express.Router();

// In-memory array to hold user data for demonstration.



let users = [];



// GET /myusers - Get all users
router.get('/', (req, res) => {
    console.log('GET request received on /myusers'); // Debugging log
    res.json(users); // Responds with the users array
});

// POST /myusers - Create a new user
router.post('/', (req, res) => {
    const newUser = {
        id: users.length + 1, // Simple ID assignment
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});


// GET /users/:id - Get a user by ID
router.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);
    
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});


module.exports = router;