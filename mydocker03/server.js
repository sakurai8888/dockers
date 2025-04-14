// Load library
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

// Init Parameters
require('dotenv').config();    // Load .env data.
const PORT = process.env.PORT || 3000;   

// Init express app.
const app = express();

// Load functions 
const loadAddressesToRedis = require('./utils/redisLoader'); // Import the utility function
const { formatDate, createResponse } = require('./utils/examplefunctions').default; // Import multiple functions


// LOAD Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.use(express.static('public')); // Serve static files

// Load Routes
const userRoutes = require('./routes/userRoutes'); // Import user routes   
const sessionRoutes = require('./routes/sessionRoutes'); // Import user routes   
const authRoutes = require('./routes/auth'); // Import the auth routes
const mongoRoutes= require('./routes/mongoSearchRoutes');  // Import the mongo Search routes
const redisRoutes= require('./routes/rediscacheRoutes');  // Import the mongo Search routes


//Initial load redisCache
loadAddressesToRedis();



// Use any custom routes 
// Use Routes. 
app.use('/myusers', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/auth', authRoutes); 
app.use('/mongo', mongoRoutes); 
app.use('/redis', redisRoutes); 









// Routes to test multiple functions 


app.get('/testdate', (req, res) => {
    const currentDate = new Date(); // Get current date
    const formattedDate = formatDate(currentDate); // Use the utility function

    const response = createResponse(200, 'Date formatted successfully', { formattedDate });
    res.json(response); // Send the standardized response
});






// Start express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});