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
const mongourl = 'mongodb://admin:Aa12345678@mongodb:27017/mydb01?authSource=admin';


// Init express app.
const app = express();


// Load functions 
const loadAddressesToRedis = require('./utils/redisLoader'); // Import the utility function


// LOAD Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Serve static files
app.use(express.static('public'));

// Load Routes
const userRoutes = require('./routes/userRoutes'); // Import user routes   
const sessionRoutes = require('./routes/sessionRoutes'); // Import user routes   
const authRoutes = require('./routes/auth'); // Import the auth routes



// Start try to connect Redis.
const redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });
  
(async () => {
    await redisClient.connect();
})();


redisClient.on('connect', () => {
    console.log('Connected to Redis...');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});




loadAddressesToRedis();





// Connect to MongoDB
mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const addressSchema = new mongoose.Schema({
    building: String,
    floor: Number,
    flat: Number,
    street_number: String,
    street_name: String,
    city: String,
    country: String,
    full_address: String
});

const Address = mongoose.model('mymongoaddresses', addressSchema, 'mymongoaddresses');

// API to search addresses
app.get('/api/addresses', async (req, res) => {
    const { query } = req.query;
    if (query.length < 3) {
        return res.status(400).json({ message: "Query must be at least 3 characters long." });
    }
    console.log(`Searching for addresses with query: "${query}"`);
    const addresses = await Address.find({ full_address: { $regex: query, $options: 'i' } }).limit(30);
    console.log(`Found addresses: ${JSON.stringify(addresses)}`);
    res.json(addresses);
});


//  To test .. just execute  'http://localhost:3000/api/rediscacheaddress/864'
app.get('/api/rediscacheaddress/:key', async (req, res) => {
    const key = req.params.key;

    try {
        console.log(`${key}`)
        const value = await redisClient.get(`addressid:${key}`); // Get value from Redis
        if (value) {
            const data = JSON.parse(value); // Convert back to JSON object
            res.json(data); // Respond with JSON
        } else {
            res.status(404).send('Data not found.');
        }
    } catch (err) {
        console.error('Error retrieving data from Redis:', err);
        res.status(500).send('Error retrieving data.');
    }
});


// Use any custom routes 
// Use Routes. 
app.use('/myusers', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/auth', authRoutes); 


// Start express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});