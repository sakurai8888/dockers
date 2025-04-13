
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');

const SECRET_KEY = process.env.SECRET_KEY || 'dMpfekFxB8zhXjzr';

// Middleware to generate JWT token
function generateToken(req, res, next) {
    const username = req.body.username;  // Assume username is sent in request body
    const userId = req.body.userId;      // Assume userId is also sent in request body

    // Create a JWT token
    const token = jwt.sign({ id: userId, username }, SECRET_KEY, { expiresIn: '30m' });

    // Set the JWT token in an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,         // Prevent client-side access to the cookie
        secure: true,           // Set to true if using HTTPS
        sameSite: 'Strict',     // SameSite attribute to prevent CSRF
        maxAge: 30 * 60 * 1000 // Cookie expiration (30 minutes)
    });

    // Proceed to the next middleware/route
    next();
}

// Route to access and generate the token
router.post('/login', generateToken, (req, res) => {
    res.json({ message: 'JWT token generated and stored in HTTP-only cookie.' });
});

module.exports = router;