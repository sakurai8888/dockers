
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


function validateToken(req, res, next) {
    // Read the token from the cookie
    const token = req.cookies.token; // Assuming you're storing the token in an HTTP-only cookie

    // If no token, return 401 Unauthorized
    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    // Verify the JWT token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden - Invalid token
        }
        // Attach the user info to request object
        req.user = user; 
        next(); // Proceed to the next middleware or route handler
    });
}



// Route to access and generate the token
router.post('/login', generateToken, (req, res) => {
    res.json({ message: 'JWT token generated and stored in HTTP-only cookie.' });
});


router.get('/protected', validateToken, (req, res) => {
    // If the token is valid, respond with user information or access to a resource
    res.json({ message: `Welcome, ${req.user.username}!`, userId: req.user.id });
});

module.exports = router;